import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class CustomerReportLineService {
  constructor(private http: HttpClient, private constant: Constant) {
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/customer-report-line');
  }

  // Error handling
  handleError(error) {
    return throwError(error);
  } 
}