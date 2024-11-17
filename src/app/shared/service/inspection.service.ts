import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  constructor(private http: HttpClient, private constant: Constant) {
  }

  get(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/inspection');
  }

  update(req): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/inspection', JSON.stringify(req),
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