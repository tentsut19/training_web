import {Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class Constant {

API_ENDPOINT :string;
API_REPORT_ENDPOINT :string;
API_CABSAT_REPORT_ENDPOINT :string;
API_DOMAIN :string;
WEB_URL: string;
APPROVER_TIMESHEET = false;

constructor() {
  this.API_ENDPOINT = environment.api_endpoint;
  this.API_REPORT_ENDPOINT = environment.api_report_endpoint;
  this.API_CABSAT_REPORT_ENDPOINT = environment.api_cabsat_report_endpoint;
  this.API_DOMAIN = environment.api_domain;
  this.WEB_URL = environment.web_url;

  var tisToken = JSON.parse(localStorage.getItem('tisToken'));
  console.log(tisToken)
  if(tisToken){
    if(tisToken.id == 2 
      || tisToken.id == 43 
      || tisToken.id == 45 
      || tisToken.id == 82 
      || tisToken.id == 2925 
      || tisToken.id == 2018){
        this.APPROVER_TIMESHEET = true;
    }
  }
  console.log(this.APPROVER_TIMESHEET)
}

}