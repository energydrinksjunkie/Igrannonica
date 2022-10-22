import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file?:File;
  fileName?:string;
  linkName:string = "";
  datasetId:number = -1;
  datasetName?:string="";
  datasetLinkName?:string = "";
  datasetDescription?:string="";
  datasetLinkDescription?:string="";
  fileSize?:string;
  datasetURL:string = "";

  isLoggedIn:boolean;
  showDragAndDrop:boolean = true;
  tab_index:number = 0;
  newFileBool:boolean = true;
  newLinkBool:boolean = true;

  diamondsURL:string;
  titanicURL:string;
  weightsURL:string;
  covidURL:string;
  browserURL:string;
  
  @Input() badLinkErrorDisplay: boolean = false;
  @Input() errorMessage: string = '';
  @Input() myDatasets:any[]=[];
  @Output() linkEvent: EventEmitter<any>; //podizanje event-a kada se salje link
  @Output() uploadEvent: EventEmitter<any>; //podizanje event-a kada se salje file
  @Output() datasetSelectedEvent: EventEmitter<{ isSelected: boolean, datasetSource: string }>;
  @Output() myDatasetEvent:EventEmitter<any>;

  datasetsList:any[]=[];

  constructor(private authService : AuthService, public sessionService:SessionService) {
    this.fileName = "";
    this.datasetURL = "";
    this.linkEvent = new EventEmitter<string>();
    this.uploadEvent = new EventEmitter<File>();
    this.datasetSelectedEvent = new EventEmitter<{ isSelected: boolean, datasetSource: string }>();
    this.myDatasetEvent = new EventEmitter<any>();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.showDragAndDrop = true;
    this.diamondsURL = "https://raw.githubusercontent.com/tidyverse/ggplot2/main/data-raw/diamonds.csv"
    this.titanicURL = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv";
    this.weightsURL = "https://raw.githubusercontent.com/TodorovicSrdjan/weight-height-dataset/main/weight-height.csv";
    this.covidURL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv";
    this.browserURL = "https://raw.githubusercontent.com/datasets/browser-stats/master/data.csv";
   }


  ngOnInit(): void 
  {
    if (this.sessionService.getData('tab_index') != null)
      this.tab_index = parseInt(this.sessionService.getData('tab_index')!);
    else
      this.sessionService.saveData('tab_index',this.tab_index.toString());

    if (this.sessionService.getData('file_name') != null)
    {
      this.fileName = this.sessionService.getData('file_name')!;
      //console.log(this.sessionService.getData('file_size'));
      if (this.sessionService.getData('file_size') != null)
      {
        this.fileSize = this.sessionService.getData('file_size')!;
        this.showDragAndDrop = false;
      }
    }

    if (this.sessionService.getData('link_name') != null)
    {
      this.linkName = this.sessionService.getData('link_name')!;
      this.datasetURL = this.sessionService.getData('dataset_url')!;
    }

    if (this.sessionService.getData('dataset_name') != null)
    {
      this.datasetName = this.sessionService.getData('dataset_name')!;
      this.datasetDescription = this.sessionService.getData('dataset_description')!;
    }
    if (this.sessionService.getData('dataset_link_name') != null){
      this.datasetLinkName = this.sessionService.getData('dataset_link_name')!;
      this.datasetLinkDescription = this.sessionService.getData('dataset_link_description')!;
    }

    if(this.sessionService.getData('upload_link') != null)
    {
      this.datasetURL = this.sessionService.getData('upload_link')!;
    }

    if (this.sessionService.getData('dataset_id') != null)
    {
      this.datasetId = parseInt(this.sessionService.getData('dataset_id')!);
      if (this.sessionService.getData('upload_type') == 'link') this.newLinkBool = false;
      else if (this.sessionService.getData('upload_type') == 'file') this.newFileBool = false;
    }
  }
  ngOnChanges(){
    this.datasetsList=this.myDatasets.reverse();
  }

  updateDatasetName(value:string)
  {
    this.datasetName=value;
  }
  updateDatasetLinkName(value:string)
  {
    this.datasetLinkName=value;
  }

  updateDatasetDescription(value:string)
  {
    this.datasetDescription=value;
  }
  updateDatasetLinkDescription(value:string)
  {
    this.datasetLinkDescription=value;
  }

  fileHandler(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if (fileList && fileList?.length > 0) {

    this.file = fileList[0];
    this.fileName = this.file.name;
    this.fileSize = this.convertFileSize(this.file.size);

      let fileNameToTitle = this.fileName;
      fileNameToTitle = fileNameToTitle!.replace(/\.[^/.]+$/, '');
      fileNameToTitle = fileNameToTitle.charAt(0).toUpperCase() + fileNameToTitle.slice(1);
      this.datasetDescription = '';
      this.datasetName = fileNameToTitle;
    }

    this.showDragAndDrop = false;

    // TODO proveriti ovaj deo koda

    if(this.file == null)
      this.datasetSelectedEvent.emit({ isSelected: false, datasetSource: "local_upload"});
    else  
      this.datasetSelectedEvent.emit({ isSelected: true, datasetSource: "local_upload"});

    this.newFileBool = true;
  }

  onFileDropped(file:File)
  {
    this.file = file;
    this.fileName= file.name;
    this.fileSize = this.convertFileSize(file.size);
    this.showDragAndDrop = false;
    this.newFileBool = true;

    let fileNameToTitle = this.fileName;
    fileNameToTitle = fileNameToTitle!.replace(/\.[^/.]+$/, '');
    fileNameToTitle = fileNameToTitle.charAt(0).toUpperCase() + fileNameToTitle.slice(1);
    this.datasetDescription = '';
    this.datasetName = fileNameToTitle;
  }

  uploadClick()
  {
    if (this.datasetDescription == "")
    {
      this.datasetDescription = "Generic description";
    }
    if (this.newFileBool)
    {
      this.uploadEvent.emit({
        file:this.file,
        name:this.datasetName,
        description:this.datasetDescription,
      });

      this.fileName = this.file?.name!;
      this.newFileBool = false;
      this.newLinkBool = true;
      this.datasetLinkName = "";
      this.datasetLinkDescription = "";
      this.sessionService.clearData();
      this.sessionService.saveData('upload_type','file');
      this.sessionService.saveData('tab_index',this.tab_index.toString());
      this.sessionService.saveData('file_name', this.fileName);
      this.sessionService.saveData('file_size', this.fileSize!);
      this.sessionService.saveData('dataset_name',this.datasetName!);
      this.sessionService.saveData('dataset_description', this.datasetDescription!);

    }
    else{

      this.uploadEvent.emit({
        file:undefined,
        name:this.datasetName,
        description:this.datasetDescription,
      });
    }
  }
  
  linkClick()
  {
    if (!this.datasetLinkName || this.datasetLinkName == "")
    {
      this.datasetLinkName = this.datasetURL.split("/").pop()!;
    }
    if (!this.datasetLinkDescription || this.datasetLinkDescription == "")
      this.datasetLinkDescription = "Default";

    if (this.newLinkBool)
    {
      this.linkEvent.emit({
        link:this.datasetURL,
        name:this.datasetLinkName,
        description:this.datasetLinkDescription,
      });
      this.fileName = this.linkName = this.datasetURL.split("/").pop()!;
      this.newLinkBool = false;
      this.newFileBool = true;
      this.sessionService.clearData();
      this.sessionService.saveData('upload_type','link');
      this.sessionService.saveData('tab_index',this.tab_index.toString());
      this.sessionService.saveData('link_name', this.linkName);
      this.sessionService.saveData('dataset_url', this.datasetURL);
      this.sessionService.saveData('dataset_link_name',this.datasetLinkName!);
      this.sessionService.saveData('dataset__link_description', this.datasetLinkDescription!);
    }
    else{
      this.linkEvent.emit({
        link:undefined,
        name:this.datasetLinkName,
        description:this.datasetLinkDescription,
      });
    }
  }

  myDatasetClick(dataset:any)
  {
    this.sessionService.clearData();
    this.newFileBool = true;
    this.newLinkBool = true;
    this.sessionService.saveData('upload_type','private');
    this.sessionService.saveData('tab_index',this.tab_index.toString());
    this.sessionService.saveData('dataset_name',this.datasetLinkName!);
    this.sessionService.saveData('dataset_description', this.datasetLinkDescription!);
    this.myDatasetEvent.emit(dataset);
  }

  removeFile()
  {
    this.clearSessionStorage();
    this.file = undefined;
    this.fileName="";
    this.showDragAndDrop = true;

    this.datasetSelectedEvent.emit({ isSelected: false, datasetSource: "local_upload"});
  }
  
  onLinkChange()
  {
    this.newLinkBool = true;
  }

  setIndex(index:number)
  {
    this.tab_index = index;
    this.sessionService.saveData('tab_index',this.tab_index.toString());
  }

  clearSessionStorage()
  {
    this.sessionService.removeData('file_name');
    this.sessionService.removeData('file_size');
  }

  convertFileSize(bytes : number, si : boolean = true, dp : number = 1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }
  
  publicLinkClick(datasetLink:string)
  {
    this.newLinkBool = true;
    this.newFileBool = true;
    var datasetLinkName = datasetLink.split("/").pop()!;
    this.linkEvent.emit({
      link:datasetLink,
      name: datasetLinkName,
      description:"Public dataset"
    });
    this.sessionService.clearData();
    this.sessionService.saveData('upload_type','public');
    this.sessionService.saveData('tab_index',this.tab_index.toString());
    this.sessionService.saveData('dataset_name',datasetLinkName);
    this.sessionService.saveData('dataset_description', "Public dataset");
  }

  onUrlInputChange(event:any) {
    console.log(event.target.value)
    if(this.datasetURL == '')
      this.datasetSelectedEvent.emit({ isSelected: false, datasetSource: "link"});
    else  
      this.datasetSelectedEvent.emit({ isSelected: true, datasetSource: "link"});
  }
}
