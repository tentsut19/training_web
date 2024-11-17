import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CompanyService
} from '../../shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Daterangepicker } from 'ng2-daterangepicker';
import { TimeSheetManageComponent } from './timesheet-manage.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule , MatSelectModule } from '@angular/material';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    Daterangepicker,
    NgxMatSelectSearchModule,
    MatFormFieldModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule
  ],
  declarations: [TimeSheetManageComponent],
  exports: [
    TimeSheetManageComponent
  ],
  providers: [
    CompanyService
  ]
})
export class TimeSheetManageModule { }
