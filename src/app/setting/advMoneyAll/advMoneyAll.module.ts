import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CompanyService
} from '../../shared';
import { AdvMoneyAllComponent } from './advMoneyAll.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    Daterangepicker
  ],
  declarations: [AdvMoneyAllComponent],
  exports: [
    AdvMoneyAllComponent
  ],
  providers: [
    CompanyService
  ]
})
export class AdvMoneyAllModule { }
