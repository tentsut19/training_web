import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  constructor(private http: HttpClient, private constant: Constant) { }

  upload(formData: FormData): Observable<HttpEvent<any>> {

    const req = new HttpRequest('POST', `${this.constant.API_ENDPOINT}/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        'X-User': 'test'
        })
    });

    return this.http.request(req);
  }

  uploadFile(formData: FormData): Observable<HttpEvent<any>> {

    const req = new HttpRequest('POST', `${this.constant.API_REPORT_ENDPOINT}/tis/file/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        'X-User': 'test'
        })
    });

    return this.http.request(req);
  }

  uploadImportantDocument(formData: FormData): Observable<HttpEvent<any>> {

    const req = new HttpRequest('POST', `${this.constant.API_REPORT_ENDPOINT}/tis/important-document/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        'X-User': 'test'
        })
    });

    return this.http.request(req);
  }

  uploadFileTimesheet(formData: FormData): Observable<HttpEvent<any>> {

    const req = new HttpRequest('POST', `${this.constant.API_REPORT_ENDPOINT}/tis/upload/timesheet`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        'X-User': 'test'
        })
    });

    return this.http.request(req);
  }

  getImportantDocument(id): Observable<any> {
    return this.http.get<any>(`${this.constant.API_ENDPOINT}/important-document/${id}`);
  }

  deleteImportantDocument(id): Observable<any> {
    return this.http.delete<any>(`${this.constant.API_REPORT_ENDPOINT}/tis/important-document/${id}`);
  }

  getFiles(id): Observable<any> {
    return this.http.get<any>(`${this.constant.API_ENDPOINT}/upload/${id}`);
  }

  remoteFile(id): Observable<any> {
    return this.http.delete<any>(`${this.constant.API_ENDPOINT}/upload/${id}`);
  }
}