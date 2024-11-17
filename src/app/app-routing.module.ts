import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyComponent } from './setting/company/company.component';
import { DepartmentComponent } from './setting/department/department.component';
import { PositionComponent } from './setting/position/position.component';
import { MasterDataComponent } from './setting/masterData/masterData.component';
import { ProductCategoryComponent } from './stock/productCategory/productCategory.component';
import { StockComponent } from './stock/stock.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeAddComponent } from './employee/add/employee_add.component';
import { EmployeeViewComponent } from './employee/view/employee_view.component';
import { EmployeeEditComponent } from './employee/edit/employee_edit.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerAddComponent } from './customer/add/customer_add.component';
import { CustomerViewComponent } from './customer/view/customer_view.component';
import { CustomerEditComponent } from './customer/edit/customer_edit.component';
import { PasttimeCheckpointComponent } from './guard/pasttime/checkpoint/pasttimeCheckpoint.component';
import { ReportPasttimeCheckpointComponent } from './report/guard/pasttime/checkpoint/reportPasttimeCheckpoint.component';
import { PasttimePaymentComponent } from './guard/pasttime/payment/pasttimePayment.component';
import { WorkScheduleComponent } from './guard/permanent/workSchedule/workSchedule.component';
import { ReportSlipComponent } from './report/slip/reportSlip.component';
import { CheckTransferPayComponent } from './checktransferpay/checktransferpay.component';
import { CalendarHolidayComponent } from './setting/calendar/calendar.component';
import { OutsiderComponent } from './outsider/outsider.component';
import { ShareComponent } from './share/share.component';
import { GuardCheckPointComponent } from './guard/permanent/guardCheckPoint/guardCheckPoint.component';
import { ComparisonComponent } from './report/comparison/comparison.component';
import { ComparisonRecheckComponent } from './report/comparisonRecheck/comparisonRecheck.component';
import { ComparisonAuditComponent } from './report/comparisonAudit/comparisonAudit.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { InspectionComponent } from './setting/inspection/inspection.component';
import { CustomerAuditComponent } from './setting/customerAudit/customerAudit.component';
import { CustomerAuditManageComponent } from './setting/customerAudit/customerAuditMange/customerAuditManage.component';
import { RentHouseComponent } from './setting/rentHouse/rentHouse.component';
import { InsuranceComponent } from './setting/insurance/insurance.component';
import { PickStockComponent } from './stock/pickStock/pickStock.component';
import { RentHouseManageComponent } from './setting/rentHouse/rentHouseManange/rentHouseManage.component';
import { DocumentComponent } from './document/document.component';
import { ContractAuditComponent } from './setting/contractAudit/contract-audit.component';
import { SetUpLeaveComponent } from './setting/setUpLeave/setUpLeave.component';
import { GuardNotWorkComponent } from './report/guardNotWork/guardNotWork.component';
import { AdvMoneyComponent } from './setting/advMoney/advMoney.component';
import { AdvMoneyManageComponent } from './setting/advMoneyManage/advMoneyManage.component';
import { AdvMoneyAllComponent } from './setting/advMoneyAll/advMoneyAll.component';
import { CustomerSeqComponent } from './setting/customerSeq/customerSeq.component';
import { AdvTransferPayComponent } from './report/advTransferPay/advTransferPay.component';
import { ComparisonAdvComponent } from './report/comparisonAdv/comparisonAdv.component';
import { PreCheckPointComponent } from './precheckpoint/precheckpoint.component';
import { LogoSignatureComponent } from './setting/logoSignature/logoSignature.component';
import { EmployeeWorkHistoryComponent } from './employee/work_history/work_history.component';
import { LeaveComponent } from './employee/leave/leave.component';
import { ConfirmationGuard } from './shared/guard/confirmation.guard';
import { ProjectSettingComponent } from './setting/project/project.component';
import { CustomerProjectComponent } from './customer/customer-project/customer-project.component';
import { MoneySummaryComponent } from './report/money-summary/money-summary.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TimeSheetListComponent } from './timesheet/list/timesheet-list.component';
import { TimeSheetManageComponent } from './timesheet/manage/timesheet-manage.component';
import { Lotto1Component } from './lotto/lotto1/lotto1.component';
import { SummaryPreCheckPointComponent } from './guard/summaryPrecheckpoint/summaryPrecheckpoint.component';
import { TimesheetMasterComponent } from './setting/timesheetMaster/timesheetMaster.component';
import { CustomerWorkingHistoryComponent } from './customer/working-history/working-history.component';
import { CustomerReportLineOAComponent } from './customer-report-line-oa/customer-report-line-oa.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/company',
    component: CompanyComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/department',
    component: DepartmentComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/position',
    component: PositionComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/master-data',
    component: MasterDataComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/calendar/holiday',
    component: CalendarHolidayComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/inspection',
    component: InspectionComponent
    //,canActivate: [NeedAuthGuard]
  }, 
  {
    path: 'setting/customer-audit',
    component: CustomerAuditComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/customer-audit/manage/:id',
    component: CustomerAuditManageComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/rent-house',
    component: RentHouseComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/rent-house/manage/:id',
    component: RentHouseManageComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/insurance',
    component: InsuranceComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/advmoney',
    component: AdvMoneyComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/advmoney/manage/:empId',
    component: AdvMoneyManageComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/advmoneyAll',
    component: AdvMoneyAllComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/customer-seq',
    component: CustomerSeqComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/logo-signature',
    component: LogoSignatureComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/project',
    component: ProjectSettingComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'stock/category',
    component: ProductCategoryComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'stock',
    component: StockComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'stock/pick-stock',
    component: PickStockComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'employee',
    component: EmployeeComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'employee/add',
    component: EmployeeAddComponent
    //,canActivate: [NeedAuthGuard]
    ,canDeactivate: [ConfirmationGuard] 
  },
  {
    path: 'employee/view/:id',
    component: EmployeeViewComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'employee/edit/:id',
    component: EmployeeEditComponent
    //,canActivate: [NeedAuthGuard]
    ,canDeactivate: [ConfirmationGuard] 
  },
  {
    path: 'employee/work-history',
    component: EmployeeWorkHistoryComponent
    //,canActivate: [NeedAuthGuard]
    ,canDeactivate: [ConfirmationGuard] 
  },
  {
    path: 'employee/leave',
    component: LeaveComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'customer',
    component: CustomerComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'customer/add',
    component: CustomerAddComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'customer/:id/:display',
    component: CustomerAddComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'customer/project',
    component: CustomerProjectComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'customer-working-history/:id',
    component: CustomerWorkingHistoryComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'guard/pasttime/checkpoint',
    component: PasttimeCheckpointComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'report/guard/pasttime/checkpoint',
    component: ReportPasttimeCheckpointComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'guard/pasttime/payment',
    component: PasttimePaymentComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'guard/permanent/shcedule',
    component: WorkScheduleComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'guard/notwork',
    component: GuardNotWorkComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'guard/permanent/checkPoint',
    component: GuardCheckPointComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'guard/permanent/pre-checkPoint',
    component: PreCheckPointComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'guard/permanent/summary-pre-checkPoint',
    component: SummaryPreCheckPointComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'report/slip',
    component: ReportSlipComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'report/comparison',
    component: ComparisonComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'report/comparisonAudit',
    component: ComparisonAuditComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'report/comparisonAdv',
    component: ComparisonAdvComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'report/comparisonRecheck',
    component: ComparisonRecheckComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'report/adv-transfer-pay',
    component: AdvTransferPayComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'report/money-summary',
    component: MoneySummaryComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'check-transfer-pay',
    component: CheckTransferPayComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'outsider',
    component: OutsiderComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'share',
    component: ShareComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'complaint',
    component: ComplaintComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'document',
    component: DocumentComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/contract-audit',
    component: ContractAuditComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/set-up-leave',
    component: SetUpLeaveComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'setting/timesheet-master-data',
    component: TimesheetMasterComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
    //,canActivate: [NeedAuthGuard]
  },
  {
    path: 'timesheet/list',
    component: TimeSheetListComponent
    //,canActivate: [NeedAuthGuard]
    //,canDeactivate: [ConfirmationGuard] 
  },
  {
    path: 'timesheet/manage/:id',
    component: TimeSheetManageComponent
    //,canActivate: [NeedAuthGuard]
    //,canDeactivate: [ConfirmationGuard] 
  },
  {
    path: 'lotto/lotto1',
    component: Lotto1Component
    //,canActivate: [NeedAuthGuard]
    //,canDeactivate: [ConfirmationGuard] 
  },
  {
    path: 'customer-report-line-oa',
    component: CustomerReportLineOAComponent
    //,canActivate: [NeedAuthGuard]
    //,canDeactivate: [ConfirmationGuard] 
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
