import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerAuditManageComponent } from './customerAuditManage.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ],
  declarations: [CustomerAuditManageComponent],
  exports: [
    CustomerAuditManageComponent
  ],
  providers: [
  ]
})
export class CustomerAuditManageModule { }
