import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockComponent } from './stock.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [StockComponent],
  exports: [
    StockComponent
  ],
  providers: [
  ]
})
export class StockModule { }
