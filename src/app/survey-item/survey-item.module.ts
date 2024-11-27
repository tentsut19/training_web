import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SurveyItemsComponent } from './survey-item.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [SurveyItemsComponent],
  exports: [
    SurveyItemsComponent
  ],
  providers: [
  ]
})
export class SurveyItemsModule { }
