import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DisplayType } from 'src/app/shared/models/navigation_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loaderDisplay:string = DisplayType.HIDE;
  loginErrorDisplay:string = DisplayType.HIDE;
  loginSuccessDisplay:string = DisplayType.HIDE;
  errorDisplay:string = DisplayType.HIDE;
  errorMsg:string = "";

  constructor(private authService: AuthService, private router: Router) 
  {
    
    if (this.router != null) {
      if(this.router.getCurrentNavigation()?.extras.state)
      {
        if (this.router.getCurrentNavigation()?.extras.state!['message'] == "session_expired"){
          this.errorMsg = "Session expired. Please log in again";
          this.errorDisplay = "block";
          setTimeout(() => {
            this.errorDisplay = "none";
          }, 5000);
        }

      }
    }
  }

  ngOnInit(): void {

  }
  onSubmit(f: NgForm) {
    this.loaderDisplay = DisplayType.SHOW_AS_BLOCK; 
    const loginObserver = {
      next: (x:any) => { 
        console.log('User logged in');
        this.loaderDisplay = DisplayType.HIDE; 
        this.router.navigateByUrl('/training'); 
      },
      error: (err: any) => {
        
        if(err['error'] instanceof ProgressEvent ){
          //f.controls['usernameOrEmail'].setValue(null);
          //f.controls['password'].setValue(null);
          this.errorMsg = "Something went wrong. Try again later."
      
        }
        else{

          err['error']['data']['errors'].forEach( (item:any) => {
            if(item['code'] == "incorrect_password"){
              this.errorMsg = "Incorrect password";
            }
            if(item['code'] == "user_notFound"){
              this.errorMsg = "Incorrect username";
            }
            if (item['code'] == "email_notVerified")
            {
              this.errorMsg = "Email not verified";
            }
          });
        }
        this.errorDisplay = DisplayType.SHOW_AS_BLOCK;
        this.loaderDisplay = DisplayType.HIDE;
        setTimeout(() => {
          this.errorDisplay = DisplayType.HIDE;
        }, 3500);
     }
    }
  this.authService.login(f.value).subscribe(loginObserver);
  }
}
