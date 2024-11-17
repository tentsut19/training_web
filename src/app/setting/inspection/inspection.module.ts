import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InspectionComponent } from './inspection.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    Daterangepicker
  ],
  declarations: [InspectionComponent],
  exports: [
    InspectionComponent
  ],
  providers: [
    NgxSpinnerService
  ]
})
export class InspectionModule { }
