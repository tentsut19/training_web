import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  constructor(private http: HttpClient, private constant: Constant) {
  }
 
  // Get insurance list
  getInsurance(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/insurance');
  }

  // Get insurance by id
  getInsuranceById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/insurance/' + id);
  }

  // Update insurance by id
  updateInsurance(id, employee): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/insurance/' + id, JSON.stringify(employee),
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

  search(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/insurance/search', JSON.stringify(request),
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

  // Add insurance
  addInsurance(insurance): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/insurance', JSON.stringify(insurance),
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

  // Delete insurance by id
  delete(id): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/insurance/' + id,
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
    return throwError(error);
  }
}