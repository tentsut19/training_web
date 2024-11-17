import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  tisToken = null;
  constructor(private http: HttpClient, private constant: Constant) {
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
  }

  searchCustomer(customer): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/complaint/search', JSON.stringify(customer),
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

  get(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/complaint');
  }

  getById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/complaint/' + id);
  }

  update(id, customer): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/complaint/' + id, JSON.stringify(customer),
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

  add(customer): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/complaint', JSON.stringify(customer),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': ""+this.tisToken.id
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  sendNotify(val): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/notify/complaint', JSON.stringify(val),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': ""+this.tisToken.id
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  delete(id): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/complaint/' + id,
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