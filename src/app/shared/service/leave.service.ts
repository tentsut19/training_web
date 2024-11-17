import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  constructor(private http: HttpClient, private constant: Constant) {
    
  }

  leaveSearch(req): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/tis/leave/search', JSON.stringify(req),
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

  createLeave(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.constant.API_REPORT_ENDPOINT}/tis/create-leave`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        'X-User': 'test'
        })
    });

    return this.http.request(req);
  }

  updateLeave(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.constant.API_REPORT_ENDPOINT}/tis/update-leave`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        'X-User': 'test'
        })
    });

    return this.http.request(req);
  }

  deleteLeaveHistory(id,userId): Observable<any> {
    return this.http.delete<any>(this.constant.API_REPORT_ENDPOINT + '/tis/delete-leave-history/' + id + '/user-id/' + userId,
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

  genExcel(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/tis/create-leave-excel', JSON.stringify(param),
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

  genExcelSecurityGuard(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/tis/create-leave-security-guard-excel', JSON.stringify(param),
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