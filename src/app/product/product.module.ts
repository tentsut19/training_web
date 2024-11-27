import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OrgChartModule } from 'ng2-org-chart';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ProductComponent } from './product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { TagInputModule } from 'ngx-chips';

import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrgChartModule,
    NgxSpinnerModule,
    TagInputModule,
    BrowserModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  declarations: [ProductComponent],
  exports: [
    ProductComponent
  ],
  providers: [
    NgxSpinnerService
  ]
})
export class ProductModule { }
