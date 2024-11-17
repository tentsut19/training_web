import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProjectSettingComponent } from './project.component';
import {
  DepartmentService
} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [ProjectSettingComponent],
  exports: [
    ProjectSettingComponent
  ],
  providers: [
    DepartmentService
  ]
})
export class ProjectSettingModule { }
