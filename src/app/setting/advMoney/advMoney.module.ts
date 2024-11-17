import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CompanyService
} from '../../shared';
import { AdvMoneyComponent } from './advMoney.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ],
  declarations: [AdvMoneyComponent],
  exports: [
    AdvMoneyComponent
  ],
  providers: [
    CompanyService
  ]
})
export class AdvMoneyModule { }
