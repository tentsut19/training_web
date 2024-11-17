import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PreCheckPointComponent } from './precheckpoint.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCJz79lL0YkOCZ0x9XixkFYDD0f7Ph2Vls',
      libraries: ['places']
    }),
    MatSelectModule,
    NgxMatSelectSearchModule, 
  ],
  declarations: [PreCheckPointComponent],
  exports: [
    PreCheckPointComponent
  ],
  providers: [
    //CompanyService
  ]
})
export class PreCheckPointModule { }
