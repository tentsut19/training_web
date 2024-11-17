import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class CheckPointService {

  constructor(private http: HttpClient, private constant: Constant) {
    
  }

  // Add Update checkpoint
  createUpdateCheckPoint(checkPoint): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/checkpoint', JSON.stringify(checkPoint),
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

  // Get checkpoint
  getCheckPoint(checkPoint): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/checkpoint/getCheckPoint', JSON.stringify(checkPoint),
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

  // Get password
  getPassword(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/checkpoint/getPassword');
  }

  //Export Bank File
  exportBankFile(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/checkpoint/exportBankFile', JSON.stringify(request),
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