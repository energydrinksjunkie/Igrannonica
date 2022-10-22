import { Component, DoCheck, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models';
import { AuthService } from 'src/app/auth/services/auth.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  user: User | undefined;
  user$: Observable<User> | undefined;
  displayLoginElement = false;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(public authService: AuthService, public jwtService : JwtService, public userService: UserService) {}

  ngOnInit(): void {
    this.user$ = new Observable<User>();
    this.authService.updatemenu.subscribe(res => {
      this.MenuDisplay();
    });

    this.user$.subscribe({
      error(msg) {
        if (msg == "authorization_problem")
        {
          console.log("Session expired! Log in again")
        }
      }
    });
    this.MenuDisplay();
    
  }

  MenuDisplay() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.displayLoginElement = false;

      var decodedToken = this.jwtService.getDecodedAccessToken();

      if(!decodedToken)
        this.authService.logout('session_expired');
      else {
        var id = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'];
  
        if(!id) {
          this.authService.logout('session_expired')
        }
  
        this.user$ = this.userService.getUser(id);
      }
      
      this.isAdmin = this.authService.isAdmin();

      /*
      .subscribe({
        next: (response:any) => 
        {
          this.user = response;
        }
      }
      
     );*/
    }
    else this.displayLoginElement = true;
  }

  doLogout()
  {
    this.authService.logout();
  }

}
