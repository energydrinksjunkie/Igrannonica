import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  readonly APIUrl="https://localhost:5001/api";
  constructor(private http:HttpClient) { }


  getLogsList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Logger');
  }

  addLog(val:any){
    return this.http.post(this.APIUrl+"/Logger",val);
  }

  deleteLog(val:any){
    return this.http.delete(this.APIUrl+"/Logger/"+val)
  }
}
