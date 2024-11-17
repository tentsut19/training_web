import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class ContractAuditService {
  constructor(private http: HttpClient, private constant: Constant) {
  }

  get(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/contract-audit');
  }

  createOrUpdate(value): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/contract-audit' , JSON.stringify(value),
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