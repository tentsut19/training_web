import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { EmployeeService, MasterDataService, UploadFilesService, CommonService, CompanyService, 
  DepartmentService, PositionService, FileManagerService, BadHistoryService, ReasonLeaveWorkService ,
  RemarkEmployeeService, RecommenderService, CostEquipmentService } from '../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  
  constructor(
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private httpService: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  passwordOld
  passwordNew
  passwordNewConfirm
  personnel
  ngOnInit() {
    this.passwordOldType = 'password';
    this.passwordNewType = 'password';
    this.passwordNewConfirmType = 'password';
    this.personnel = JSON.parse(localStorage.getItem('tisToken'));

  } 

  ngAfterViewInit(){
    
  }

  passwordOldType
  passwordOldShow = false;
  togglePasswordOldShow(){
    if (this.passwordOldType === 'password') {
      this.passwordOldType = 'text';
      this.passwordOldShow = true;
    } else {
      this.passwordOldType = 'password';
      this.passwordOldShow = false;
    }
  }

  passwordNewType
  passwordNewShow = false;
  togglePasswordNewShow(){
    if (this.passwordNewType === 'password') {
      this.passwordNewType = 'text';
      this.passwordNewShow = true;
    } else {
      this.passwordNewType = 'password';
      this.passwordNewShow = false;
    }
  }

  passwordNewConfirmType
  passwordNewConfirmShow = false;
  togglePasswordNewConfirmShow(){
    if (this.passwordNewConfirmType === 'password') {
      this.passwordNewConfirmType = 'text';
      this.passwordNewConfirmShow = true;
    } else {
      this.passwordNewConfirmType = 'password';
      this.passwordNewConfirmShow = false;
    }
  }

  validatePassword(){
    if(!this.passwordNew){
      this.warningDialog('กรอกรหัสผ่านใหม่');
    }else if(!this.passwordNewConfirm){
      this.warningDialog('กรอกยืนยันรหัสผ่านใหม่');
    }else if(this.passwordNew !== this.passwordNewConfirm){
      this.warningDialog('รหัสผ่านใหม่ไม่ตรงกัน');
      this.passwordNew = "";
      this.passwordNewConfirm = "";
    }else{
      this.spinner.show();
      var req = {
        password: this.passwordOld,
      }
      this.employeeService.verifyPassword(this.personnel.id,req).subscribe(data => {
        console.log(data);
        this.updatePassword();
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog('รหัสผ่านเก่าไม่ถูกต้อง');
      });
    }
  }

  updatePassword(){
    var req = {
      passwordOld: this.passwordOld,
      passwordNew: this.passwordNew,
      passwordNewConfirm: this.passwordNewConfirm,
    }
    this.employeeService.updatePassword(this.personnel.id,req).subscribe(data => {
      console.log(data);
      this.successDialog();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  successDialog(){
    Swal.fire("เปลี่ยนรหัสผ่านเรียบร้อย", "", "success");
  }

  warningDialog(msg){
    Swal.fire({
      type: 'warning',
      confirmButtonText: 'ปิด',
      text: msg
    })
  }

  failDialog(msg){
    Swal.fire({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: msg
    })
  }

}
