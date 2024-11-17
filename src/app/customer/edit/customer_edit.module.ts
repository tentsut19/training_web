import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerEditComponent } from './customer_edit.component';
import { Daterangepicker } from 'ng2-daterangepicker';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker
  ],
  declarations: [CustomerEditComponent],
  exports: [
    CustomerEditComponent
  ],
  providers: [
  ]
})
export class CustomerEditModule { }
