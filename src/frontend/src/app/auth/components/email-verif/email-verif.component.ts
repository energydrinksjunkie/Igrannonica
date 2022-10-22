import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-email-verif',
  templateUrl: './email-verif.component.html',
  styleUrls: ['./email-verif.component.css']
})
export class EmailVerifComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const emailVerifObserver = {
      next: (x:any) => { 
        console.log('Account is deactivated'); 
        var cancelMessage = document.getElementById('verifyMessage');
        
        cancelMessage!.innerHTML = "Account is succesfully verified!";
        var hide_button = () => {

          this.router.navigateByUrl('/login'); 
            
        }
        setTimeout(hide_button, 3000);
        console.log('Email is verified'); 
        
      },
      error: (err: Error) => {
        console.log(err)
        var cancelMessage = document.getElementById('verifyMessage');
        
        cancelMessage!.innerText = "Email verification token has expired!";
        var verifButton = document.getElementById('verifButton');
        verifButton!.style.display="inline-block";

      }
    };

    const verifRequestObserver = {
      next: (params:any) => { 
        console.log('Verification link params:');
        console.log(params); 
        this.authService.verifyEmailAddress(params['params']['email'], params['params']['token']).subscribe(emailVerifObserver);
        this.email=params['params']['email'];
      },
      error: (err: Error) => {
        console.log(err)

      }
    };
    
    this.route.queryParamMap.subscribe(verifRequestObserver);
        
  }

  email:string="";
  sendVerifEmail()
  {
    const sendVerifEmailObserver = {
      next: (x:any) => { 
        var cancelMessage = document.getElementById('verifyMessage');

        var verifButton = document.getElementById('verifButton');
        verifButton!.style.display="none";
        
        cancelMessage!.innerHTML = "Verification email sent. Check your inbox!";
        var hide_button = () => {

          this.router.navigateByUrl('/'); 
            
        }
        setTimeout(hide_button, 3000);
        
      },
      error: (err: Error) => {
        console.log(err)
        var cancelMessage = document.getElementById('verifyMessage');
        
        cancelMessage!.innerText = "Something went wrong!";

      }
    };
    this.authService.sendVerificationEmail(this.email).subscribe(sendVerifEmailObserver);
  }

}
