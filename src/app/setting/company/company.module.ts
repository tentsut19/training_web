import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CompanyComponent } from './company.component';
import {
  CompanyService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [CompanyComponent],
  exports: [
    CompanyComponent
  ],
  providers: [
    CompanyService
  ]
})
export class CompanyModule { }
