import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskApiService {

  readonly taskApiUrl = "https://localhost:7205/api";

  constructor(private http:HttpClient) { }

  // Task

  getTaskList(): Observable<any[]> {
    return this.http.get<any>(this.taskApiUrl + '/tasks');
  }

  addTask(data:any) {
    return this.http.post(this.taskApiUrl + '/tasks', data);
  }

  updateTask(id:number, data:any) {
    return this.http.put(this.taskApiUrl + `/tasks/${id}`, data);
  }

  deleteTask(id:number) {
    return this.http.delete(this.taskApiUrl + `/tasks/${id}`);
  }

  // Status

  getStatusList(): Observable<any[]> {
    return this.http.get<any>(this.taskApiUrl + '/status');
  }

  getStatus(id:number): Observable<any> {
    return this.http.get<any>(this.taskApiUrl + `/status/${id}`);
  }

  addStatus(data:any) {
    return this.http.post(this.taskApiUrl + '/status', data);
  }

  updateStatus(id:number, data:any) {
    return this.http.put(this.taskApiUrl + `/status/${id}`, data);
  }

  deleteStatus(id:number) {
    return this.http.delete(this.taskApiUrl + `/status/${id}`);
  }
}
