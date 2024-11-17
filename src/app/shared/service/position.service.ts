import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class PositionService {
  constructor(private http: HttpClient, private constant: Constant) {
   }

  // Get position list
  getPosition(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/position');
  }

  // Get position by id
  getPositionById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/position/' + id);
  }

  getByDepartmentId(departmentId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/position/department/' + departmentId);
  }

  // Update position by id
  updatePosition(id, position): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/position/' + id, JSON.stringify(position),
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

  // Add position
  addPosition(position): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/position', JSON.stringify(position),
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

  // Delete position by id
  deletePosition(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_ENDPOINT + '/position/' + id,
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