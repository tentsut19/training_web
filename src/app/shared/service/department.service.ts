import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient, private constant: Constant) {
    
  }

  // Get department list
  getDepartment(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/department');
  }

  // Get department by id
  getDepartmentById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/department/' + id);
  }

  // Update department by id
  updateDepartment(id, department): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/department/' + id, JSON.stringify(department),
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

  // Add department
  addDepartment(department): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/department', JSON.stringify(department),
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

  // Delete department by id
  deleteDepartment(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_ENDPOINT + '/department/' + id,
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

  // Get department list
  getDepartmentByCompanyId(companyId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/department/company/'+companyId);
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