import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeEditComponent } from './employee_edit.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgxSliderModule,
    Daterangepicker
  ],
  declarations: [EmployeeEditComponent],
  exports: [
    EmployeeEditComponent
  ],
  providers: [
    NgxSpinnerService
  ]
})
export class EmployeeEditModule { }
