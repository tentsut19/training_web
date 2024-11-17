import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient, private constant: Constant) {
  }
 

  // Get project list
  getProject(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/project');
  }

  // Get project by id
  getProjectById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/project/' + id);
  }

  // create project
  create(project): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/project', JSON.stringify(project),
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

  // Delete project by id
  deleteProjectById(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_ENDPOINT + '/project/' + id);
  }

  // Error handling
  handleError(error) {
    return throwError(error);
  }
}