import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ReportSlipComponent } from './reportSlip.component';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker,
  ],
  declarations: [ReportSlipComponent],
  exports: [
    ReportSlipComponent
  ],
  providers: [
    //CompanyService
  ]
})
export class ReportSlipModule { }
