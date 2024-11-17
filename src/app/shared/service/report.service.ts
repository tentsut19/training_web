import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, timeout } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient, private constant: Constant) {
  }
 
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // report guard pasttime checkpoint
  reportGuardPasttimeCheckpoint(param): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/report/guard/pasttime/checkpoint', JSON.stringify(param),
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

  // report guard pasttime checkpoint
  reportEmployeeProfile(param): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/report/employee/profile', JSON.stringify(param),
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
 
  downloadFile(url): any {
    return this.http.get(url, {responseType: 'blob'});
  }
 
  mergeDocument(param): Observable<any> {
    return this.http.post<any>(this.constant.API_ENDPOINT + '/report/merge/document', JSON.stringify(param),
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

  reportMergeDocument(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/tis/report/merge/document', JSON.stringify(param),
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

  genReportCustomer(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/report/tis/customer', JSON.stringify(param),
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

  genReportCustomerLimit(req): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/report/customer/limit/excel', JSON.stringify(req),
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

  getUpdateOrder(uuid): Observable<any> {
    return this.http.get<any>(this.constant.API_REPORT_ENDPOINT + '/report/update-order/uuid/'+uuid, this.httpOptions);
  }

  getUUID(): Observable<any> {
    return this.http.get<any>(this.constant.API_REPORT_ENDPOINT + '/report/get-order-uuid', this.httpOptions);
  }

  getStatus(uuid): Observable<any> {
    return this.http.get<any>(this.constant.API_REPORT_ENDPOINT + '/report/customer/uuid/'+uuid, this.httpOptions);
  }

  genReportShare(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/report/share', JSON.stringify(param),
    {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User': 'test'
      })
    }).pipe(
      retry(1),
      timeout(180000), // 1000 = 1s, 300000 = 300s = 5 min
      catchError(this.handleError)
    );
  }

  genReportInspection(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/report/inspection', JSON.stringify(param),
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

  genReportInspectionAll(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/report/inspection-all', JSON.stringify(param),
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

  genReportContractAudit(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/report/contract-audit', JSON.stringify(param),
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

  createEmployeeCardReport(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/tis/create-card-employee-report', JSON.stringify(param),
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

  createPermitCard(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/tis/create-permit-card', JSON.stringify(param),
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

  getExcelBankFile(param): Observable<any> {
    return this.http.post<any>(this.constant.API_REPORT_ENDPOINT + '/report/tis/excel/bankFile', JSON.stringify(param),
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