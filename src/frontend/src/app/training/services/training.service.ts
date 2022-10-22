import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  readonly trainingAPIUrl = environment.apiUrl + "/Training";

  constructor(private http: HttpClient) { }

  sendDataForTraining(source:any):Observable<any[]>{
    return this.http.post<any>(this.trainingAPIUrl + `/begin_training`, source,{
      //reportProgress: true,
      //observe: 'events'
    }).pipe(
      //tap(_ => console.log(`fetched all data`)),
      // TODO zakomentarisano jer onemogucava ispravan handling u pozivaocu pa nikad ne ide u
      // error granu observer-a 
      // catchError(this.handleError<any>('getDatasets')) 
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead
      
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
