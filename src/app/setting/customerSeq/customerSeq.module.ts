import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CompanyService
} from '../../shared';
import { CustomerSeqComponent } from './customerSeq.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ],
  declarations: [CustomerSeqComponent],
  exports: [
    CustomerSeqComponent
  ],
  providers: [
    CompanyService
  ]
})
export class CustomerSeqModule { }
