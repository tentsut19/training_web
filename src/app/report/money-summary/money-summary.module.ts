import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MoneySummaryComponent } from './money-summary.component';
import {
  DepartmentService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [MoneySummaryComponent],
  exports: [
    MoneySummaryComponent
  ],
  providers: [
    DepartmentService
  ]
})
export class MoneySummaryModule { }
