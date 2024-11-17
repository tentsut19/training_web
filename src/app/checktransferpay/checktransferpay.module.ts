import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CheckTransferPayComponent } from './checktransferpay.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker,
    NgxSpinnerModule
  ],
  declarations: [CheckTransferPayComponent],
  exports: [
    CheckTransferPayComponent
  ],
  providers: [
    //CompanyService
  ]
})
export class CheckTransferPayModule { }
