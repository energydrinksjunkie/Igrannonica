import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskApiService } from 'src/app/task-api.service';

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrls: ['./show-task.component.css']
})
export class ShowTaskComponent implements OnInit {

  taskList$!:Observable<any[]>;
  statusList:any=[];

  statusMap:Map<number, string> = new Map()

  constructor(private service:TaskApiService) { }

  ngOnInit(): void {
    this.taskList$ = this.service.getTaskList();
    this.refreshStatusMap();
  }

  modalTitle:string = '';
  activateAddEditTaskComponent:boolean = false;
  task:any;

  modalAdd() {
    this.task = {
      id:0,
      currentStatusId:0,
      title:null,
      creationDate:null,
      description:null
    }

    this.modalTitle = "Add Task";
    this.activateAddEditTaskComponent = true;
  }

  modalEdit(item:any) {
    this.task = item;
    this.modalTitle = "Edit Task";
    this.activateAddEditTaskComponent = true;
  }

  delete(item:any) {
    if(confirm(`Are you sure you want to delete task ${item.id}?`)) {
      this.service.deleteTask(item.id).subscribe(res=>{
        var closeModelBtn = document.getElementById('add-edit-modal-close');

        if(closeModelBtn)
          closeModelBtn.click();
  
        var showDeleteSuccess = document.getElementById('delete-success-alert');
        if(showDeleteSuccess) {
          showDeleteSuccess.style.display = "block";
        }
  
        setTimeout(function() {
          if(showDeleteSuccess) {
            showDeleteSuccess.style.display = "none";
          }
        }, 4000);
        this.taskList$ = this.service.getTaskList();
      })
    }
  }

  modalClose() {
    this.activateAddEditTaskComponent = false;
    this.taskList$ = this.service.getTaskList();
  }

  refreshStatusMap() {
    this.service.getStatusList().subscribe(data => {
      this.statusList = data;

      for (let i = 0; i < data.length; i++) {
        this.statusMap.set(
          this.statusList[i].id, this.statusList[i].statusOption)
      }
    });
  }
}
