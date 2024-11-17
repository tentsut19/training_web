import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerAddComponent } from './customer_add.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {
  SingleSelectionExampleModule
} from '../../base-components/select-search/single-selection.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { QRCodeModule } from 'angularx-qrcode';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    SingleSelectionExampleModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    QRCodeModule,
    Daterangepicker,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCJz79lL0YkOCZ0x9XixkFYDD0f7Ph2Vls',
      libraries: ['places', 'drawing', 'geometry']
    }),
    //AgmDrawingModule
  ],
  declarations: [CustomerAddComponent],
  exports: [
    CustomerAddComponent
  ],
  providers: [
    NgxSpinnerService
  ]
})
export class CustomerAddModule { }
