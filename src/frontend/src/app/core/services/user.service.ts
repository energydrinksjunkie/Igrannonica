import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  //Treba srediti da vraca Observables i da se handle-uju greske

  getUsers(): Observable<any[] | string>
  {
    return this.http.get<any>(this.apiUrl + `/Users`).pipe(
      catchError(this.handleError)
    );
  }
  
  getUser(id:number): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/Users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id:number): Observable<User | string>{
    return this.http.delete<any>(this.apiUrl + `/Users/${id}`);
  }
  
  deleteUserByEmail(email:string): Observable<User | string>{
    return this.http.delete<any>(this.apiUrl + `/Users/email/${email}`);
  }

  private handleError(error:any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.error == "Invalid access token or refresh token")
      {
        return "authorization_problem";
      }
    }
    
    return throwError(() => {
        return errorMessage;
    });
  }
}
