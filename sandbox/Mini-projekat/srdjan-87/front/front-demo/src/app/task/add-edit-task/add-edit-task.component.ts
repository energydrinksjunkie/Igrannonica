import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskApiService } from 'src/app/task-api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-task',
  templateUrl: './add-edit-task.component.html',
  styleUrls: ['./add-edit-task.component.css']
})
export class AddEditTaskComponent implements OnInit {

  statusList$!:Observable<any[]>;


  
  constructor(private service:TaskApiService, public datepipe: DatePipe) { }

  @Input() task:any;
  id:number = 0;
  currentStatusId!:number;
  title:string = "";
  creationDate:any = null;
  description:string = "";


  ngOnInit(): void {
    this.id = this.task.id;
    this.currentStatusId = this.task.currentStatusId;
    this.creationDate = this.datepipe.transform((new Date),"yyyy-MM-dd'T'HH:mm:ss"); //this.task.creationDate;
    this.title = this.task.title;
    this.description = this.task.description;
    this.statusList$ = this.service.getStatusList()
  }

  addTask() {
    var task = {
      currentStatusId:this.currentStatusId,
      title:this.title,
      creationDate:this.creationDate,
      description:this.description,
    }

    this.service.addTask(task).subscribe(res=>{
      var closeModelBtn = document.getElementById('add-edit-modal-close');

      if(closeModelBtn)
        closeModelBtn.click();

      var showAddSuccess = document.getElementById('add-success-alert');
      if(showAddSuccess) {
        showAddSuccess.style.display = "block";
      }

      setTimeout(function() {
        if(showAddSuccess) {
          showAddSuccess.style.display = "none";
        }
      }, 4000);
    })
  }

  updateTask() {
    var task = {
      id:this.id,
      currentStatusId:this.currentStatusId,
      title:this.title,
      creationDate:this.creationDate,
      description:this.description,
    }
    var id:number = this.id;

    this.service.updateTask(id, task).subscribe(res=>{
      var closeModelBtn = document.getElementById('add-edit-modal-close');

      if(closeModelBtn)
        closeModelBtn.click();

      var showUpdateSuccess = document.getElementById('update-success-alert');
      if(showUpdateSuccess) {
        showUpdateSuccess.style.display = "block";
      }

      setTimeout(function() {
        if(showUpdateSuccess) {
          showUpdateSuccess.style.display = "none";
        }
      }, 4000);
    })
  }
}
