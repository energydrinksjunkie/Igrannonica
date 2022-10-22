import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../core/services/user.service';
import { DisplayType } from '../shared/models/navigation_models';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  users!: any;
  userSelectedID: any;
  @ViewChild('email') email: any;
  errorDisplay:string = DisplayType.HIDE;
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
    const getUserObserver = {
      next: (users:any) => {
        console.log('Users get');
        this.users = users;
      },
      error: (err: any) => {
       
      }
    };

    this.userService.getUsers().subscribe(getUserObserver);
  }

  deleteUser(id:number){
    const deleteUserObserver = {
      next: (x:any) => {
        this.users = this.users.filter((item: { id: number; }) => item.id !== id);
        this.userSelectedID = null;
      },
      error: (err: any) => {
        alert("Error");
      }
    };

    this.userService.deleteUser(id).subscribe(deleteUserObserver);
  }

  selectUser(id:number){
    this.userSelectedID = id;
  }

  deleteUserByEmail(){
    var inputValue = this.email.nativeElement.value
    console.log(inputValue)
    const deleteUserByEmailObserver = {
      next: (x:any) => {
        console.log('User deleted by email');
        //window.location.reload(); 
        this.users = this.users.filter((item: { email: string; }) => item.email !== inputValue);
      },
      error: (err: any) => {
        this.errorDisplay = DisplayType.SHOW_AS_BLOCK
        setTimeout(() => {
         this.errorDisplay = DisplayType.HIDE;
       }, 3000);
      }
    };

    this.userService.deleteUserByEmail(inputValue).subscribe(deleteUserByEmailObserver);
  }

}
