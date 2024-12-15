import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProductCategoryComponent } from "./product-category/product-category.component";
import { ProductComponent } from "./product/product.component";
import { AuthGuard } from "./_helpers/auth.guard";
import { MyPageComponent } from "./my-page/my-page.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent
  },
  {
    path: "product-category",
    component: ProductCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "product",
    component: ProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "my-page",
    component: MyPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
