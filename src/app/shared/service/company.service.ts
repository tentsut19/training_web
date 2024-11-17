import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient, private constant: Constant) { 
    
  }

  // Get company list
  getCompany(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/company');
  }

  // Get company by id
  getCompanyById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/company/' + id);
  }

  // Update company by id
  updateCompany(id, company): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/company/' + id, JSON.stringify(company),
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

  // Add company
  addCompany(company): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/company', JSON.stringify(company),
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

  // Delete company by id
  deleteCompany(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_ENDPOINT + '/company/' + id,
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