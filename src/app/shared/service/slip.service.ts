import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class SlipService {
  constructor(private http: HttpClient, private constant: Constant) {
  }
 
  // save slip
  saveSlip(slip): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/slip', JSON.stringify(slip),
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

  // search slip
  searchSlip(param): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/slip/search', JSON.stringify(param),
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


  // check paid holiday
  checkPaidHoliday(param): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/slip/checkPaidHoliday', JSON.stringify(param),
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

  // cash slip
  cashSlip(slip): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/slip/cash', JSON.stringify(slip),
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

  // cash slip
  cashSlipMonthly(slip): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/slip/monthly', JSON.stringify(slip),
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

  // cash slip
  cashSlipMonthly2(slip): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/slip/monthly2', JSON.stringify(slip),
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

  // cash slip
  cashSlipAuditMonthly(slip): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/slip/audit/monthly', JSON.stringify(slip),
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