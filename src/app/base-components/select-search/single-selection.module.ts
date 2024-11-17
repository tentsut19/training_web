import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SingleSelectionExampleComponent } from './single-selection.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    FormsModule
  ],
  declarations: [SingleSelectionExampleComponent],
  exports: [
    SingleSelectionExampleComponent
  ],
  providers: [ 
  ]
})
export class SingleSelectionExampleModule { }
