import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { StockComponent } from './stock.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [StockComponent],
  exports: [
    StockComponent
  ],
  providers: [
    //CompanyService
  ]
})
export class StockModule { }
