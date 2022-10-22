import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent, ColumnApi, ColumnVisibleEvent, CsvExportParams, } from 'ag-grid-community';
import { SessionService } from 'src/app/core/services/session.service';
import { Check, EditedCell, HeaderDict, TableIndicator, UndoData, undoType } from '../../models/table_models';
import { TableService } from '../../services/table.service';

@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})

export class ShowTableComponent implements OnInit {

  headers: Array<HeaderDict>;
  data: any = null;
  private gridApi!: GridApi;
  private columnApi!: ColumnApi;
  private colIds:string[];
  readonly LIMIT:number = 50; //limit undo niza
 
  indicator?:TableIndicator;
  editedCells:EditedCell[];
  deletedRows:number[];
  deletedCols:number[];
  undoData : UndoData[] = [];
  
  @Input() currentPage:number = 0;
  @Output() hideEvent; //Event koji se podize kad se nesto sakrije iz tabele
  @Output() undoEvent; //event koji se dize kada treba dis/enable undo dugme
  @Output() errorEvent; //event koji se dize kada se unese pogresan tip(npr string za int)

  columnDefs: ColDef[];
  rowData: any[];
  public rowSelection;
  public paginationPageSize;
  tableStyle:string;
  tableClass:string;
  paginationEnabled:boolean;
  animateRowsEnabled:boolean;
  moveAnimationEnabled:boolean;
  suppressDragLeaveHidesColumnsEnabled:boolean;
  undoRedoCellEditing:boolean;
  undoRedoCellEditingLimit:number;
  enableCellChangeFlash:boolean ;
  
  constructor(private tableService:TableService, private sessionService:SessionService) {
    this.columnDefs = [];
    this.rowData = new Array();
    this.headers = [];
    this.rowSelection = 'multiple';
    this.paginationPageSize = 10;
    this.tableStyle = "height: 520px;";
    this.tableClass = "ag-theme-alpine";
    this.paginationEnabled = true;
    this.moveAnimationEnabled = false;
    this.animateRowsEnabled = true;
    this.suppressDragLeaveHidesColumnsEnabled = false;
    this.undoRedoCellEditing = true;
    this.undoRedoCellEditingLimit = 20;
    this.enableCellChangeFlash = true;
    this.colIds = [];
    this.deletedRows = [];
    this.deletedCols = [];
    this.editedCells = [];
    this.hideEvent = new EventEmitter<Check>();
    this.undoEvent = new EventEmitter<boolean>();
    this.errorEvent = new EventEmitter<boolean>();
  }

  ngOnInit(): void 
  {
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    if (this.currentPage != 0 || (this.currentPage == 0 && this.getCurrentPage() != 0)) 
      this.setCurrentPage(this.currentPage);
  }
  
  isReady()
  {
    if (this.gridApi) return true;
    return false;
  }

  prepareTable(indicator:TableIndicator, data: any, headers: Array<HeaderDict>) {
    
    this.data = data;
    this.indicator = indicator;
    this.headers = headers;

    this.columnDefs = [];
    this.rowData = [];

    this.setColumnDefs(indicator);

    if(indicator == TableIndicator.DATA_MANIPULATION || indicator == TableIndicator.OTHER)
    {
      this.deletedRows = [];
      this.deletedCols = [];
      this.editedCells = [];
      this.undoData = [];

      this.rowData = data;
      return;
    }
    
    if(indicator === TableIndicator.INFO) {
      this.rowData.push({...data[0]});
    }
    else if(indicator === TableIndicator.PREVIEW || indicator === TableIndicator.STATS) {
      let columns: Array<string> = data.columns;

      if (columns != undefined)
      {
        if(columns.length > 0) {
          for (let i = 0; i < data.data.length; i++) {
            let row = {[columns[0]] : data.data[i][0]};
  
            for (let j = 1; j < columns.length; j++) {
              row = {...row, [columns[j]] : data.data[i][j]};
            }
            this.rowData.push(row);
          }
  
          if(indicator === TableIndicator.PREVIEW)
            this.tableService.resetVisibility(this.columnApi,this.colIds);
          else {
            for (let i = 0; i < this.rowData.length; i++) {
              this.rowData[i] = {'Column name' : data.index[i], ...this.rowData[i]};
            }
          }
        }

      }
      
    }
  }

  onCellValueChanged(params:CellValueChangedEvent)
  {
    //console.log(params);
    var editedCellIndex; 
    var row = this.rowData.findIndex((x: any) => x == params.data)
    var colId = parseInt(params.column.getColId());

    var newValue = this.tableService.onCellValueChanged(this.gridApi, params,params.data,this.headers);
    //console.log(newValue);
    if (newValue !== undefined)
    {
      this.errorEvent.emit(false);
      //console.log(newValue);
      this.addUndoElement(new UndoData(undoType.EDIT,params));
      if ((editedCellIndex = this.editedCells.findIndex(element => element.col == colId && element.row == row)) != -1) //ukoliko vec postoji u objektu
      {
        if (this.data[row][this.headers[colId].name] == newValue) //provera da se ne salje originalna vrednost za izmenu
        { 
          this.editedCells.splice(editedCellIndex,1);
          //console.log("Napisao si oridjidji vrednost")
        }
        else 
          this.editedCells[editedCellIndex].value = newValue? newValue.toString() : "";

      }
      else 
        this.editedCells.push(new EditedCell(row,colId,newValue? newValue.toString() : ""));
    }
    else{
      this.errorEvent.emit(true);
    }
    
    //console.log(this.editedCells);
    this.emitUndoEvent();
 }

  setRowData(rowData:any[]){
    this.rowData = rowData;
  }
  
  setColumnDefs(indicator:TableIndicator)
  {
    this.colIds = [];
    if (indicator == TableIndicator.DATA_MANIPULATION || indicator == TableIndicator.PREVIEW || indicator == TableIndicator.OTHER)
    {
      for (let header of this.headers) 
      {
        this.colIds.push(header.key.toString());
        var col = {
          colId: header.key.toString(),
          flex: 1,
          field: header.name,
          filter: 'agTextColumnFilter',
          editable: indicator == TableIndicator.DATA_MANIPULATION ? true : false,
          resizable: true,
          sortable: true,
          minWidth: 100,
          lockVisible: indicator == TableIndicator.DATA_MANIPULATION ? true : false
        }
        this.columnDefs.push(col);
      }
    }
    else if (indicator == TableIndicator.INFO || indicator == TableIndicator.STATS)
    {
      this.rowSelection = "none";
      if (indicator == TableIndicator.STATS) //postavi indicator kao prvu kolonu
      {
        const index = this.headers.findIndex((element) => element.name == "indicator");
        if (index != -1) [this.headers[0], this.headers[index]] = [this.headers[index], this.headers[0]];
      }
      for (let header of this.headers) 
      {
        //this.colIds.push(header.key.toString()); 
        var col2 = {
          colId: header.key.toString(),
          flex: 1,
          field: header.name,
          resizable: true,
          minWidth: 50,
          lockPosition:true
        }
        this.columnDefs.push(col2);
      }
    }
  }
  
  removeRows(rowsToDelete:object[])
  {
    const res = this.gridApi.applyTransaction({remove:rowsToDelete});

    return res;
  }

  updateRows(rowsToUpdate:object[])
  {
    const res = this.gridApi.applyTransaction({update:rowsToUpdate});

    return res;
  }
  
  onRemoveSelected() 
  {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.removeRows(selectedData);

    if (res?.remove.length! > 0) this.addUndoElement(new UndoData(undoType.DELETE,res?.remove));

    for (let sData of res?.remove!) 
    {
      this.deletedRows.push(this.rowData.findIndex((x: any) => x == sData.data));
    }

    this.emitUndoEvent();
    //console.log(this.deletedRows);
  }

  onUndo()
  {

    if (this.undoData.length)
    {
      const res = this.undoData.pop();

      if (res?.type == undoType.EDIT)
      {
        var data = res.data;
        
        data.node.data[data.column.colDef.field] = data.oldValue;

        this.updateRows([data.node.data]);

        var rowIndex = this.rowData.findIndex((x: any) => x == data.node.data);

        var index = this.editedCells.findIndex(x => x.row == rowIndex && x.col == data.column.getColId())
        
        if (index != -1) 
        {     
          if (this.data[this.editedCells[index].row][data.column.colDef.field] == data.oldValue) 
          {
            //ukoliko je vraceno na originalnu vrednost, izbacuje se iz niza
            this.editedCells.splice(index, 1);
          }
          else
            this.editedCells[index].value = data.oldValue.toString();
        }
        else{ //ukoliko se sa originalne vrednosti uradi undo na promenjenu, potrebno je ponovo dodati vrednost u edited niz
          this.editedCells.push(new EditedCell(rowIndex,parseInt(data.column.getColId()),data.oldValue.toString()));
        }
      }
      else
      {
        var data = res?.data;
        data.forEach((element: any) => {
          var res = this.gridApi.applyTransaction({ add: [element.data], addIndex: parseInt(element.childIndex) });
          this.deletedRows.pop();
        });
      }
      this.emitUndoEvent();
    }
  }

  addUndoElement(element:UndoData)
  {
    if (this.undoData.length == this.LIMIT)
    {
      this.undoData.shift();
      this.undoData.push(element);
      return;
    }
    this.undoData.push(element);
  }

  emitUndoEvent()
  {
    if (this.undoData.length)
    {
      this.undoEvent.emit(true);
    }
    else this.undoEvent.emit(false);
  }

  //Kada se promeni u checkboxu, mora da se prikaze ili sakrije i u tabeli
  changeColomnVisibility(id: string, visible: boolean) {
    this.columnApi.setColumnVisible(id, visible);
  }

  moveColumn(key:string) {
    this.columnApi.moveColumn(key, 0);
  }
  //Salje obavestenje Label komponenti ukoliko se dragguje kolona iz tabele, da se to azurira i na checkbox-u
  onColumnVisible(e: ColumnVisibleEvent) {

    if (e.source == "uiColumnDragged") {
      if (e.visible == false) {
        this.hideEvent.emit(new Check(parseInt(e.columns![0].getColId()), false));
      }
      else {
        this.hideEvent.emit(new Check(parseInt(e.columns![0].getColId()), true));
      }
      console.log('Event Column Visible', e);
    }
  }
  
  setTableStyle(style:string)
  {
    this.tableStyle = style;
  }
  setPaginationEnabled(paginationEnabled:boolean)
  {
    this.paginationEnabled = paginationEnabled;
  }

  setPaginationPageSize(paginationPageSize:number){
    this.paginationPageSize = paginationPageSize;
  }

  getCurrentPage()
  {
    return this.gridApi.paginationGetCurrentPage();
  }
  setCurrentPage(page:number)
  {
    this.gridApi.paginationGoToPage(page);
  }

  //Lock-uje kolonu koja je odabrana za label tako da ne moze da se hide-uje iz tabele
  changeLabelColumn(data:{id:number,previousTargetId:number | null })
  {
    if (data.previousTargetId != null)
    {
      this.columnDefs.forEach(element=>{
        if (element.colId == data.id.toString())
        {
          element.lockVisible  = true;

        }
        else if (element.colId == data.previousTargetId!.toString()){
          element.lockVisible  = false;
        }
      });
    }
    else
    {
      this.columnDefs.forEach(element=>{
        if (element.colId == data.id.toString())
        {
          element.lockVisible  = true;
        }
      });
    }

    this.changeColomnVisibility(data.id.toString(),true);
    this.gridApi.setColumnDefs(this.columnDefs);
  }
  
  downloadFile(){
    this.gridApi.exportDataAsCsv();
  }
  
  paginationGetTotalPages(){
    return this.gridApi.paginationGetTotalPages();
  }
}

