import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CompanyService
} from '../../shared';
import { TimesheetMasterComponent } from './timesheetMaster.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule
  ],
  declarations: [TimesheetMasterComponent],
  exports: [
    TimesheetMasterComponent
  ],
  providers: [
    CompanyService,
    NgxSpinnerService
  ]
})
export class TimesheetMasterModule { }
