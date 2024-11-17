import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DocumentComponent } from './document.component';
import {
  DepartmentService
} from '../shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ],
  declarations: [DocumentComponent],
  exports: [
    DocumentComponent
  ],
  providers: [
    DepartmentService,NgxSpinnerService
  ]
})
export class DocumentModule { }
