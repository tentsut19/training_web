import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  constructor(private http: HttpClient, private constant: Constant) {
  }

  // Get timesheet by id
  getTimesheetById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/timesheet/' + id);
  }

  getTimeSheetSubItemById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/timesheet/time-sheet-sub-item/' + id);
  }
  
  getTimesheetDetailById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/timesheet-detail/' + id);
  }

  createOrUpdate(timesheet): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/timesheet', JSON.stringify(timesheet),
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

  patchStatus(timesheet): Observable<any> {
    return this.http.patch<any>(this.constant.API_ENDPOINT + '/timesheet/update-status', JSON.stringify(timesheet),
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

  searchByCriteria(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/timesheet/search', JSON.stringify(request),
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

  searchByCriteria_V2(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/timesheet/search/v2', JSON.stringify(request),
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

  // Delete timesheet by id
  deleteTimesheet(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_ENDPOINT + '/timesheet/' + id,
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

  searchSubTimesheet(request): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/timesheet/search-sub-timesheet', JSON.stringify(request),
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

  export(timesheet): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/timesheet/export', JSON.stringify(timesheet),
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