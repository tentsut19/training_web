import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerViewComponent } from './customer_view.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [CustomerViewComponent],
  exports: [
    CustomerViewComponent
  ],
  providers: [
  ]
})
export class CustomerViewModule { }
