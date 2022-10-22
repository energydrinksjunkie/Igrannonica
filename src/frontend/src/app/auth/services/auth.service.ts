import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, throwError, timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/core/services/jwt.service';
import { DisplayType } from 'src/app/shared/models/navigation_models';
import { SessionService } from 'src/app/core/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private helper!: JwtHelperService;

  apiUrl = environment.apiUrl;
  LoginUrl = environment.apiUrl + "/auth/login";
  registerUrl = environment.apiUrl + "/auth/register";

  confirmEmailUrl = environment.apiUrl + "/Auth/verifyEmail";
  cancelRegistrationUrl = environment.apiUrl + "/Auth/cancelRegistration";
  sendVerificationEmailUrl = environment.apiUrl + "/Auth/sendVerificationEmail";

  constructor(private http: HttpClient, private router: Router, private jwtService: JwtService, private sessionService:SessionService) { }

  private _updatemenu = new Subject<void>();
  get updatemenu() {
    return this._updatemenu;
  }

  login(model: any){
    // TODO dodati loading animaciju
    return this.http.post(this.LoginUrl, model).pipe(
      map((response:any) => {
        const user = response;
        if(user.success){
          //console.log(user.data);
          this.jwtService.storeToken(user.data.token);
           this.jwtService.storeRefreshToken(user.data.refreshToken);
          //ubacuje token u localstorage
          this.updatemenu.next();
          //window.location.reload()
        }
      }),
      catchError(error => throwError(() => error))
    )
  }

  logout(message:string='') {
    this.jwtService.removeTokens();
    this.sessionService.clearData();
    if (message == "session_expired")
      this.router.navigateByUrl('/login', {state:{message:'session_expired'}});
    else this.router.navigateByUrl('/login');
    this.updatemenu.next();
    // TODO proveriti komentar ispod
    //kada se napravi API za logout
    /*
    return this.http.post<any>(`${this.apiUrl}/auth/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      map((response:any)=>{
        if(response.success)
        {
          this.doLogoutUser();
          this.router.navigateByUrl('/api/login');
        }
      }),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));*/
  }

  register(model: any){

    let headers = new HttpHeaders({
      'confirmEmailUrl': this.confirmEmailUrl
    });
    let options = {headers: headers};   

    return this.http.post(this.registerUrl, model, options).pipe(
      map((response:any) => {
        if(response.success){
          var forma = document.getElementById('blok'); // TODO srediti preko angulara
          var uspesnaRegistracijaMessage = document.getElementById('uspesnaRegistracijaMessage') // TODO srediti preko angulara
          forma!.style.display = DisplayType.HIDE;

          uspesnaRegistracijaMessage!.style.display = "block";
          var hide_button = () => {
            if(uspesnaRegistracijaMessage) {
              const user = response;
              uspesnaRegistracijaMessage.style.display = DisplayType.HIDE;
              //this.doLoginUser(user.username,user.data.token);
              this.router.navigateByUrl('/login');
            }
          }
          setTimeout(hide_button, 3000);
        }
      })
    );
  }

  isLoggedIn() {
    if (this.jwtService.getJwtToken()) return true;
    return false;
  }

  isAdmin() {
    let jwt = this.jwtService.getJwtToken();
    
    if (!jwt)
      return false;
    
    let decodedJwt = this.jwtService.getDecodedAccessToken();

    if(!decodedJwt)
      return false;

    return "Admin" == decodedJwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] 
  }

  refreshToken() {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {
      'accessToken':this.jwtService.getJwtToken(),
      'refreshToken': this.jwtService.getRefreshToken()
    }).pipe(
      tap((data: any) => {
        //console.log(data);
        this.jwtService.storeToken(data.accessToken);
        this.jwtService.storeRefreshToken(data.refreshToken);
    }));
  }

  verifyEmailAddress(email:string, token:string): any {
    return this.http.get<any>(this.confirmEmailUrl + `?email=${email}&token=${token}`);
  }

  cancelRegistration(email:string, token:string): any {
    return this.http.get<any>(this.cancelRegistrationUrl + `?email=${email}&token=${token}`);
  }

  sendVerificationEmail(email:string): any {
    return this.http.post<any>(this.sendVerificationEmailUrl + `?email=${email}`,null);
  }

}
