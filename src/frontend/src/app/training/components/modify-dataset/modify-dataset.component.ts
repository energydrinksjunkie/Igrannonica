import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HeaderDict, TableIndicator } from '../../models/table_models';
import { ShowTableComponent } from '../show-table/show-table.component';

@Component({
  selector: 'app-modify-dataset',
  templateUrl: './modify-dataset.component.html',
  styleUrls: ['./modify-dataset.component.css']
})
export class ModifyDatasetComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('modifyTable') private modifyTable!: ShowTableComponent;
  @Input() table_data:any;
  @Input() header:HeaderDict[] = [];
  @Input() undoDisabled:boolean = true;
  @Input() currentPage:number = 0;

  @Output() changeEvent = new EventEmitter<boolean>();
  errorMessage:string = "";

  constructor(private cd: ChangeDetectorRef) 
  {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.table_data = changes['table_data'].currentValue;
    //this.header = changes['header'].currentValue;
    this.refreshView();
  }

  ngOnInit(): void 
  {
    this.changeEvent.emit(false);
  }

  refreshView()
  {
    if (this.modifyTable) 
    {
      this.modifyTable.prepareTable(TableIndicator.DATA_MANIPULATION, this.table_data, this.header);
      if(this.modifyTable.isReady()) 
        this.modifyTable.setCurrentPage(this.currentPage);
    }
  }

  ngAfterViewInit() {
    this.refreshView();

    this.cd.detectChanges();
  }

  onRemoveSelected()
  {
    this.modifyTable.onRemoveSelected();
  }

  onUndo()
  {
    this.modifyTable.onUndo();
  }

  enableUndo(indicator:boolean)
  {
    if (indicator) 
    {
      this.undoDisabled = false;
      this.changeEvent.emit(true);
    }
    else 
    {
      this.undoDisabled = true;
      this.changeEvent.emit(false);
    }
  }

  showErrorMessage(errorIndicatior:boolean)
  {
    if(errorIndicatior)
    {
      this.errorMessage = "You cannot input categorical value in field for numerical value"; // TODO - razmotriti bolji opis greske
      setTimeout(() => {
      this.errorMessage = "";
      }, 3000); 
    }
    else{
      this.errorMessage = "";
    }

  }

  getEditedCells()
  {
    return this.modifyTable.editedCells;
  }

  getDeletedRows()
  {
    return this.modifyTable.deletedRows;
  }

  getDeletedCols()
  {
    return this.modifyTable.deletedCols;
  }
  getRowData()
  {
    return this.modifyTable.rowData;
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if (this.undoDisabled) return true;
    return false;
  }
  
  setCurrentPage(page:number){
    this.modifyTable.setCurrentPage(page);
  }
  
  getCurrentPage(){
    return this.modifyTable.getCurrentPage();
  }
}
