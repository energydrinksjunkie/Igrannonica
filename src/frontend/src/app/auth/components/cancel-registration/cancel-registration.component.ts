import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-cancel-registration',
  templateUrl: './cancel-registration.component.html',
  styleUrls: ['./cancel-registration.component.css']
})
export class CancelRegistrationComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const cancelRegistrationObserver = {
      next: (x:any) => { 
        console.log('Account is deactivated'); 
        var cancelMessage = document.getElementById('cancelMessage');
        
        cancelMessage!.innerHTML = "Registration associated with your email is successfully revoked!";
        var hide_button = () => {

            this.router.navigateByUrl('/');
            
        }
        setTimeout(hide_button, 3000);
        //this.router.navigateByUrl('/'); 
      },
      error: (err: Error) => {
        console.log(err)
        var cancelMessage = document.getElementById('cancelMessage');
        
        cancelMessage!.innerText = "Something went wrong!";
        var hide_button = () => {
          this.router.navigateByUrl('/');       
        }
        setTimeout(hide_button, 3000);
        

      }
    };

    const verifRequestObserver = {
      next: (params:any) => { 
        console.log('Verification link params:');
        console.log(params); 
        this.authService.cancelRegistration(params['params']['email'], params['params']['token']).subscribe(cancelRegistrationObserver);
      },
      error: (err: Error) => {
        console.log(err)

      }
    };
    
    this.route.queryParamMap.subscribe(verifRequestObserver);

  }

}
