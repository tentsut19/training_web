import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient, private constant: Constant) {
  }

  searchCustomer(customer): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/customer/search', JSON.stringify(customer),
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

  // Get customer list
  getCustomer(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/customer');
  }

  getCustomerForDropDown(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/customer/forDropDown');
  }

  getCustomer2(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/customer2');
  }

  //customer audit
  getCustomerAuditList(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/customer3');
  }

  // Get customer by id
  getCustomerById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/customer/' + id);
  }

  // Get customer by id
  getCustomerAuditConfigByCustomerId(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/customer/audit/' + id);
  }

  // Add customer
  addCustomerAuditConfig(customer): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/customer/audit', JSON.stringify(customer),
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

  // Update customer by id
  updateCustomer(id, customer): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/customer/' + id, JSON.stringify(customer),
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

  // Add customer
  addCustomer(customer): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/customer', JSON.stringify(customer),
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

  // Delete customer by id
  deleteCustomer(id): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/customer/' + id,
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
 
  // Search Schedule
  searchSchedule(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/customer/audit/schedule/search', JSON.stringify(request),
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

  // Save Update Schedule
  saveUpdateSchedule(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/customer/audit/schedule', JSON.stringify(request),
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