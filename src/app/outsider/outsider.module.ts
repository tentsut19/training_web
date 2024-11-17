import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OutsiderComponent } from './outsider.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import {
  DepartmentService
} from '../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule
  ],
  declarations: [OutsiderComponent],
  exports: [
    OutsiderComponent
  ],
  providers: [
    DepartmentService,NgxSpinnerService
  ]
})
export class OutsiderModule { }
