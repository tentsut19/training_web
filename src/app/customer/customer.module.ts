import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { CustomerComponent } from './customer.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import {
  EmployeeService
} from '../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  declarations: [CustomerComponent],
  exports: [
    CustomerComponent
  ],
  providers: [
    EmployeeService,NgxSpinnerService
  ]
})
export class CustomerModule { }
