import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PickStockComponent } from './pickStock.component';
import { OrgChartModule } from 'ng2-org-chart';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrgChartModule,
    Daterangepicker
  ],
  declarations: [PickStockComponent],
  exports: [
    PickStockComponent
  ],
  providers: [
     
  ]
})
export class PickStockModule { }
