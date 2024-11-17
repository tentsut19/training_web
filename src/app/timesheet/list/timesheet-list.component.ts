import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CommonService, CompanyService, Constant, DepartmentService, EmployeeService, PositionService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdvMoneyService } from 'src/app/shared/service/advMoney.service';
import * as XLSX from 'xlsx';
import { TimesheetService } from 'src/app/shared/service/timesheet.service';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.css']
})
export class TimeSheetListComponent implements OnInit { 

  searchForm: FormGroup;
  submitted_search = false;
  startDate;
  startDateStr;
  endDate;
  endDateStr;
  optionleDate: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: false
  }; 
  departmentList?: Array<any> = [];
  positionList?: Array<any> = [];
  dataList?: Array<any> = [];
  diffDay = 0;
  tisToken: any = null;

  constructor(
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private commonService: CommonService,
    private timesheetService: TimesheetService,
    private constant: Constant
    ) { 
      this.searchForm = fb.group({
        'department_id': [''],
        'position_id': [''],
        'value1': [''],
      });
   }

  ngOnInit() {
    //check redirect
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
    if(!this.constant.APPROVER_TIMESHEET){
      let url = this.constant.WEB_URL + "/timesheet/manage/"+this.tisToken.id;
      window.location.href = url;
    }
    //initail date
    this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.endDate = new Date();

    this.getDepartment();
    this.getPosition();
  }
 

  search(){
    $("#table_summary_timesheet").DataTable().clear().destroy();
    let criteria = {
        ...this.searchForm.value,
        startDate: this.startDate ? this.convertToDateSearch(this.startDate) : null,
        endDate:this.endDate ? this.convertToDateSearch(this.endDate) : null
      }
    console.log(criteria);
    this.spinner.show();
    this.timesheetService.searchByCriteria_V2(criteria).subscribe(res=>{
      //console.log(res);
      this.dataList = res.data;
      this.spinner.hide();
      //Re Cal Diff Date
      this.diffDay = this.startDate.getTime() - this.endDate.getTime();
      this.diffDay = this.diffDay / (1000 * 3600 * 24);
      this.diffDay = Math.ceil(Math.abs(this.diffDay));
      //Refresh table
      setTimeout(() => {
        this.spinner.hide();
        $('#table_summary_timesheet').DataTable({
        });
      }, 100);
    });
  }

  getDepartment(){
    this.departmentService.getDepartment().subscribe(data=>{
      console.log(data);
      this.departmentList = data;
    });
  }

  getPosition(){
    this.positionService.getPosition().subscribe(data=>{
      console.log(data);
      this.positionList = data;
    });
  }

  selectedDate(value: any, datepicker?: any) {
    //start date
    this.startDate = value.start._d;
    this.startDateStr = this.getDateStr(this.startDate);
    console.log(this.startDateStr);
    //end date
    this.endDate = value.end._d;
    this.endDateStr = this.getDateStr(this.endDate);
    console.log(this.endDateStr);
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }
 
  convertToDateSearch(date){
    //console.log(date);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  successDialog(){
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
  }

  failDialog(msg){
    Swal.fire({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: msg
    })
  }

}
