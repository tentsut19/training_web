import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, timeout } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  httpOptions = {
    headers:new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http:HttpClient , private constant : Constant) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    this.httpOptions.headers = headers;
   }
 
   get(): Observable<any> {
    return this.http.get<any>(this.constant.API_DOMAIN + "/api/v1/product", this.httpOptions);
  }

  getById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_DOMAIN + "/api/v1/product/"+id, this.httpOptions);
  }

  create(req): Observable<any> {
    return this.http.post<any>(this.constant.API_DOMAIN + "/api/v1/product", JSON.stringify(req), this.httpOptions);
  }

  update(req,id): Observable<any> {
    return this.http.put<any>(this.constant.API_DOMAIN + "/api/v1/product/"+id, JSON.stringify(req), this.httpOptions);
  }

  delete(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_DOMAIN + "/api/v1/product/"+id, this.httpOptions);
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