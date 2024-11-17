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
  selector: 'app-lotto1',
  templateUrl: './lotto1.component.html',
  styleUrls: ['./lotto1.component.css']
})
export class Lotto1Component implements OnInit { 
 
  tisToken: any = null;
  data: any = [];

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
   }

  ngOnInit() {
    //check redirect
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
    if(this.tisToken.id != 2 
      && this.tisToken.id != 45 
      && this.tisToken.id != 2925 
      && this.tisToken.id != 2018){
      let url = this.constant.WEB_URL + "/timesheet/manage/"+this.tisToken.id;
      window.location.href = url;
    }
    this.data = [
      {round:'01-01-2024', result: '123456'},
      {round:'01-01-2024', result: '123456'},
      {round:'01-01-2024', result: '123456'},
      {round:'01-01-2024', result: '123456'},
      {round:'01-01-2024', result: '123456'}
    ]
  }
  
  getValueLottoPosition(position : number, value: string){
    return value.charAt(position);
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
