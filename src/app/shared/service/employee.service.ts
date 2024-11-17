import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient, private constant: Constant) {
  }

  login(employee): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/employee/login', JSON.stringify(employee),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Get employee list
  getEmployee(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/employee');
  }

  // Get employee all active list
  getEmployeeAllActive(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/employee/all/active');
  }

  // Get employee by id
  getEmployeeById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/employee/' + id);
  }

  // Get employee by id
  getEmployeeByIdV2(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/employee/v2/' + id);
  }

  // Update employee by id
  updateEmployee(id, employee): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/employee/' + id, JSON.stringify(employee),
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

  updatePassword(id, employee): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/employee/update-password/' + id, JSON.stringify(employee),
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

  verifyPassword(id, employee): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/employee/verify-password/' + id, JSON.stringify(employee),
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

  updateEmployeeSearch(): Observable<any> {
    return this.http.get<any>(this.constant.API_REPORT_ENDPOINT + '/tis/update/employee/search/');
  }

  // Update employee status by id
  updateEmployeeStatus(id, employee): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/employee/status/' + id, JSON.stringify(employee),
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

  backToWork(id, employee): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/employee/back-to-work/' + id, JSON.stringify(employee),
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

  search_old(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/employee/search', JSON.stringify(request),
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

  search(request): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/tis/employee/search', JSON.stringify(request),
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

  // Add employee
  addEmployee(employee): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/employee', JSON.stringify(employee),
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

  // Delete employee by id
  delete(id): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/employee/' + id,
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

  // Get employee by position id
  getEmployeeByPositionId(positionId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/employee/position/' + positionId);
  }

  // Get employee list internal only
  getInternalEmployee(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/employee-internal');
  }

  // Error handling
  handleError(error) {
    return throwError(error);
  } 
}