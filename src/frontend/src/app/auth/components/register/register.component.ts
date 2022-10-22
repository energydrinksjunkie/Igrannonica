import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';
import { Tuple } from 'ag-grid-community/dist/lib/filter/provided/simpleFilter';
import { DisplayType } from 'src/app/shared/models/navigation_models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loaderDisplay:string = DisplayType.HIDE;
  serverErrorDisplay:string = DisplayType.HIDE;
  registerSuccessDisplay:string = DisplayType.HIDE;
  usernameExistsDisplay:string = DisplayType.HIDE;
  emailExistsDisplay:string = DisplayType.HIDE;

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    
    this.loaderDisplay = DisplayType.SHOW_AS_BLOCK;
    if(f.controls['email'].value <= 320){
      console.log("Predugacak email");
      return;
    }
    
    const registerObserver = {
      next: (x:any) => {
        console.log('User created');
      },
      error: (err: any) => {
        //userOrEmail_AlreadyExists
        if(err['error'] instanceof ProgressEvent ){
          this.serverErrorDisplay = DisplayType.SHOW_AS_BLOCK;
          //f.controls['username'].setValue(null)
          //f.controls['email'].setValue(null)
          //f.controls['password'].setValue(null)
          //f.controls['registerConfirmPassword'].setValue(null)
          setTimeout(() => {
            //this.serverErrorDisplay = DisplayType.HIDE;
            this.loaderDisplay = DisplayType.HIDE;
          }, 3000);
        }
        else{
          err['error']['data']['errors'].forEach( (item:any) => {
            if(item['code'] == "username_AlreadyExists"){
              this.usernameExistsDisplay = DisplayType.SHOW_AS_BLOCK;
              this.loaderDisplay = DisplayType.HIDE;
              setTimeout(() => {
                this.usernameExistsDisplay = DisplayType.HIDE;
              }, 3000);
            }
            if(item['code'] == "email_AlreadyExists"){
              this.emailExistsDisplay = DisplayType.SHOW_AS_BLOCK;
              this.loaderDisplay = DisplayType.HIDE;
              setTimeout(() => {
                this.emailExistsDisplay = DisplayType.HIDE;
              }, 3000);
            }
          });
        }
       
      }
    };
    f.form.removeControl('registerConfirmPassword'); // izbacivanje registerConfirmPassword iz objekta forme
    this.authService.register(f.value).subscribe(registerObserver);
  }
  onPasswordChange(f: NgForm) {
    if(!f.controls['password'].hasError('required') && f.controls['password'].value == f.controls['registerConfirmPassword'].value){
      console.log("password");
    }
    else f.controls['registerConfirmPassword'].setErrors({passwordMismatch:true});
  }
  @ViewChild('passwordInput') passwordInput: any;
  onPasswordConfirmChange(f: NgForm) {
    if(!f.controls['registerConfirmPassword'].hasError('required') && f.controls['registerConfirmPassword'].value == f.controls['password'].value){
      console.log("confirm password");
    }
    else{
      this.passwordInput.nativeElement.value = null;
      f.controls['registerConfirmPassword'].setErrors({passwordMismatch:true})
    } 

  }
  
  

  
   
}
