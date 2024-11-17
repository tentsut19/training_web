import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MasterDataComponent } from './masterData.component';
import {
  CompanyService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [MasterDataComponent],
  exports: [
    MasterDataComponent
  ],
  providers: [
    CompanyService
  ]
})
export class MasterDataModule { }
