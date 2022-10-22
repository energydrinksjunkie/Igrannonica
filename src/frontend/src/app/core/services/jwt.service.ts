import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor() { }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  storeToken(token:any)
  {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  storeRefreshToken(refresh_token:any)
  {
    localStorage.setItem(this.REFRESH_TOKEN, refresh_token);
  }

  removeTokens()
  {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
  
  getDecodedAccessToken(): any {
    try {
      return jwt_decode(this.getJwtToken()!);
    } catch(Error) {
      return null;
    }
  }
  
}
