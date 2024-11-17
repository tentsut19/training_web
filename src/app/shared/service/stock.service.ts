import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient, private constant: Constant) {
    
  }

  // Get product by id
  getProductById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/stock/' + id);
  }

  get(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/stock');
  }

  search(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/stock/search', JSON.stringify(request),
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

  // Add product
  addProduct(product): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/stock', JSON.stringify(product),
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

  // Update quantity by id
  updateQuantity(id, req): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/stock/import-quantity/' + id, JSON.stringify(req),
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

  // Update quantity by id
  update(id, req): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/stock/' + id, JSON.stringify(req),
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

  // Delete product by id
  delete(id): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/stock/' + id,
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