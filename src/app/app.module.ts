import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  HeaderComponent,
  MenuLeftComponent,
  LoginInitComponent,
  FooterComponent,
  Constant
} from './shared';
import { DashboardModule } from './dashboard/dashboard.module';
import { CompanyModule } from './setting/company/company.module';
import { DepartmentModule } from './setting/department/department.module';
import { PositionModule } from './setting/position/position.module';
import { MasterDataModule } from './setting/masterData/masterData.module';
import { ProductCategoryModule } from './stock/productCategory/productCategory.module';
import { StockModule } from './stock/stock.module';
import { EmployeeModule } from './employee/employee.module';
import { EmployeeViewModule } from './employee/view/employee_view.module';
import { EmployeeAddModule } from './employee/add/employee_add.module';
import { EmployeeEditModule } from './employee/edit/employee_edit.module';
import { CustomerModule } from './customer/customer.module';
import { CustomerAddModule } from './customer/add/customer_add.module';
import { CustomerViewModule } from './customer/view/customer_view.module';
import { CustomerEditModule } from './customer/edit/customer_edit.module';
import { PasttimeCheckpointModule } from './guard/pasttime/checkpoint/pasttimeCheckpoint.module';
import { ReportPasttimeCheckpointModule } from './report/guard/pasttime/checkpoint/reportPasttimeCheckpoint.module';
import { PasttimePaymentModule } from './guard/pasttime/payment/pasttimePayment.module';
import { WorkScheduleModule } from './guard/permanent/workSchedule/workSchedule.module';
import { ReportSlipModule } from './report/slip/reportSlip.module';
import { CheckTransferPayModule } from './checktransferpay/checktransferpay.module';
import { CalendarHolidayModule } from './setting/calendar/calendar.module';
import { OutsiderModule } from './outsider/outsider.module';
import { ShareModule } from './share/share.module';
import { GuardCheckPointModule } from './guard/permanent/guardCheckPoint/guardCheckPoint.module';
import { ComparisonModule } from './report/comparison/comparison.module';
import { ComparisonRecheckModule } from './report/comparisonRecheck/comparisonRecheck.module';
import { ComplaintModule } from './complaint/complaint.module';
import { ComparisonAuditModule } from './report/comparisonAudit/comparisonAudit.module';
import { InspectionModule } from './setting/inspection/inspection.module';
import { CustomerAuditModule } from './setting/customerAudit/customerAudit.module';
import { CustomerAuditManageModule } from './setting/customerAudit/customerAuditMange/customerAuditManage.module';
import { RentHouseModule } from './setting/rentHouse/rentHouse.module';
import { InsuranceModule } from './setting/insurance/insurance.module';
import { PickStockModule } from './stock/pickStock/pickStock.module';
import { RentHouseManageModule } from './setting/rentHouse/rentHouseManange/rentHouseManage.module';
import { DocumentModule } from './document/document.module';
import { ContractAuditModule } from './setting/contractAudit/contract-audit.module';
import { GuardNotWorkModule } from './report/guardNotWork/guardNotWork.module';
import { AdvMoneyModule } from './setting/advMoney/advMoney.module';
import { AdvMoneyManageModule } from './setting/advMoneyManage/advMoneyManage.module';
import { AdvMoneyAllModule } from './setting/advMoneyAll/advMoneyAll.module';
import { CustomerSeqModule } from './setting/customerSeq/customerSeq.module';
import { AdvTransferPayModule } from './report/advTransferPay/advTransferPay.module';
import { ComparisonAdvModule } from './report/comparisonAdv/comparisonAdv.module';
import { PreCheckPointModule } from './precheckpoint/precheckpoint.module';
import { LogoSignatureModule } from './setting/logoSignature/logoSignature.module';
import { EmployeeWorkHistoryModule } from './employee/work_history/work_history.module';
import { LeaveModule } from './employee/leave/leave.module';
import { ConfirmationGuard } from './shared/guard/confirmation.guard';
import { ProjectSettingModule } from './setting/project/project.module';
import { CustomerProjectModule } from './customer/customer-project/customer-project.module';
import { MoneySummaryModule } from './report/money-summary/money-summary.module';
import { SetUpLeaveModule } from './setting/setUpLeave/setUpLeave.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { TimeSheetListModule } from './timesheet/list/timesheet-list.module';
import { TimeSheetManageModule } from './timesheet/manage/timesheet-manage.module';
import { Lotto1Module } from './lotto/lotto1/lotto1.module';
import { SummaryPreCheckPointModule } from './guard/summaryPrecheckpoint/summaryPrecheckpoint.module';
import { TimesheetMasterModule } from './setting/timesheetMaster/timesheetMaster.module';
import { CustomerWorkingHistoryModule } from './customer/working-history/working-history.module';
import { CustomerReportLineOAModule } from './customer-report-line-oa/customer-report-line-oa.module';

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
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    CompanyModule,
    DepartmentModule,
    PositionModule,
    MasterDataModule,
    ProductCategoryModule,
    StockModule,
    EmployeeModule,
    EmployeeViewModule,
    EmployeeAddModule,
    EmployeeEditModule,
    CustomerModule,
    CustomerAddModule,
    CustomerViewModule,
    CustomerEditModule,
    PasttimeCheckpointModule,
    ReportPasttimeCheckpointModule,
    PasttimePaymentModule,
    WorkScheduleModule,
    ReportSlipModule,
    CheckTransferPayModule,
    CalendarHolidayModule,
    OutsiderModule,
    ShareModule,
    GuardCheckPointModule,
    ComparisonModule,
    ComparisonRecheckModule,
    ComplaintModule,
    InspectionModule,
    ComparisonAuditModule,
    CustomerAuditModule,
    CustomerAuditManageModule,
    RentHouseModule,
    InsuranceModule,
    PickStockModule,
    RentHouseManageModule,
    ContractAuditModule,
    DocumentModule,
    GuardNotWorkModule,
    AdvMoneyModule,
    AdvMoneyManageModule,
    AdvMoneyAllModule,
    CustomerSeqModule,
    AdvTransferPayModule,
    ComparisonAdvModule,
    PreCheckPointModule,
    LogoSignatureModule,
    EmployeeWorkHistoryModule,
    LeaveModule,
    ProjectSettingModule,
    CustomerProjectModule,
    MoneySummaryModule,
    SetUpLeaveModule,
    ResetPasswordModule,
    TimeSheetListModule,
    TimeSheetManageModule,
    //Lotto
    Lotto1Module,
    SummaryPreCheckPointModule,
    TimesheetMasterModule,
    CustomerWorkingHistoryModule,
    CustomerReportLineOAModule
  ],
  providers: [Constant,ConfirmationGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
