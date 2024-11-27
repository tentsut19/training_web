import {Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class Constant {

API_DOMAIN :string;
API_REPORT_DOMAIN :string;

constructor() {
  this.API_DOMAIN = environment.api_domain;
  this.API_REPORT_DOMAIN = environment.api_report_domain;
  }
}