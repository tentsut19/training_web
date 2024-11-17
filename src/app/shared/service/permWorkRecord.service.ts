import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class PermWorkRecordService {
  constructor(private http: HttpClient, private constant: Constant) {
  }
 
  getGuard(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/guard/getGuard');
  }

  savePermWorkRecord(req): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/guard/permanent/work-record', JSON.stringify(req),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'test'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  searchPermWorkRecord(req): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/guard/permanent/search', JSON.stringify(req),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'test'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  searchPermWorkPeroid(param): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/guard/permanent/search/work-peroid', JSON.stringify(param),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'test'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updatePaidStatusPermWorkRecord(req): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/guard/permanent/work-record/updatePaidStatus', JSON.stringify(req),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'test'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
 
  // Error handling
  handleError(error) {
    let errorMessage = '';
    console.error(error);
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      console.error(`Error Code: ${error.error.code}\nMessage: ${error.error.data.error_message}`);
      errorMessage = error.error.data.error_message;
      if(error.error.code == 'general_error'){
        errorMessage = error.error.code;
      }
    }
    //window.alert(errorMessage);
    return throwError(errorMessage);
  }
}