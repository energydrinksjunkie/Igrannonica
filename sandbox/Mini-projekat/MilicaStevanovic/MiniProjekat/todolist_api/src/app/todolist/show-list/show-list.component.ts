import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ListApiService } from 'src/app/list-api.service';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent implements OnInit {

  taskList$!:Observable<any[]>;
  usersList$!:Observable<any[]>;
  usersList:any=[]

  usersMap:Map<number,string> = new Map();

  modalTittle:string = '';
  activateAddEditComponent:boolean = false;
  task:any;
  user:any;

  constructor(private service : ListApiService) { }

  ngOnInit(): void {
    this.taskList$ = this.service.getList();
    this.usersList$ = this.service.getUsers();
    this.refreshUsersMap();
  }

  refreshUsersMap()
  {
    this.service.getUsers().subscribe(data =>{
      this.usersList = data;

      for(let i = 0; i< data.length; i++)
      {
        this.usersMap.set(this.usersList[i].id, this.usersList[i].name);
      }
    })
  }
  
  modalAdd()
  {
    this.task = {
      id:0,
      comment:null,
      userId:null
    }
    this.user = null;
    this.modalTittle = "Dodaj stavku";
    this.activateAddEditComponent = true;
  }
  modalClose()
  {
    this.activateAddEditComponent = false;
    this.taskList$ = this.service.getList();
    this.usersList$ = this.service.getUsers();
    this.refreshUsersMap();
  }
  modalEdit(item:any){
    this.task = item;
    this.user = this.usersMap.get(this.task.userId);
    this.modalTittle = "Izmeni stavku";
    this.activateAddEditComponent = true;
  }
  modalAddUser()
  {
    this.task = null;
    this.user = {
      id:0,
      name:null
    }
    this.modalTittle = "Dodaj korisnika";
    this.activateAddEditComponent = true;
  }
  delete(item:any)
  {
    if (confirm('Da li ste sigurni da zelite da izbrisete stavku?'))
    {
      this.service.deleteTask(item.id).subscribe(res =>{
        var closeModal = document.getElementById('add-edit-modal-close');
      if (closeModal){
        closeModal.click();
      }
      var showDeleteSuccess = document.getElementById('delete-success-alert');
      if (showDeleteSuccess){
        showDeleteSuccess.style.display = "block";
      }
      setTimeout(function(){
        if (showDeleteSuccess){
          showDeleteSuccess.style.display = "none";
        }
      },4000);
      this.taskList$ = this.service.getList();
      })
    }
  }
}
