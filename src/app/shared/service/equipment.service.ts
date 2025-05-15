import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, timeout } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  httpOptions = {
    headers:new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http:HttpClient , private constant : Constant) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    this.httpOptions.headers = headers;
  }
 
  get(): Observable<any> {
    return this.http.get<any>(this.constant.API_DOMAIN + "/api/v1/equipment", this.httpOptions);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.constant.API_DOMAIN + "/api/v1/equipment-all", this.httpOptions);
  }

  getById(id): Observable<any> {
    return this.http.get<any>(this.constant.API_DOMAIN + "/api/v1/equipment/"+id, this.httpOptions);
  }

  create(req): Observable<any> {
    return this.http.post<any>(this.constant.API_DOMAIN + "/api/v1/equipment", JSON.stringify(req), this.httpOptions);
  }

  update(req,id): Observable<any> {
    return this.http.put<any>(this.constant.API_DOMAIN + "/api/v1/equipment/"+id, JSON.stringify(req), this.httpOptions);
  }

  delete(id): Observable<any> {
    return this.http.delete<any>(this.constant.API_DOMAIN + "/api/v1/equipment/"+id, this.httpOptions);
  }

  softDelete(id): Observable<any> {
    return this.http.patch<any>(this.constant.API_DOMAIN + "/api/v1/equipment/"+id, this.httpOptions);
  }

  uploadFile(formData: FormData): Observable<HttpEvent<any>> {

    const req = new HttpRequest('POST', `${this.constant.API_DOMAIN}/api/v1/upload-file`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        
        })
    });

    return this.http.request(req);
  }

  viewPdfByParam(title) {
    const options = {
      responseType: 'blob' as 'json', // important: this tells Angular you're expecting binary data
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http
      .post(
        this.constant.API_DOMAIN + "/api/v1/equipment-export-pdf-v2",
        { title: title },
        options
      )
      .pipe(
        timeout(30000), // 30 sec
        catchError((error: any) => {
          return throwError(this.handleError(error));
        })
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