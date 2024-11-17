import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LogoSignatureComponent } from './logoSignature.component';
import {
  CompanyService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [LogoSignatureComponent],
  exports: [
    LogoSignatureComponent
  ],
  providers: [
    CompanyService
  ]
})
export class LogoSignatureModule { }
