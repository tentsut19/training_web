import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractAuditComponent } from './contract-audit.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CKEditorModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    Daterangepicker
  ],
  declarations: [ContractAuditComponent],
  exports: [
    ContractAuditComponent
  ],
  providers: [
    NgxSpinnerService
  ]
})
export class ContractAuditModule { }
