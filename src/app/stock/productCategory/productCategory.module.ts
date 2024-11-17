import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProductCategoryComponent } from './productCategory.component';
import {
  CompanyService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [ProductCategoryComponent],
  exports: [
    ProductCategoryComponent
  ],
  providers: [
    CompanyService
  ]
})
export class ProductCategoryModule { }
