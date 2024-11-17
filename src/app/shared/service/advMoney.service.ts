import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class AdvMoneyService {
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

  // Get employee by id
  getEmployeeById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/employee/' + id);
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

  search(request): Observable<any> {
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

  // create employee
  create(advMoney): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/adv-money', JSON.stringify(advMoney),
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

  // create employee
  createAll(advMoney): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/adv-money/all', JSON.stringify(advMoney),
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

  // Get get by employee id
  getByEmployeeById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/adv-money/employee/' + id);
  }

  // Get get by employee id
  getItemByAdvId(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/adv-money/items/' + id);
  }

  // Get get by employee id
  getAll(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/adv-money');
  }

  // Delete employee by id
  delete(id): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/adv-money/' + id,
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

  // search adv money by criteria 
  searchByCriteria(criteria): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/adv-money/search', JSON.stringify(criteria),
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