import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class RecommenderService {

  constructor(private http: HttpClient, private constant: Constant) {
    
  }

  getByRecommenderType(type): Observable<any> {
    return this.http.get<any>(this.constant.API_ENDPOINT + '/recommender/type/' + type);
  }

  // Error handling
  handleError(error) {
    return throwError(error);
  }
}