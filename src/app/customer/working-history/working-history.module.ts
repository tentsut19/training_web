import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CompanyService
} from '../../shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule , MatSelectModule } from '@angular/material';
import { CustomerWorkingHistoryComponent } from './working-history.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    Daterangepicker,
    NgxMatSelectSearchModule,
    MatFormFieldModule,
    MatSelectModule,
    Daterangepicker
  ],
  declarations: [CustomerWorkingHistoryComponent],
  exports: [
    CustomerWorkingHistoryComponent
  ],
  providers: [
    CompanyService
  ]
})
export class CustomerWorkingHistoryModule { }
