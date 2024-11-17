import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-setUpLeave',
  templateUrl: './setUpLeave.component.html',
  styleUrls: ['./setUpLeave.component.css']
})
export class SetUpLeaveComponent implements OnInit {

  //Hr
  fileUploadSignHrObj: any;
  imageSignHrUrl:any = 'https://comvisitor-uat-bucket.s3.ap-southeast-1.amazonaws.com/tis/%E0%B8%88%E0%B8%AD%E0%B8%A2.png';
  //Logo
  fileUploadLogoObj: any;
  imageLogoUrl:any = 'https://comvisitor-uat-bucket.s3.ap-southeast-1.amazonaws.com/images/logo/Logo%E0%B8%90%E0%B8%B2%E0%B8%99%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5.jpg';
  //Finance
  fileUploadSignFnObj: any;
  imageSignFnUrl: any = 'https://comvisitor-uat-bucket.s3.ap-southeast-1.amazonaws.com/tis/images/signature.png';

  addForm: FormGroup;
  submitted_add = false;

  constructor(
    private masterDataService: MasterDataService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,) { 
      this.addForm = fb.group({
        'leaveWorkWorkId': [''],
        'leaveWorkWork': [0, Validators.required],
        'leaveWorkWorkTypeId': [''],
        'leaveWorkWorkType': ['W', Validators.required],
        'sickLeaveId': [''],
        'sickLeave': [0, Validators.required],
        'sickLeaveTypeId': [''],
        'sickLeaveType': ['W', Validators.required],
        'vacationLeaveId': [''],
        'vacationLeave': [0, Validators.required],
        'vacationLeaveTypeId': [''],
        'vacationLeaveType': ['W', Validators.required],
      }); 
  }

  ngOnInit() {
    this.loadMasterData();
  } 

  loadMasterData(){
    this.spinner.show();
    var req = {
      category: 'SET_UP_LEAVE'
    }
    this.masterDataService.searchMasterData(req).subscribe(datas => {
      console.log(datas)
      var leaveWorkWorkId;
      var leaveWorkWork;
      var leaveWorkWorkTypeId;
      var leaveWorkWorkType;
      var sickLeaveId;
      var sickLeave;
      var sickLeaveTypeId;
      var sickLeaveType;
      var vacationLeaveId;
      var vacationLeave;
      var vacationLeaveTypeId;
      var vacationLeaveType;

      datas.forEach(data => {
        if(data["code"]=="LEAVE_WORK_TYPE"){
          leaveWorkWorkTypeId = data["id"]
          leaveWorkWorkType = data["data_value"]
        }
        if(data["code"]=="LEAVE_WORK"){
          leaveWorkWorkId = data["id"]
          leaveWorkWork = data["data_value"]
        }
        if(data["code"]=="SICK_LEAVE_TYPE"){
          sickLeaveTypeId = data["id"]
          sickLeaveType = data["data_value"]
        }
        if(data["code"]=="SICK_LEAVE"){
          sickLeaveId = data["id"]
          sickLeave = data["data_value"]
        }
        if(data["code"]=="VACATION_LEAVE_TYPE"){
          vacationLeaveTypeId = data["id"]
          vacationLeaveType = data["data_value"]
        }
        if(data["code"]=="VACATION_LEAVE"){
          vacationLeaveId = data["id"]
          vacationLeave = data["data_value"]
        }
      });

      this.addForm.patchValue({
        leaveWorkWorkId: leaveWorkWorkId,
        leaveWorkWork: leaveWorkWork,
        leaveWorkWorkTypeId: leaveWorkWorkTypeId,
        leaveWorkWorkType: leaveWorkWorkType,
        sickLeaveId: sickLeaveId,
        sickLeave: sickLeave,
        sickLeaveTypeId: sickLeaveTypeId,
        sickLeaveType: sickLeaveType,
        vacationLeaveId: vacationLeaveId,
        vacationLeave: vacationLeave,
        vacationLeaveTypeId: vacationLeaveTypeId,
        vacationLeaveType: vacationLeaveType,
      });

      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.error(error);
      var error_message = ""
      this.failDialog(error_message);
    });
  }

  save(){
    var masterDataList = [];
    var req = {
      id: this.addForm.value.leaveWorkWorkTypeId,
      category: 'SET_UP_LEAVE',
      code: 'LEAVE_WORK_TYPE',
      data_value: this.addForm.value.leaveWorkWorkType,
      description: 'รูปแบบ ลากิจ',
    }
    masterDataList.push(req);
    var req = {
      id: this.addForm.value.leaveWorkWorkId,
      category: 'SET_UP_LEAVE',
      code: 'LEAVE_WORK',
      data_value: this.addForm.value.leaveWorkWork,
      description: 'จำนวน / ปี ลากิจ',
    }
    masterDataList.push(req);

    var req = {
      id: this.addForm.value.sickLeaveTypeId,
      category: 'SET_UP_LEAVE',
      code: 'SICK_LEAVE_TYPE',
      data_value: this.addForm.value.sickLeaveType,
      description: 'รูปแบบ ลาป่วย',
    }
    masterDataList.push(req);
    var req = {
      id: this.addForm.value.sickLeaveId,
      category: 'SET_UP_LEAVE',
      code: 'SICK_LEAVE',
      data_value: this.addForm.value.sickLeave,
      description: 'จำนวน / ปี ลาป่วย',
    }
    masterDataList.push(req);

    var req = {
      id: this.addForm.value.vacationLeaveTypeId,
      category: 'SET_UP_LEAVE',
      code: 'VACATION_LEAVE_TYPE',
      data_value: this.addForm.value.vacationLeaveType,
      description: 'รูปแบบ ลาพักร้อน',
    }
    masterDataList.push(req);
    var req = {
      id: this.addForm.value.vacationLeaveId,
      category: 'SET_UP_LEAVE',
      code: 'VACATION_LEAVE',
      data_value: this.addForm.value.vacationLeave,
      description: 'จำนวน / ปี ลาพักร้อน',
    }
    masterDataList.push(req);
    console.log(masterDataList);

    var reqList = {
      masterDataList: masterDataList
    }

    this.spinner.show();
    this.masterDataService.addOrUpdateMasterData(reqList).subscribe(data => {
      this.spinner.hide();
      this.successDialog();
    }, error => {
      this.spinner.hide();
      console.error(error);
      var error_message = ""
      this.failDialog(error_message);
    });
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
