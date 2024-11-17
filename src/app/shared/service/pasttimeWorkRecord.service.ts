import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class PasttimeWorkRecordService {
  constructor(private http: HttpClient, private constant: Constant) {
  }
 
  // save pasttime work record
  savePasttimeWorkRecord(pasttimeWorkRecord): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/guard/pasttime/work-record', JSON.stringify(pasttimeWorkRecord),
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

  // search pasttime work record
  searchPasttimeWorkRecord(pasttimeWorkRecord): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/guard/pasttime/search', JSON.stringify(pasttimeWorkRecord),
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

  searchPasttimeWorkRecordByEmployeeId(pasttimeWorkRecord, employeeId): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/guard/pasttime/employee/'+employeeId+'/search', JSON.stringify(pasttimeWorkRecord),
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

  // update payment
  updatePaymentPasttimeWorkRecord(list): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/guard/pasttime/updatePayment', JSON.stringify(list),
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
  if(error.error instanceof ErrorEvent) {
  // Get client-side error
  errorMessage = error.error.message;
  } else {
  // Get server-side error
  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  //window.alert(errorMessage);
  return throwError(errorMessage);
  }
}