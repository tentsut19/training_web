import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class OutsiderService {

  constructor(private http: HttpClient, private constant: Constant) {
    
  }

  get(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/outsider');
  }

  getById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/outsider/' + id);
  }

  update(id, department): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/outsider/' + id, JSON.stringify(department),
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

  add(department): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/outsider', JSON.stringify(department),
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

  delete(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_ENDPOINT + '/outsider/' + id,
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