import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Column, Constants, Hyperparameter } from '../../models/hyperparameter_models';
import { DomSanitizer } from '@angular/platform-browser';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TrainingViewComponent } from '../../_training-view/training-view.component';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ChosenColumn, HeaderDict, TableIndicator } from '../../models/table_models';
import { SessionService } from 'src/app/core/services/session.service';
import { View, DisplayType } from '../../../shared/models/navigation_models';
import { ShowTableComponent } from '../show-table/show-table.component';
import { HeadersService } from '../../services/headers.service';

@Component({
  selector: 'app-hyperparameters',
  templateUrl: './hyperparameters.component.html',
  styleUrls: ['./hyperparameters.component.css']
})
export class HyperparametersComponent implements OnInit, OnChanges, AfterViewInit 
{
  @Input() choosenInAndOutCols:{features:ChosenColumn[],label:ChosenColumn} | undefined = undefined;
  @Input() datasetId:any;

  @ViewChild('finalTable') private finalTable!: ShowTableComponent;
  
  loaderMiniDisplay:string = DisplayType.HIDE;
  trainingBool:boolean = false;
  readonly backendSocketUrl = environment.backendSocketUrl;

  constructor(private trainingViewComponent:TrainingViewComponent, 
    private trainingService: TrainingService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private headerService:HeadersService,
    private cd:ChangeDetectorRef) { }

  activationFunctions: Hyperparameter[] = Constants.ACTIVATION_FUNCTIONS;
  optimizerFunctions: Hyperparameter[] = Constants.OPTIMIZER_FUNCTIONS;
  lossFunctions: Hyperparameter[] = Constants.LOSS_FUNCTIONS;
  metrics: Hyperparameter[] = Constants.METRICS;
  weightInitializers: Hyperparameter[] = Constants.WEIGHT_INITIALIZERS;

  formGroup!: FormGroup;
  //activationFunctionControl = new FormControl('', Validators.required);
  optimizerFunctionControl = new FormControl('', Validators.required);
  lossFunctionControl = new FormControl('', Validators.required);
  metricsControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  @ViewChild('allMetricsSelected') allMetricsSelected!: MatOption;

  @ViewChild('metricsSelect') metricsSelect!: MatSelect;
  @ViewChild('lossSelect') lossSelect!: MatSelect;

  allSelected: boolean = false;
  problemType: string = "regression";
  problemTypeString:string = "Regression";
  selectedNumerical: string = "false";
  selectedCategorical: string = "false"
  numberOfEpochs: number = 300;
  learningRate: number = 0.1;
  metricsArrayToSend: any[] = [];
  metricsObjArray: Hyperparameter[]=[];

  sliderValueTest: number = 20;
  sliderValueValidation: number = 20;
  sliderOptions: Options = {
    floor: 10,
    ceil: 90,
    step: 5,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      if (value <= 25) {
          return 'red';
      }
      if (value <= 50) {
          return 'orange';
      }
      if (value <= 75) {
          return 'yellow';
      }
      return '#2AE02A';
    },
    getPointerColor: (value: number): string => {
      return '#0d6efd';
    },
    translate: (value: number): string => {
      return value+"%";
    }
  };

  ngOnInit(): void 
  {
    if(this.sessionService.getData('view') != null && this.sessionService.getData('chosen_columns') != null)
    {
      this.choosenInAndOutCols = JSON.parse(this.sessionService.getData('chosen_columns')!);
      if (this.choosenInAndOutCols!.label.type == "Numerical")
      {
        this.problemType = this.problemTypeString = "regression"
      }
      else
      {
        this.problemType = "classification";
        this.problemTypeString = this.choosenInAndOutCols!.label.type == "Categorical"? "classification":"binary classification";
      }
      this.datasetId = parseInt(this.sessionService.getData('dataset_id')!);
      if (this.sessionService.getData('layers') != null){
        this.layers = JSON.parse(this.sessionService.getData('layers')!);
        this.numberOfEpochs = parseInt(this.sessionService.getData('numberOfEpochs')!);

      }
      if (this.sessionService.getData('numberOfEpochs') != null) 
        this.numberOfEpochs = parseInt(this.sessionService.getData('numberOfEpochs')!);
      if (this.sessionService.getData('learningRate') != null) 
        this.learningRate = parseFloat(this.sessionService.getData('learningRate')!);
    }
    else{
      this.sessionService.saveData('layers', JSON.stringify(this.layers));
      this.sessionService.saveData('numberOfEpochs', this.numberOfEpochs.toString());
      this.sessionService.saveData('learningRate', this.learningRate.toString());
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void 
  {
    if (this.choosenInAndOutCols !== undefined && this.choosenInAndOutCols.label !== undefined)
    {
      var newProblemType;
      if (this.choosenInAndOutCols!.label.type == "Numerical")
      {
        newProblemType = this.problemTypeString = "regression"
      }
      else
      {
        newProblemType = "classification";
        this.problemTypeString = this.choosenInAndOutCols!.label.type == "Categorical"? "classification":"binary classification";
      }
      if (this.problemType != newProblemType)
      {
        this.problemType = newProblemType;
        this.reset();
      }
      
    }
  }
  ngAfterViewInit(): void {
    this.fillTable();
    this.cd.detectChanges();
  }

  layers= [
    { 
      index : 0,
      units : 32,
      weight_initializer  : "HeUniform",
      activation_function : "ReLu",
    },
    { 
      index : 1,
      units : 8,
      weight_initializer  : "HeUniform",
      activation_function : "ReLu",
    }
  ];
  
  epoches_data:any[]=[];

  graph_metric="loss";

  training_arr:number[]=[];
  val_arr:number[]=[];
  epoches_arr:number[]=[0];

  collapse:string=DisplayType.SHOW_AS_BLOCK;

  prikaz:string=DisplayType.HIDE;
  started:boolean=false;
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
    this.sessionService.saveData('layers', JSON.stringify(this.layers));
  }

  removeLayer(index:number){
    this.layers.splice(index, 1);
    this.sessionService.saveData('layers', JSON.stringify(this.layers));
  }
  

  addLayer(){
      this.layers.push({ 
        index : this.layers.length,
        units : this.layers.length>0 ? Math.ceil(this.layers[this.layers.length-1].units/2) : 32,
        weight_initializer  : this.layers.length>0 ? this.layers[this.layers.length-1].weight_initializer : "HeUniform",
        activation_function : this.layers.length>0 ? this.layers[this.layers.length-1].activation_function : "ReLu",
      });
      this.sessionService.saveData('layers', JSON.stringify(this.layers));
  }

  changeGraphMetric(codename:string)
  {
    this.graph_metric=codename;
    this.training_arr=this.epoches_data.map(a=>a[this.graph_metric]);
    this.val_arr=this.epoches_data.map(a=>a["val_"+this.graph_metric]);
  }
  test_arr:any=undefined;
  startTrainingObserver:any = {
    next: (response:any) => { 
      console.log("training > components > hyperparameters > hyperparameters.component.ts > startTrainingObserver > next:")
      console.log(response)
      this.test_arr=response["test_metrics"];
      this.loaderMiniDisplay = DisplayType.HIDE;
      this.collapse = DisplayType.SHOW_AS_BLOCK;
      this.epoches_arr[this.epoches_arr.length-1] = 0;
      this.trainingBool = false;
      this.fillTable();
    },
    error: (err: Error) => {
      console.log("training > components > hyperparameters > hyperparameters.component.ts > startTrainingObserver >  error:")
      this.collapse = DisplayType.SHOW_AS_BLOCK;
      this.loaderMiniDisplay = DisplayType.HIDE;
      this.epoches_arr![this.epoches_arr!.length-1] = 0;
      console.log(err)
    }
  };

  changeEpoch(value: number): void {
    this.numberOfEpochs = value;
    if (this.numberOfEpochs) this.sessionService.saveData('numberOfEpochs', this.numberOfEpochs.toString());
  }

  changeRate(value: number): void {
    if(value){
      value = +value.toFixed(2)
      this.learningRate = value;
      if (this.learningRate) this.sessionService.saveData('learningRate', this.learningRate.toString());
    }
    
  }
  ignoreMetric(metric:Hyperparameter)
  {
    if (this.problemTypeString == "classification")
    {
      var metric_name = metric.name.toLowerCase();
      if (metric_name.includes('binary')) return true;
    }
    if (this.problemTypeString == "binary classification")
    {
      var metric_name = metric.name.toLowerCase();
      if (metric_name.includes('categorical')) return true;
    }

    return false;
  }
  ignoreLoss(loss:Hyperparameter)
  {
    if (this.problemTypeString == "classification")
    {
      var metric_name = loss.name.toLowerCase();
      if (metric_name.includes('binary')) return true;
    }
    if (this.problemTypeString == "binary classification")
    {
      var metric_name = loss.name.toLowerCase();
      if (metric_name.includes('categorical')) return true;
    }

    return false;
  }
  TrainingClick(){
    this.trainingBool = true;
    this.loaderMiniDisplay = DisplayType.SHOW_AS_BLOCK;
    let connectionID = "";
    
    // izdvajanje naziva feature-a u poseban niz
    var features = []
    for (let index = 0; index < this.choosenInAndOutCols!['features'].length; index++) {
      const element = this.choosenInAndOutCols!['features'][index];
      features.push(new Column(element["name"], element["encoding"]));
    } 
      
    // izdvajanje naziva label-a u poseban niz
    var lables = []
    const element = this.choosenInAndOutCols!['label'];
    lables.push(new Column(element["name"], element["encoding"]));

    // izdvajanje codename-ova metrika u poseban niz
    this.metricsArrayToSend = this.metricsControl.value.map(
      (item:any)=>item['codename']);
    this.metricsObjArray=this.metrics.filter(x=>this.metricsArrayToSend.includes(x.codename));
    
    
    if(this.metricsArrayToSend[0] == undefined)
      this.metricsArrayToSend.shift();

    var trainingRequestPayload = {
      DatasetID             : this.datasetId,
      ClientConnID          : connectionID,
      ProblemType           : this.problemType,
      Layers                : this.layers,
      Features              : features,
      Labels                : lables,
      Metrics               : this.metricsArrayToSend,
      LossFunction          : this.lossFunctionControl.value.codename,
      TestDatasetSize       : this.sliderValueTest / 100,
      ValidationDatasetSize : this.sliderValueValidation / 100,
      Epochs                : this.numberOfEpochs,
      Optimizer             : this.optimizerFunctionControl.value.codename,
      LearningRate          : this.learningRate
    }

    let subject = new WebSocket(this.backendSocketUrl);
    console.log(trainingRequestPayload)
    console.log(this.lossFunctionControl)

    subject.onopen = function (evt){
      console.log("Socket connection is established");
    }

    let _this = this
    
    subject.onmessage = function (evt) {
      var dataArr = evt.data.split(" ", 2)

      // proveri da li je rec o dodeli ID-a
      if(dataArr[0] == "ConnID:") {
        connectionID = dataArr[1];
        trainingRequestPayload["ClientConnID"] = connectionID;
        _this.collapse = DisplayType.HIDE;
        _this.trainingService.sendDataForTraining(trainingRequestPayload).subscribe(_this.startTrainingObserver);
        console.log(`My connection ID: ${connectionID}`);
        _this.epoches_data = [];
        _this.training_arr = [];
        _this.val_arr = [];
        _this.prikaz = DisplayType.SHOW_AS_INLINE_BLOCK;
        _this.started  =true;
      }
      else {
        let epoch_stats = JSON.parse(evt.data)
        _this.loaderMiniDisplay = DisplayType.HIDE;
        console.log(epoch_stats);
        _this.epoches_data.push(epoch_stats);
        // TODO srediti da se salje samo element a ne ceo niz
        _this.training_arr = _this.epoches_data.map(a=>a[_this.graph_metric]);
        _this.val_arr = _this.epoches_data.map(a=>a["val_"+_this.graph_metric]);
        _this.epoches_arr = _this.epoches_data.map(a=> a.epoch);

        if(_this.training_arr.length == _this.numberOfEpochs)
          _this.collapse = DisplayType.SHOW_AS_BLOCK;
      }
    }

    // TODO proveriti da li je potrebno zatvoriti socket sa: subject.close()
    subject.onclose = function(evt){
      console.log("Connection is terminated");
    }
  }
  tabelaFinalna=DisplayType.HIDE;
  fillTable()
  {
    var header:HeaderDict[] = [];
    header.push(new HeaderDict(0,'Metric'));
    header.push(new HeaderDict(1,'Training'));
    header.push(new HeaderDict(2,'Validation'));
    header.push(new HeaderDict(3,'Testing'));
    
    let arrObjects:any[] = [{Metric:'Loss',Training:this.epoches_data[this.epoches_data.length-1]['loss'],Validation:this.epoches_data[this.epoches_data.length-1]["val_loss"],Testing:this.test_arr['loss']}];
    this.metricsObjArray.forEach(x => {
      arrObjects.push({Metric:x.name,Training:this.epoches_data[this.epoches_data.length-1][x.codename],Validation:this.epoches_data[this.epoches_data.length-1]["val_"+x.codename],Testing:this.test_arr[x.codename]});
    });

    this.finalTable.prepareTable(TableIndicator.OTHER,arrObjects,header);
    this.tabelaFinalna=DisplayType.SHOW_AS_BLOCK;
  }

  reset(){
    this.metricsSelect.options.forEach((data: MatOption) => data.deselect());
    this.lossSelect.options.forEach((data: MatOption) => data.deselect());
  }

  toggleAllSelection(){
    this.metricsSelect.options.forEach( (item : MatOption) => {if(item.value.type == this.problemType)item.select()});
  }

  toggleAllDeselect(){
    this.metricsSelect.options.forEach( (item : MatOption) => {item.deselect()});
    
  }

  optionClick() {
    let newStatus = true;
    this.metricsSelect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
  
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    
    return !this.trainingBool;
  }  
}

