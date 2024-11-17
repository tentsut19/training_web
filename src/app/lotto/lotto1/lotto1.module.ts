import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CompanyService
} from '../../shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Daterangepicker } from 'ng2-daterangepicker'; 
import { Lotto1Component } from './lotto1.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    Daterangepicker
  ],
  declarations: [Lotto1Component],
  exports: [
    Lotto1Component
  ],
  providers: [
    CompanyService
  ]
})
export class Lotto1Module { }
