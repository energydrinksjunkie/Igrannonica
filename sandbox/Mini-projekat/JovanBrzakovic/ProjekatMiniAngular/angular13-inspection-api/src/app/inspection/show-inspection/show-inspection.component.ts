import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InspectionApiService } from 'src/app/inspection-api.service';

@Component({
  selector: 'app-show-inspection',
  templateUrl: './show-inspection.component.html',
  styleUrls: ['./show-inspection.component.css']
})
export class ShowInspectionComponent implements OnInit {

  inspectionList$!:Observable<any[]>;
  inspectionTypesList$!:Observable<any[]>;
  inspectionTypesList:any=[];

  //Mapa 
  inspectionTypesMap:Map<number,string>=new Map()
  constructor(private service:InspectionApiService) { }

  ngOnInit(): void {
    this.inspectionList$ = this.service.getInspectionList();
    this.inspectionTypesList$ = this.service.getInspectionTypeList();
    this.refreshInspectionTypesMap();
  }
  // Variables
  modalTitle:string = '';
  activateAddEditInspectionComponent:boolean = false;
  inspection:any;

  modalAdd(){
    this.inspection = {
      id:0,
      status:null,
      comments:null,
      inspectionTypeId:null
    }
    this.modalTitle = "Add Inspection";
    this.activateAddEditInspectionComponent = true;
  }
  modalEdit(item:any){
    this.inspection = item;
    this.modalTitle = "Edit Inspection";
    this.activateAddEditInspectionComponent = true;
  }
  delete(item:any){
    if(confirm(`Are you sure you want to delete inspection ${item.id}`)){
      this.service.deleteInspection(item.id).subscribe(res =>{
        var closeModalBtn = document.getElementById('add-edit-modal-close');
        if(closeModalBtn){
          closeModalBtn.click();
        }
        var showDeleteSuccess = document.getElementById('delete-success-alert');
        if(showDeleteSuccess){
          showDeleteSuccess.style.display = "block";
        }
        setTimeout(function(){
          if(showDeleteSuccess){
            showDeleteSuccess.style.display= "none";
          }
        },4000);
        this.inspectionList$ = this.service.getInspectionList()
      });
    }
  }

  modalClose(){
    this.activateAddEditInspectionComponent = false;
    this.inspectionList$ = this.service.getInspectionList();
  }

  refreshInspectionTypesMap(){
    this.service.getInspectionTypeList().subscribe(data =>{
      this.inspectionTypesList = data;

      for(let i = 0; i < data.length; i++){
        this.inspectionTypesMap.set(this.inspectionTypesList[i].id,this.inspectionTypesList[i].inspectionName);
      }
    })
  }

}
