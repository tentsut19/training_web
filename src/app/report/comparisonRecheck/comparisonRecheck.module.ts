import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ComparisonRecheckComponent } from './comparisonRecheck.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker,
    NgxSpinnerModule
  ],
  declarations: [ComparisonRecheckComponent],
  exports: [
    ComparisonRecheckComponent
  ],
  providers: [
    //CompanyService
    NgxSpinnerService
  ]
})
export class ComparisonRecheckModule { }
