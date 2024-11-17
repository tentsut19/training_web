import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { ComplaintComponent } from './complaint.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';

import {
  EmployeeService
} from '../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxMatSelectSearchModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  declarations: [ComplaintComponent],
  exports: [
    ComplaintComponent
  ],
  providers: [
    EmployeeService,NgxSpinnerService
  ]
})
export class ComplaintModule { }
