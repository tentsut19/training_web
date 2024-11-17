import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService, MasterDataService, CommonService, StockService } from '../../../shared';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-audit-manage',
  templateUrl: './customerAuditManage.component.html',
  styleUrls: ['./customerAuditManage.component.css']
})
export class CustomerAuditManageComponent implements OnInit {
  customerId;
  customer;
  dayList;
  monthList;
  yearList;
  hourList;
  minList;
  isInsurance = false
  editForm: FormGroup;
  searchForm: FormGroup;
  customerAuditConfig;
  scheduleModel = {
    customer_id:0,
    position: []
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private stockService: StockService,
    private commonService: CommonService,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { 
    this.editForm = fb.group({
      'id': [0, Validators.required],
      'name': ['', Validators.required],
      'mobile': ['', Validators.required],
      'fax': [''],
      'website': [''],
      'email': ['', Validators.required],
      'wage': [0.00, Validators.required],
      'ot': [0.00, Validators.required],
      //'wageh': [0.00],
      //'oth': [0.00],
      'is_audit': [false],
      'work_holiday_normal_wage': [0],
      'work_holiday_holiday_wage': [0],
      'work_holiday_ot': [0.00],
      'not_work_holiday_holiday_wage': [0],
      'not_work_holiday_next_wage': [0],
      'not_work_holiday_next_off_wage': [0],
      'not_work_holiday_next_ot': [0.00]
    });
    this.searchForm = fb.group({
      'month':1,
      'year': [new Date().getFullYear()],
      'customerId': [''],
    });
  }

  ngOnInit() { 
    this.activatedRoute.params.forEach((urlParams) => {
      this.customerId = urlParams['id'].replace('#', '');
      console.log("customerId : "+this.customerId);
      this.getCustomer(this.customerId);
      this.getCustomerAuditConfig(this.customerId);
    });
    this.generateYearList();
    this.initDayList();
  } 

  ngAfterViewInit(){

  }

  generateYearList(){
    this.yearList = [];
    let currentYear = new Date().getFullYear();
    //console.log('currentYear : ' + currentYear);
    //generate next 3 year
    for(let i=0;i<5;i++){
      let year = 
      {
        'enYear':currentYear-i,
        'thYear':(currentYear-i) + 543
      };
      this.yearList.push(year);
    }
  }

  initDayList(){
    this.dayList = [];
    
    for(let i=1;i<=31;i++){
      this.dayList.push({value:i,status:'W'});
    }
    //console.log(this.checkPointModel);
  } 

  getCustomerAuditConfig(customerId){
    this.customerService.getCustomerAuditConfigByCustomerId(customerId).subscribe(res=>{
      this.customerAuditConfig = res;
      console.log(this.customerAuditConfig);
      this.editForm.patchValue({
        wage: this.customerAuditConfig.wage,
        ot: this.customerAuditConfig.ot,
        is_audit: this.customerAuditConfig.is_audit,
        work_holiday_normal_wage: this.customerAuditConfig["work_holiday_normal_wage"],
        work_holiday_holiday_wage: this.customerAuditConfig["work_holiday_holiday_wage"],
        work_holiday_ot: this.customerAuditConfig["work_holiday_ot"],
        not_work_holiday_holiday_wage: this.customerAuditConfig["not_work_holiday_holiday_wage"],
        not_work_holiday_next_wage: this.customerAuditConfig["not_work_holiday_next_wage"],
        not_work_holiday_next_off_wage: this.customerAuditConfig["not_work_holiday_next_off_wage"],
        not_work_holiday_next_ot: this.customerAuditConfig["not_work_holiday_next_ot"]
      });
    });
  }
 
  getCustomer(customerId){
    this.customerService.getCustomerById(customerId).subscribe(data => {
      console.log(data); 
      this.customer = data;
      this.editForm.patchValue({
        name: data["name"],
        mobile: data["mobile"],
        fax: data["fax"],
        website: data["website"],
        email: data["email"],
        id: data["id"]
      });
      //this.editForm.disable();
    });
  }

  submitted_edit = false;
  saveCustomerAudit(data){
    let value = data;
    console.log(value);
    if(value['is_audit'] === undefined){
      value['is_audit'] = false;
    }
    if(value['work_holiday_normal_wage'] === undefined){
      value['work_holiday_normal_wage'] = 0;
    }
    if(value['work_holiday_ot'] === undefined){
      value['work_holiday_ot'] = 0;
    }
    if(value['work_holiday_holiday_wage'] === undefined){
      value['work_holiday_holiday_wage'] = 0;
    }
    if(value['not_work_holiday_holiday_wage'] === undefined){
      value['not_work_holiday_holiday_wage'] = 0;
    }
    if(value['not_work_holiday_next_off_wage'] === undefined){
      value['not_work_holiday_next_off_wage'] = 0;
    }
    if(value['not_work_holiday_next_ot'] === undefined){
      value['not_work_holiday_next_ot'] = 0;
    }
    if(value['not_work_holiday_next_wage'] === undefined){
      value['not_work_holiday_next_wage'] = 0;
    }

    if(!value['is_audit']){
      value['wage'] = 0;
      value['ot'] = 0;
    }else{
      this.submitted_edit = true;
      if(this.editForm.invalid){
        return;
      }
    } 
    this.customerService.addCustomerAuditConfig(this.editForm.value).subscribe(res=>{
      this.successDialog();
    });
  }

  search(){
    this.spinner.show();
    console.log('search schedule')
    this.scheduleModel = {
      customer_id:this.customerId,
      position: []
    };
    let request = {
      'month':this.searchForm.get('month').value,
      'year':this.searchForm.get('year').value,
      'customer_id':this.customerId
    };
    console.log(request);
    this.customerService.searchSchedule(request).subscribe(res=>{
      console.log(res);
      if(res.data==null){
        for(let i=0;i<this.customer.customerCreditLimit.length;i++){
          for(let j=0;j<this.customer.customerCreditLimit[i].quantity;j++){
            let tmpDay = JSON.stringify(this.dayList);
            let position = {
              type:'FIX',
              name:this.customer.customerCreditLimit[i].data_value+ " " +this.customer.customerCreditLimit[i].moment,
              day:JSON.parse(tmpDay)}
            this.scheduleModel.position.push(position);
          }
        }
      }else{
        this.scheduleModel = JSON.parse(res.data.json_data);
      }
      console.log(this.scheduleModel)
      this.spinner.hide();
    });
  }

  addPostion(){
    let tmpDay = JSON.stringify(this.dayList);
    let position = {
        type: 'NEW',
        name: '',
        day: JSON.parse(tmpDay)
    }
    this.scheduleModel.position.push(position);
  }

  saveUpdateSchedule(){
    let request = {
      'month':this.searchForm.get('month').value,
      'year':this.searchForm.get('year').value,
      'customer_id':this.customerId,
      'json_data':JSON.stringify(this.scheduleModel)
    };
    this.customerService.saveUpdateSchedule(request).subscribe(res=>{
      this.search();
    });
  }
  
  trigCheckBoxWork(i,j){
    let currentValue = this.scheduleModel.position[i].day[j].status;
    if(currentValue=='W'){
      currentValue = 'O';
    }else{
      currentValue = 'W';
    }
    this.scheduleModel.position[i].day[j].status = currentValue;
  }

  reload(){
    location.reload()
  }

  successDialog(){
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
    setTimeout(() => {location.reload();}, 1000);
  }

  failDialog(msg){
    Swal.fire({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: msg
    })
  }

}
