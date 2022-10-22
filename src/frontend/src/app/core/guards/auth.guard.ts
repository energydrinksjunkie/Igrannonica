import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate 
{
  constructor(private authService : AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/home']);
      }
      return !this.authService.isLoggedIn();
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate 
{
  constructor(private authService : AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isLoggedIn: boolean = this.authService.isLoggedIn();
      let isAdmin: boolean = this.authService.isAdmin();

      if (!isLoggedIn || !isAdmin)
        this.router.navigate(['/home']);
        
      return isLoggedIn && isAdmin;
  }
}
