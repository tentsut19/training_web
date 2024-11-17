import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class CustomerSeqService {
  constructor(private http: HttpClient, private constant: Constant) {
  }
 
  // Get customer seq list
  getAllCustomerSeq(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/customer-seq');
  }

  // create customer seq
  create(advMoney): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/customer-seq', JSON.stringify(advMoney),
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