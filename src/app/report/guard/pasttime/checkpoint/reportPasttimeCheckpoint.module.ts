import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ReportPasttimeCheckpointComponent } from './reportPasttimeCheckpoint.component';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Daterangepicker,
  ],
  declarations: [ReportPasttimeCheckpointComponent],
  exports: [
    ReportPasttimeCheckpointComponent
  ],
  providers: [
    //CompanyService
  ]
})
export class ReportPasttimeCheckpointModule { }
