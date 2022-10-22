import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardApiService {

  readonly apiUrl= "https://localhost:7030/api/Card";

  constructor(private http:HttpClient) { }

  getAllCards():Observable<any[]>{
    return this.http.get<any>(this.apiUrl+"/getCards");
  }
  insertCard(data:any){
    console.log(data);
    return this.http.post(this.apiUrl+`/insertCard?HolderName=${data.holderName}&HolderLastName=${data.lastName}&CardNumber=${data.cardNumber}&Balance=10000`,data);

  }
  deleteCard(id:number|string){
    console.log(this.apiUrl+`/deleteCard?id=${id}`);
    return this.http.delete(this.apiUrl+`/deleteCard?id=${id}`);
  }
}
