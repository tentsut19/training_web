import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PasttimePaymentComponent } from './pasttimePayment.component';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker,
  ],
  declarations: [PasttimePaymentComponent],
  exports: [
    PasttimePaymentComponent
  ],
  providers: [
    //CompanyService
  ]
})
export class PasttimePaymentModule { }
