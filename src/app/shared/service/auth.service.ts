import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { Constant } from '../constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService { 

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private logoutFlag: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLogged() {
    return this.loggedIn.asObservable();
  }

  get isLogout(){
    return this.logoutFlag.asObservable();
  }
 
  constructor(
    private router: Router,
    private http: HttpClient,
    private constant: Constant
  ) { }
 
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
 
  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
 
 
  // Verify user credentials on server to get token
  auth(data): Observable<any> {
    return this.http.post<any>(this.constant.API_DOMAIN + '/api/v1/login', data , this.httpOptions);
  }
 
  // After login save token and other values(if any) in localStorage
  setCustomer(resp) {
    var payload = {"customer_id":""}
    localStorage.setItem('username', resp.username);
    localStorage.setItem('access_token', resp.access_token);
    localStorage.setItem('customer_name',resp.customer_name);
    localStorage.setItem('role',resp.role);
    //this.userService.setUserLoginDetail();
    let token = resp.access_token;
    payload = jwt_decode(token);
    // console.log(payload);
    if(payload){
      localStorage.setItem('customer_id', payload.customer_id);
    }
    window.location.href = "/";
  }

  forceLogout(){
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/";
    }, 1000);
  }

  clearStorage(){
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/";
    }, 1000);
  }
  
  getAuthen(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    this.httpOptions.headers = headers;
    
    return this.http.get<any>(this.constant.API_DOMAIN + '/api/v1/authen', this.httpOptions);
  }
 
}