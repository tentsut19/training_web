import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private http: HttpClient, private constant: Constant) { 
    
  }

  // Get Product Category list
  getProductCategory(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/product-category');
  }

  // Get Product Category by id
  getProductCategoryById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/product-category/' + id);
  }

  // Update Product Category by id
  updateProductCategory(id, productCategory): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/product-category/' + id, JSON.stringify(productCategory),
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

  // Add Product Category
  addProductCategory(productCategory): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/product-category', JSON.stringify(productCategory),
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

  // Delete Product Category by id
  deleteProductCategory(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_ENDPOINT + '/product-category/' + id,
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