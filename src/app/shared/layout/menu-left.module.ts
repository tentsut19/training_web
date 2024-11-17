import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuLeftComponent } from './menu-left.component';
 

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [MenuLeftComponent],
  exports: [
    MenuLeftComponent
  ],
  providers: [ 
  ]
})
export class MenuLeftModule { }
