import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class CalendarHolidayService {

  constructor(private http: HttpClient, private constant: Constant) {
   }

  // Get calendar holiday list
  getCalendarHoliday(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/setting/calendar');
  }

  // Get calendar holiday by id
  getCalendarHolidayById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/setting/calendar/' + id);
  }

  getByCalendarHolidayId(departmentId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/setting/calendar/' + departmentId);
  }

  // Update calendar holiday by id
  updateCalendarHoliday(id, param): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/setting/calendar/' + id, JSON.stringify(param),
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

  // Add calendar holiday
  addCalendarHoliday(param): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/setting/calendar', JSON.stringify(param),
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
 

  // Delete calendar holiday by id
  deleteCalendarHoliday(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_ENDPOINT + '/setting/calendar/' + id,
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

  // Search calendar holiday
  searchCalendarHoliday(param): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/setting/calendar/search', JSON.stringify(param),
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