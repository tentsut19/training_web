import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class PreCheckPointService {

  constructor(private http: HttpClient, private constant: Constant) {
    
  }

  // Add Update pre checkpoint
  createUpdateCheckPoint(checkPoint): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/pre-checkpoint', JSON.stringify(checkPoint),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'cp-user'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Add Update pre checkpoint
  updateSystemProcess(checkPoint): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/pre-checkpoint/system/update', JSON.stringify(checkPoint),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'cp-user'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Add Update pre checkpoint
  updateSystemProcessList(checkPoint): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/pre-checkpoint/system/update/list', JSON.stringify(checkPoint),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'cp-user'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // search pre check point
  search(checkPoint): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/pre-checkpoint/search', JSON.stringify(checkPoint),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'cp-user'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // search pre check point
  getAllEmployee(): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/pre-checkpoint/employee/getAll',
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'cp-user'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // search pre check point
  searchSummary(checkPoint): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/pre-checkpoint/search-summary', JSON.stringify(checkPoint),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'cp-user'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // search pre check point
  searchEmployeeWork(checkPoint): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/pre-checkpoint/search-employee-work', JSON.stringify(checkPoint),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'cp-user'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  export(timesheet): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/pre-checkpoint/export', JSON.stringify(timesheet),
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