import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(private http: HttpClient, private constant: Constant) { 
    
  }

  // Get Master Data list
  getMasterData(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/master-data');
  }

  // Get Master Data list active
  getMasterDataCategory(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/master-data/category');
  }

  // Search Master Data
  searchMasterData(masterData): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/master-data/search', JSON.stringify(masterData),
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

  // Get Master Data by id
  getMasterDataById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/master-data/' + id);
  }

  // Update Master Data by id
  updateMasterData(id, masterData): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/master-data/' + id, JSON.stringify(masterData),
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

  // Add Master Data
  addMasterData(masterData): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/master-data', JSON.stringify(masterData),
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

  // Add Or Update Master Data
  addOrUpdateMasterData(masterData): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/master-data/add-update', JSON.stringify(masterData),
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

  getTimeSheetMaster(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/timesheet-master-data');
  }

  getMainTopic(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/timesheet-master-data/main-topic');
  }

  getSubTopic(): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/timesheet-master-data/sub-topic');
  }

  getSubTopicByMainTopic(mainTopicId): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/timesheet-master-data/sub-topic/main-topic/'+mainTopicId);
  }

  searchTimeSheetMaster(req): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/timesheet-master-data/search', JSON.stringify(req),
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

  addTimeSheetMaster(masterData): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/timesheet-master-data', JSON.stringify(masterData),
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

  updateTimeSheetMaster(masterData,id): Observable<any> {
    return this.http.put<any>(this.constant.API_ENDPOINT + '/timesheet-master-data/'+id, JSON.stringify(masterData),
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

    // Delete Master Data by id
    delete(id): Observable<any> {
      return this.http.delete<any>(this.constant.API_ENDPOINT + '/timesheet-master-data/' + id,
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