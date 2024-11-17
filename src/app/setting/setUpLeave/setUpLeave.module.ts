import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SetUpLeaveComponent } from './setUpLeave.component';
import {
  CompanyService
} from '../../shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule
  ],
  declarations: [SetUpLeaveComponent],
  exports: [
    SetUpLeaveComponent
  ],
  providers: [
    CompanyService,NgxSpinnerService
  ]
})
export class SetUpLeaveModule { }
