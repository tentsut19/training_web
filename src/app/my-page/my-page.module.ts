import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyPageComponent } from './my-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [MyPageComponent],
  exports: [
    MyPageComponent
  ],
  providers: [
  ]
})
export class MyPageModule { }
