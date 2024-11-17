import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { WorkScheduleComponent } from './workSchedule.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker,
    NgxSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule
  ],
  declarations: [WorkScheduleComponent],
  exports: [
    WorkScheduleComponent
  ],
  providers: [
    //CompanyService,
    NgxSpinnerService
  ]
})
export class WorkScheduleModule { }
