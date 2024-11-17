import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  constructor(private http: HttpClient, private constant: Constant) {
  }

  getByEmployeeId(employeeId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/file/employee/' + employeeId);
  }

  getImportantDocumentByEmployeeId(employeeId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/important-document/employee/' + employeeId);
  }

  getDocument(ownId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/document/ownId/'+ownId);
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