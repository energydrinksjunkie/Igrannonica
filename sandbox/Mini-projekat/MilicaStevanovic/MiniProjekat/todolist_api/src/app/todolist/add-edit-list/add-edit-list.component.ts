import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ListApiService } from 'src/app/list-api.service';

@Component({
  selector: 'app-add-edit-list',
  templateUrl: './add-edit-list.component.html',
  styleUrls: ['./add-edit-list.component.css']
})
export class AddEditListComponent implements OnInit {

  taskList$!:Observable<any[]>;
  usersList$!:Observable<any[]>;

  @Input() task:any;
  @Input() user:any;
  id:number = 0;
  comment:string = "";
  userId!:number;
  userName!:string;

  constructor(private service:ListApiService) { }

  ngOnInit(): void 
  {
    if (this.task!= null){
      this.id = this.task.id;
      this.comment = this.task.comment;
      this.userId = this.task.userId;
    }
    if (this.user != null) this.userName = this.user.name;
    this.taskList$ = this.service.getList();
    this.usersList$ = this.service.getUsers();
  }

  addTask()
  {
    var task = {
      comment:this.comment,
      userId:this.userId
    }
    this.service.addTask(task).subscribe(res =>{
      var closeModal = document.getElementById('add-edit-modal-close');
      if (closeModal){
        closeModal.click();
      }

      var showAddSuccess = document.getElementById('add-success-alert');
      if (showAddSuccess){
        showAddSuccess.style.display = "block";
      }
      setTimeout(function(){
        if (showAddSuccess){
          showAddSuccess.style.display = "none";
        }
      },4000)
    })
  }

  updateTask()
  {
    var task = {
      id:this.id,
      comment:this.comment,
      userId:this.userId
    }
    var id:number = this.id;
    this.service.updateTask(id,task).subscribe(res =>{
      var closeModal = document.getElementById('add-edit-modal-close');
      if (closeModal){
        closeModal.click();
      }
      var showUpdateSuccess = document.getElementById('update-success-alert');
      if (showUpdateSuccess){
        showUpdateSuccess.style.display = "block";
      }
      setTimeout(function(){
        if (showUpdateSuccess){
          showUpdateSuccess.style.display = "none";
        }
      },4000)
    })
  }
  
  addUser()
  {
    var user = {
      name:this.userName
    }
    this.service.addUser(user).subscribe(res =>{
      var closeModal = document.getElementById('add-edit-modal-close');
      if (closeModal){
        closeModal.click();
      }

      var showAddSuccess = document.getElementById('user-success-alert');
      if (showAddSuccess){
        showAddSuccess.style.display = "block";
      }
      setTimeout(function(){
        if (showAddSuccess){
          showAddSuccess.style.display = "none";
        }
      },4000)
    })
  }
}
