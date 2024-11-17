import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PositionComponent } from './position.component';
import { OrgChartModule } from 'ng2-org-chart';
import {
  PositionService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrgChartModule
  ],
  declarations: [PositionComponent],
  exports: [
    PositionComponent
  ],
  providers: [
    PositionService
  ]
})
export class PositionModule { }
