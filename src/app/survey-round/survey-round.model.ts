import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SurveyRoundComponent } from "./survey-round.component";
import { SurveyItemsModule } from "../survey-item/survey-item.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TimeMaskDirective } from "../shared/directive/time-mask.directive";

@NgModule({
  declarations: [SurveyRoundComponent,TimeMaskDirective],
  exports: [SurveyRoundComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SurveyItemsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
})
export class SurveyRoundModule {}
