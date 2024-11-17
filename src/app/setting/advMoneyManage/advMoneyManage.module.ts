import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CompanyService
} from '../../shared';
import { AdvMoneyManageComponent } from './advMoneyManage.component';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker
  ],
  declarations: [AdvMoneyManageComponent],
  exports: [
    AdvMoneyManageComponent
  ],
  providers: [
    CompanyService
  ]
})
export class AdvMoneyManageModule { }
