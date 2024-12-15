import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { MyPageModule } from '../my-page/my-page.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyPageModule
  ],
  declarations: [DashboardComponent],
  exports: [
    DashboardComponent
  ],
  providers: [
  ]
})
export class DashboardModule { }
