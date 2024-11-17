import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DepartmentComponent } from './department.component';
import {
  DepartmentService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [DepartmentComponent],
  exports: [
    DepartmentComponent
  ],
  providers: [
    DepartmentService
  ]
})
export class DepartmentModule { }
