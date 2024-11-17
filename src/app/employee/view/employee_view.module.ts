import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EmployeeViewComponent } from './employee_view.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgxSliderModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [EmployeeViewComponent],
  exports: [
    EmployeeViewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    NgxSpinnerService
  ]
})
export class EmployeeViewModule { }
