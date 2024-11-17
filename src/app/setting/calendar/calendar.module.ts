import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CalendarHolidayComponent } from './calendar.component';
import { OrgChartModule } from 'ng2-org-chart';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrgChartModule,
    Daterangepicker
  ],
  declarations: [CalendarHolidayComponent],
  exports: [
    CalendarHolidayComponent
  ],
  providers: [
     
  ]
})
export class CalendarHolidayModule { }
