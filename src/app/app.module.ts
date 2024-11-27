import { SurveyRoundModule } from "./survey-round/survey-round.model";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BasicAuthInterceptor, ErrorInterceptor } from './_helpers';
import {
  HeaderComponent,
  MenuLeftComponent,
  LoginInitComponent,
  FooterComponent,
  Constant,
} from "./shared";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ProductCategoryModule } from "./product-category/product-category.module";
import { ProductModule } from "./product/product.module";
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuLeftComponent,
    FooterComponent,
    LoginInitComponent
  ],
  imports: [
    HttpClientModule,
    NgxSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    ProductCategoryModule,
    ProductModule,
    SurveyRoundModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    Constant,NgxSpinnerService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
