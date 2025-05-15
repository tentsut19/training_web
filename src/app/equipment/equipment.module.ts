import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EquipmentComponent } from './equipment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  declarations: [EquipmentComponent],
  exports: [
    EquipmentComponent
  ],
  providers: [
    NgxSpinnerService
  ]
})
export class EquipmentModule { }
