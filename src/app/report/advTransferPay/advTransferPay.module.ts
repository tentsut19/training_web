import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdvTransferPayComponent } from './advTransferPay.component';
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
  declarations: [AdvTransferPayComponent],
  exports: [
    AdvTransferPayComponent
  ],
  providers: [
    //CompanyService
  ]
})
export class AdvTransferPayModule { }
