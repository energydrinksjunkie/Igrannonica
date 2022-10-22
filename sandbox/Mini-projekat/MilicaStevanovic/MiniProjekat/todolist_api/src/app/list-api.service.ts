import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListApiService {

  readonly listAPIUrl = "https://localhost:7127/api";

  constructor(private http:HttpClient) { }

  getList():Observable<any[]>{
    return this.http.get<any>(this.listAPIUrl + '/ToDoLists');
  }

  addTask(data:any)
  {
    return this.http.post(this.listAPIUrl + '/ToDoLists',data);
  }
  updateTask(id:number, data:any)
  {
    return this.http.put(this.listAPIUrl + `/ToDoLists/${id}`,data);
  }
  deleteTask(id:number)
  {
    return this.http.delete(this.listAPIUrl + `/ToDoLists/${id}`);
  }

  getUsers():Observable<any[]>{
    return this.http.get<any>(this.listAPIUrl + '/Users');
  }

  addUser(data:any)
  {
    return this.http.post(this.listAPIUrl + '/Users',data);
  }
  updateUser(id:number, data:any)
  {
    return this.http.put(this.listAPIUrl + `/Users/${id}`,data);
  }
  deleteUser(id:number)
  {
    return this.http.delete(this.listAPIUrl + `/Users/${id}`);
  }
  
}
