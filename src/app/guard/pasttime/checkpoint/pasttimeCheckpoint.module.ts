import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PasttimeCheckpointComponent } from './pasttimeCheckpoint.component';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker,
  ],
  declarations: [PasttimeCheckpointComponent],
  exports: [
    PasttimeCheckpointComponent
  ],
  providers: [
    //CompanyService
  ]
})
export class PasttimeCheckpointModule { }
