import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Check, ChosenColumn, ModifiedData, Stats, TableIndicator } from '../models/table_models';
import { HeadersService } from '../services/headers.service';
import { DatasetService } from '../services/dataset.service';
import { LabelsComponent } from '../components/labels/labels.component';
import { ShowTableComponent } from '../components/show-table/show-table.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { StatsComponent } from '../components/stats/stats.component';
import { UploadComponent } from '../components/upload/upload.component';
import { ModifyDatasetComponent } from '../components/modify-dataset/modify-dataset.component';
import { SessionService } from 'src/app/core/services/session.service';
import { ColumnFillMethodPair } from '../models/dataset_models';
import { View, DisplayType } from '../../shared/models/navigation_models';
import { JwtService } from 'src/app/core/services/jwt.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-training-view',
  templateUrl: './training-view.component.html',
  styleUrls: ['./training-view.component.css']
})
export class TrainingViewComponent implements OnInit {

  /* ********************** */
  /* podaci */
  /* ****************************************************** */
  datasetId:number = -1;
  datasetURL:string = "";
  userId:number = -1;
  statsData?:Stats;

  viewIndicator:View = View.UPLOAD;
  datasetSource: string = '';

  fileName:string = "";
  datasetName:string = "";
  numOfMissingValues:number = 0;
  numOfMissingArray:any;
  missingIndicator:boolean = false;
  linearStepper:boolean = true;
  currentPage:number = 1;
  firstPageView:boolean = true;

  dialogTitle:string = "";
  dialogMessage:string = "";
  errorMessage:string = "";

  uploadCompleted:boolean = false;
  
  public form: FormData = new FormData();
  public choosenInAndOutCols:any = undefined;

  maxPages = Infinity;
  maxPagesModiify = Infinity;
  minPages = 1;
  
  formPages=new FormGroup({
    currentPage:new FormControl('1',[Validators.required])
  })
  
  formPagesModify=new FormGroup({
    currentPageModify:new FormControl('1',[Validators.required])
  })

  /* ********************** */
  /* promenljive za display */
  /* ****************************************************** */
  loaderDisplay:string = DisplayType.HIDE;
  loaderMiniDisplay:string = DisplayType.HIDE;

  stepperDisplay:string =DisplayType.SHOW_AS_BLOCK;
  trainingDisplay:string = DisplayType.HIDE;

  mainContainerDisplay:string = DisplayType.SHOW_AS_FLEX;
  statsViewDisplay:string = DisplayType.HIDE;

  /* ********************** */
  /* promenljive za disabled direktivu */
  /* ****************************************************** */
  undoDisabled:boolean = true;
  nextButtonDisable:boolean = true;
  backButtonDisable:boolean = true;
  modifyChangeButtons:boolean = false;
  myDatasets:any[]=[];
  
  /* ********************** */
  /* promenljive za kontrolu prikaza (ngIF, typescript, ...) */
  /* ****************************************************** */
  modalDisplay:boolean = false;
  errorDisplay:boolean = false;
  confirmation:boolean = false;
  showColumnSelectionPage: boolean = true

  constructor(
    private datasetService: DatasetService, 
    private headersService: HeadersService,
    public dialog: MatDialog,
    private jwtService: JwtService,
    private sessionService: SessionService,
    private authService: AuthService,
    private cd: ChangeDetectorRef ) {
    }
   
  @ViewChild('upload') private upload!:UploadComponent;
  @ViewChild('dataTable') private dataTable!: ShowTableComponent;
  @ViewChild('dataSetInformation') private dataSetInformation!: ShowTableComponent;
  @ViewChild('columnsSelecion') private labels!: LabelsComponent;
  @ViewChild('Stats') private stats!:StatsComponent;
  @ViewChild('modifyModal') private modifyModal!:ModifyDatasetComponent;


  req : any = {
    "public": true,
    "userID": 0,
    "description": "string",
    "name": "string",
    "datasetSource": "TODO",
    "delimiter": null,
    "lineTerminator": null,
    "quotechar": null,
    "escapechar": null,
    "encoding": null
  }   

  uploadObserver:any = {
    next: (response:any) => { 
      console.log("### next@uploadObserver")
      //console.log(response);

      this.datasetId = response;

      if (this.datasetId != undefined)
      {
        this.uploadCompleted = true;
        this.sessionService.saveData('dataset_id',this.datasetId.toString());
        this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
      }
      else
      {
        this.showUploadErrorMessage("There was problem while fetching data. Please try again later")
      }
      
    },
    error: (err: Error) => {
      console.log("### error@uploadObserver")
      //console.log(err.message)
      this.showUploadErrorMessage(err.message);
    }
  };

  changeInfoObserver:any = {
    next: (response:any) => { 
      console.log("### next@changeInfoObserver")
      this.sessionService.saveData('dataset_name', this.datasetName);
      this.setView(View.PREVIEW);
      
    },
    error: (err: Error) => {
      console.log("### error@changeInfoObserver")
      //console.log(err.message)
      this.showUploadErrorMessage(err.message);
    }
  };

  myDatasetsObserver:any = {
    next: (response:any) => { 
      console.log("### next@myDatasetsObserver");
      console.log(response);
      this.myDatasets=response;
    },
    error: (err: Error) => {
      console.log("### error@myDatasetsObserver");
      console.log(err);
    }
  };

  fetchTableDataObserver:any = {
    next: (response:any) => { 
      
      if(this.currentPage != 1) {
        this.currentPage = 1;
        this.formPages.controls['currentPage']!.setValue(1);
        this.formPagesModify.controls['currentPageModify']!.setValue(1); 
        this.dataTable.setCurrentPage(0);
      }
      
      this.showElements();

      var headerDataTable = this.headersService.getDataHeader(response['columnTypes']);
      this.dataTable.prepareTable(TableIndicator.PREVIEW, response['parsedDataset'], headerDataTable);
      
      this.numOfMissingValues = response['basicInfo']['missing values count'];
      this.missingIndicator = !this.missingIndicator;

      this.labels.onDatasetSelected(headerDataTable);
      this.stats.showInfo([response['basicInfo']]);
      this.numOfMissingArray = response['missingValues'];
      this.stats.showMissingValues([response['missingValues']]);

      this.datasetService.getStatIndicators(this.datasetId).subscribe(this.fetchStatsDataObserver);
      this.datasetService.getCorrMatrix(this.datasetId).subscribe(this.fetchCorrMatrixObserver);
    },
    error: (err: Error) => {
      console.log(err);
      this.showUploadErrorMessage(err.message);
    }
  };

  fetchStatsDataObserver:any = {
    next: (response:any) => { 
        console.log("dashboard > DashboardComponent > fetchStatsDataObserver > next:")
        this.statsData = new Stats(response['categorical'],response['continuous']);
        this.stats.showTables(response);
   
    },
    error: (err: Error) => {
      console.log("dashboard > DashboardComponent > fetchStatsDataObserver > error:")
      console.log(err)
    }
  };

  fetchCorrMatrixObserver:any = {
    next: (response:any) => { 
        console.log("dashboard > DashboardComponent > fetchCorrMatrixObserver > next:")
        //console.log(response)
        this.stats.showMatrix(response);
        
    },
    error: (err: Error) => {
      console.log("dashboard > DashboardComponent > fetchCorrMatrixObserver > error:")
      console.log(err)
    }
  };

  ngOnInit(): void 
  {
    var decodedToken = this.jwtService.getDecodedAccessToken();

    if(!decodedToken) {
      this.authService.logout('session_expired')
    }

    let userIdTemp = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'];

    if(!userIdTemp) {
      this.authService.logout('session_expired')
    }
    this.userId = userIdTemp;

    this.sessionService.saveData('user_id', this.userId.toString());
    
    this.datasetService.getDatasets().subscribe(this.myDatasetsObserver);
    if (this.sessionService.getData('dataset_id') != null) 
    {
      this.uploadCompleted = true;
      this.firstPageView = false;
      this.datasetId = parseInt(this.sessionService.getData('dataset_id')!);
      if(this.sessionService.getData('dataset_name') != null)
      {
        this.datasetName = this.sessionService.getData('dataset_name')!;
      }
      else if (this.sessionService.getData('dataset_link_name') != null)
      {
        this.datasetName = this.sessionService.getData('dataset_link_name')!;
      }
      this.hideElements();
      this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
    }
    
    
    let lastVisitedPage =  this.sessionService.getData('view');

    if (lastVisitedPage == null) {
      this.sessionService.saveData('view',this.viewIndicator.toString());
    }
    else  {
      this.setView(parseInt(lastVisitedPage));

      if (this.viewIndicator == View.TRAINING) this.trainingDisplay = DisplayType.SHOW_AS_BLOCK;

      // TODO proveriti da li ovde treba da se odradi i loading ostalih podataka 
      // na datoj stranici
    }  
  }

  hideElements()
  {
    this.stepperDisplay = DisplayType.HIDE;
    this.loaderDisplay = DisplayType.SHOW_AS_BLOCK;
  }

  showElements()
  {

    this.loaderDisplay = DisplayType.HIDE;
    this.stepperDisplay = DisplayType.SHOW_AS_BLOCK;
    if (this.viewIndicator == View.UPLOAD && this.firstPageView) 
    {
      this.setView(View.PREVIEW);
    }
    this.firstPageView = true;
  }

  showUploadErrorMessage(message:string)
  {
    this.errorMessage = message;
    this.loaderDisplay = DisplayType.HIDE;
    this.setView(View.UPLOAD);
    this.stepperDisplay = DisplayType.SHOW_AS_BLOCK;

    this.errorDisplay = true;  
    setTimeout(() => {
      this.errorDisplay = false;
    }, 5000);

  }

  chooseMyDataset(dataset:any)
  {
    this.datasetId=dataset.id;
    this.uploadCompleted = true;
    this.sessionService.saveData('dataset_id',this.datasetId.toString());
    this.datasetName = dataset.fileName.split(".")[0]+".csv";
    this.sessionService.saveData('dataset_name',this.datasetName);
    this.hideElements();
    this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
    
  }

  onDatasetSelection(obj: { isSelected: boolean, datasetSource: string }) {
    this.nextButtonDisable = !obj.isSelected;
    this.datasetSource = obj.datasetSource;
  }

  onFileSelected($event:any)
  {
    this.datasetName = $event.name;
    const datasetInfo = JSON.stringify({
      Name: $event.name,
      Description: $event.description
    });
    if ($event.file == undefined) {
      this.datasetService.updateDataset(this.datasetId,{
        Name: $event.name,
        Description: $event.description,
        Public:false
      }).subscribe(this.changeInfoObserver);
      
      return;
    }
    this.hideElements();


    if (this.form.get('data')) 
      this.form.delete('data');
    this.form.append("data",datasetInfo);

    if (this.form.get('file')) 
      this.form.delete('file');
    
    this.form.append('file', $event.file);

    this.datasetService.uploadDatasetFile(this.form).subscribe(this.uploadObserver);
  }

  onShowDataClick($dataset:any) {

    //console.log($dataset.name);
    this.datasetName = $dataset.name;

    if ($dataset.link == undefined) {
      this.datasetService.updateDataset(this.datasetId,{
        Name: $dataset.name,
        Description: $dataset.description,
        Public: false
      }).subscribe(this.changeInfoObserver);

      return;
    }

    this.hideElements();
    
    if ($dataset.link == null || $dataset.link == "")
      console.log("problem: dataset-url");
    else {
      this.req["datasetSource"] = $dataset.link
      this.sessionService.saveData('upload_link', $dataset.link);
      this.datasetService.uploadDatasetFileWithLink($dataset).subscribe(this.uploadObserver);
    }
  }

  toggleTables(){

    if(this.showColumnSelectionPage)
    {
      this.statsViewDisplay = DisplayType.SHOW_AS_BLOCK;
      this.mainContainerDisplay = DisplayType.HIDE;
    }
    else
    {
      this.statsViewDisplay = DisplayType.HIDE;
      this.mainContainerDisplay = DisplayType.SHOW_AS_FLEX;
    }
    this.showColumnSelectionPage = !this.showColumnSelectionPage;
  }

  changeModifyButtons(value:boolean)
  {
    this.modifyChangeButtons = value;

    this.cd.detectChanges();
  }

  confirmationCancel()
  {
    this.confirmation = false;
  }
  
  confirmationSave(){
    this.confirmation = true;
  }

  modalOpen(){
    this.currentPage = this.dataTable.getCurrentPage();
    this.formPagesModify.controls['currentPageModify'].setValue(this.formPages.get('currentPage')!.value);
    this.modalDisplay = true;
  }

  OnModalClose()
  {
    this.modifyModal.refreshView();
    this.modalDisplay = false;
    this.formPages.controls['currentPage'].setValue(this.formPagesModify.get('currentPageModify')!.value);
  }

  OnModalSave()
  {
    var newRowData = this.modifyModal.getRowData();
    
    this.hideElements();
    
    let formPagesModifyElement = this.formPagesModify.get('currentPageModify');
    this.formPages.controls['currentPage'].setValue(this.formPagesModify.get('currentPageModify')!.value);
    if(formPagesModifyElement) {
      this.currentPage = this.modifyModal.getCurrentPage();
      this.dataTable.setCurrentPage(this.currentPage);
    }

    var req:ModifiedData = new ModifiedData(this.modifyModal.getEditedCells(), this.modifyModal.getDeletedRows(), this.modifyModal.getDeletedCols());
    console.log(req)
 
    //const now = new Date().getTime();
    this.datasetService.modifyDataset(this.datasetId, req).subscribe(
      {
        next: (response:any) =>{
          //const now2 = new Date().getTime();
          var tempEdited: object[] = [];
          var tempDeleted :object[] = [];
          //console.log(now2 - now);
          
          req.edited.forEach(element =>{
            this.dataTable.rowData[element.row][this.dataTable.headers[element.col].name] = newRowData[element.row][this.dataTable.headers[element.col].name];
            //console.log(this.dataTable.rowData[element.row][this.dataTable.headers[element.col].name]);
            tempEdited.push(this.dataTable.rowData[element.row]);
          });
          
          req.deletedRows.forEach(element => {
            tempDeleted.push(this.dataTable.rowData[element])
          });

          this.dataTable.updateRows(tempEdited);
          this.dataTable.removeRows(tempDeleted);
          
          tempDeleted.forEach(element =>
          {
            this.dataTable.rowData = this.dataTable.rowData.filter(row => row !== element);
          });
          //console.log(this.dataTable.rowData)

          var basicInfo = JSON.parse(response['basicInfo']);
          var missingValues = JSON.parse(response['missingValues']) 
          this.numOfMissingValues = basicInfo['missing'];
          this.numOfMissingArray = missingValues;
          this.missingIndicator = !this.missingIndicator;

          this.stats.showInfo([basicInfo]);
          this.stats.showMissingValues([missingValues]);
          this.datasetService.getStatIndicators(this.datasetId).subscribe(this.fetchStatsDataObserver);
          this.datasetService.getCorrMatrix(this.datasetId).subscribe(this.fetchCorrMatrixObserver);

          this.modalDisplay = false;
          this.showElements();
          /*
          //this.datasetService.getData(this.datasetId).subscribe(this.fetchTableDataObserver); // TODO check
          */
          },
          error:(err: Error) => {
            console.log(err);
            // TODO error handling kada modify ne uspe
          }
      }
    )
  }

  changeColomnVisibility(checkChange: Check) {
    this.dataTable.changeColomnVisibility(checkChange.id.toString(), checkChange.visible);
  }

  changeCheckBox(checkChange: Check) {
    this.labels.changeCheckbox(checkChange)
  } 

  onTargetColumnSelect(data:{id: number, previousTargetId: number | null})
  {
    this.dataTable.changeLabelColumn(data);
  }

  public downloadFile(){
    this.dataTable.downloadFile();
  }

  getSelectedEncoding() {
    return this.labels.selectedEncodings;
  }

  setIndex(event:StepperSelectionEvent)
  {
    this.setView(event.selectedIndex);
    //console.log(this.viewIndicator);

    if (event.selectedIndex == View.TRAINING)
    {
      var result = this.labels.getChoosenCols();
      var choosenInAndOutCols = result['values'];
      var missing_sum = result['missing_sum'];

      //console.log(choosenInAndOutCols);
      //console.log(missing_sum);
      if (choosenInAndOutCols?.label !== undefined || choosenInAndOutCols!.features.length > 0)
      {
        if(choosenInAndOutCols!.features.length > 0)
        {
          if(choosenInAndOutCols!.label !== undefined)
          {
            this.trainingDisplay = DisplayType.SHOW_AS_BLOCK;
            this.choosenInAndOutCols = choosenInAndOutCols;
            this.sessionService.saveData('chosen_columns', JSON.stringify(this.choosenInAndOutCols));

            if (this.choosenInAndOutCols.label.type == 'Categorical')
            {
              var name = this.choosenInAndOutCols.label.name;
              var indexOfIndicator:number = this.statsData?.categorical.columns.findIndex(o => o == "unique")!;
              var indexOfColumn:number = this.statsData?.categorical.index.findIndex(o => o == name)!;
              //console.log(this.statsData?.categorical.data[indexOfColumn][indexOfIndicator])
              if(this.statsData?.categorical.data[indexOfColumn][indexOfIndicator] == 2)
              {
                this.choosenInAndOutCols.label.type = "Binary Categorical";
              }
            }
            console.log(missing_sum);
            if(missing_sum != 0) 
            {
              /*
              this.dialogTitle = "Confirmation";
              this.dialogMessage = "Are you sure that you ? This proccess cannot be undone.";
    
              const dialogRef = this.dialog.open(DialogComponent,{
                data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
              });
              dialogRef.afterClosed().subscribe(result => {
                
              });*/ // TODO dilaog koji ce da proveri sa userom da li sigurno zeli da popuni tako nedostajuce vrednosti 
                    // i da ga obavesti da nema nazad
              let columnFillMethodPairs: ColumnFillMethodPair[] = []
              
              choosenInAndOutCols?.features.forEach(col => {
                let str_value: string = '';
                let num_value: number = 0;

                if(col.type == 'Categorical')
                {
                  str_value = col.missingConstant!;
                  console.log(col.missingConstant);
                }
                else
                  num_value = +col.missingConstant!;

                let columnFillMethodPair = new ColumnFillMethodPair(col.name, col.missing!, str_value, num_value)
                columnFillMethodPairs.push(columnFillMethodPair);
              });
              
              if(choosenInAndOutCols?.label) {
                let label: ChosenColumn = choosenInAndOutCols?.label;
                let str_value: string = '';
                let num_value: number = 0;

                if(label.type == 'Categorical')
                  str_value = label.missingConstant!;
                else
                  num_value = +label.missingConstant!;

                let columnFillMethodPair = new ColumnFillMethodPair(label.name, label.missing!, str_value, num_value)
                columnFillMethodPairs.push(columnFillMethodPair);
              }
              console.log(columnFillMethodPairs);
              this.hideElements(); 
              this.datasetService.fillMissingValues(this.datasetId, columnFillMethodPairs).subscribe({
                next: (response:any) => {
                  this.setView(View.TRAINING);
                  this.labels.keep_state = true;
                  this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
                  this.sessionService.saveData('chosen_columns', JSON.stringify(this.choosenInAndOutCols));
                  
                },
                error: (err: Error) => {
                  console.log(err);
                  this.showUploadErrorMessage(err.message);
                  // TODO error handling kada popunjavanje ne uspe
                }
              })
            }
          }
          else
          {
            this.dialogTitle = "Alert";
            this.dialogMessage = "You have to choose a target variable";
    
            const dialogRef = this.dialog.open(DialogComponent,{
              data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
            });
            dialogRef.afterClosed().subscribe(result => {
              if (!this.showColumnSelectionPage) this.toggleTables();
              this.setView(View.PREVIEW);
            });
            
          }
        }
        else
        {
          this.dialogTitle = "Alert";
          this.dialogMessage = "You have to choose at least one feature";

          const dialogRef = this.dialog.open(DialogComponent,{
            data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
          });
          dialogRef.afterClosed().subscribe(result => {
            if (!this.showColumnSelectionPage) this.toggleTables();
            this.setView(View.PREVIEW);
          });
        }
      }
      else
      {
        this.dialogTitle = "Alert";
        this.dialogMessage = "You have to choose at least one feature and a target variable";

        const dialogRef = this.dialog.open(DialogComponent,{
          data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!this.showColumnSelectionPage) this.toggleTables();
          this.setView(View.PREVIEW);
        });
      }
    }
  }

  setView(view:View)
  {
    if(view==View.UPLOAD)
      this.datasetService.getDatasets().subscribe(this.myDatasetsObserver);
    this.viewIndicator = view;
    this.sessionService.saveData('view',this.viewIndicator.toString());
  }

  public changePage(event: any){
    if(event>this.maxPages){
      this.formPages.controls['currentPage'].setValue(this.maxPages);
    }
    else if(event<0){
      this.formPages.controls['currentPage'].setValue(1);
   }

    this.dataTable.setCurrentPage(this.formPages.get('currentPage')!.value - 1)
  }

  public changePageModify(event: any){
    if(event>this.maxPagesModiify){
      this.formPagesModify.controls['currentPageModify'].setValue(this.maxPagesModiify);
    }
    else if(event<0){
      this.formPagesModify.controls['currentPageModify'].setValue(1);
  }

    if (this.modifyModal) this.modifyModal.setCurrentPage(this.formPagesModify.get('currentPageModify')!.value-1)
  }

  updateCurrentPageFromModify() {
    this.currentPage = this.modifyModal.getCurrentPage();
    this.dataTable.setCurrentPage(this.currentPage);
    this.formPages.controls['currentPage'].setValue(this.formPagesModify.get('currentPageModify')!.value);
  }
}

