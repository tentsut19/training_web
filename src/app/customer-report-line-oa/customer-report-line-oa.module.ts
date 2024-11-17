import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { CustomerReportLineOAComponent } from './customer-report-line-oa.component';
import {
  EmployeeService
} from '../shared';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { Daterangepicker } from 'ng2-daterangepicker';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';

import {
  PaginationModule
} from '../common-components/pagination/pagination.module';

import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    BrowserModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxSliderModule,
    NgxMatSelectSearchModule,
    PaginationModule,
    MatFormFieldModule,
    MatSelectModule,
    Daterangepicker
  ],
  declarations: [CustomerReportLineOAComponent],
  exports: [
    CustomerReportLineOAComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    EmployeeService,NgxSpinnerService
  ]
})
export class CustomerReportLineOAModule { }
