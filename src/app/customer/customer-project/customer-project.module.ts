import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CustomerProjectComponent } from './customer-project.component';
import {
  DepartmentService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [CustomerProjectComponent],
  exports: [
    CustomerProjectComponent
  ],
  providers: [
    DepartmentService
  ]
})
export class CustomerProjectModule { }
