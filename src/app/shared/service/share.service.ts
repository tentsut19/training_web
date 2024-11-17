import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private http: HttpClient, private constant: Constant) {
    
  }

  getById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/share/' + id);
  }

  get(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/share');
  }

  getByEmployee(employeeId,employeeType): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/share/employee/'+employeeId+'/type/'+employeeType);
  }

  search_old(req){
    return this.http.post<any>(this.constant.API_ENDPOINT + '/share/search', JSON.stringify(req),
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
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/tis/share/search', JSON.stringify(request),
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

  updateCode(req,shareId){
    return this.http.post<any>(this.constant.API_ENDPOINT + '/share/update-code/'+shareId, JSON.stringify(req),
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

  getShareItemByShareId(shareId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/share-item/share/'+shareId);
  }

  updateShare(): Observable<any> {
    return this.http.get<any>(this.constant.API_REPORT_ENDPOINT + '/tis/update-share');
  }

  // Error handling
  handleError(error) {
    return throwError(error);
  }
}