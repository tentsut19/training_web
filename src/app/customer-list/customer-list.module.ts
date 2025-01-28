import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerListComponent } from './customer-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [CustomerListComponent],
  exports: [
    CustomerListComponent
  ],
  providers: [
  ]
})
export class CustomerListModule { }
