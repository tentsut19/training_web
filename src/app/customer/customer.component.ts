import { Component, OnInit } from '@angular/core';
import { PositionService, CustomerService } from 'src/app/shared';
import { CompanyService, ReportService } from 'src/app/shared';
import { Constant } from '../shared/constant';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  positionList = [];
  companyList = [];
  customerList = [];
  addForm: FormGroup;
  submitted_add = false;
  editForm: FormGroup;
  submitted_edit = false;
  currentcustomerId;
  customer;
  input;
  addressDetail;

  constructor(
    private positionService: PositionService,
    private fb: FormBuilder,
    private constant: Constant,
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private companyService: CompanyService,
    private customerService: CustomerService
    ) { 
      this.addForm = fb.group({
        'prefix': ['', Validators.required],
        'personnelCode': ['', Validators.required],
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required],
        'nickName': ['', Validators.required],
        'gender': ['M'],
        'tel': ['', Validators.required],
        'email': ['', Validators.required],
        'password': ['', Validators.required],
        'companyId': ['', Validators.required],
        'positionId': ['', Validators.required]
      });
  
      this.editForm = fb.group({
        'prefix': ['', Validators.required],
        'personnelCode': ['', Validators.required],
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required],
        'nickName': ['', Validators.required],
        'gender': ['M'],
        'tel': ['', Validators.required],
        'email': ['', Validators.required],
        'password': ['', Validators.required],
        'companyId': ['', Validators.required],
        'positionId': ['', Validators.required]
      });

    }

  ngOnInit() {
    this.getAllPosition();
    this.getAllCompany();
    this.searchCustomer();
  } 

  getRequestParams() {
    let params = {};

    if (this.input) {
      params[`input`] = this.input;
    }

    if (this.addressDetail) {
      params[`address_detail`] = this.addressDetail;
    }

    return params;
  }

  searchCustomer(){
    this.spinner.show();
    this.customerList = [];
    $("#customer_table").DataTable().clear().destroy();
    const params = this.getRequestParams();
    this.customerService.searchCustomer(params).subscribe(data => {
        this.customerList = data;
        console.log(this.customerList);

        setTimeout(() => {
          this.spinner.hide();
          $('#customer_table').DataTable({
          });
        }, 100);

      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog('');
      });
  }

  getAllPosition(){
    this.positionList = [];
    this.positionService.getPosition().subscribe(data => {
      this.positionList = data;
    });
  }

  getAllCompany(){
    this.companyList = [];
    this.companyService.getCompany().subscribe(data => {
      this.companyList = data;
    });
  }

  currentId;
  delete(id){
    this.currentId = id;
    $('#modal-remove').modal('show');
  }

  deleteProcess(){
    console.log(this.currentId);
    this.customerService.deleteCustomer(this.currentId).subscribe(data => {
      $('#modal-remove').modal('hide');
      this.successDialog();
      this.searchCustomer();
    })
  }

  isToggleButtonLoadExcel = false
  selectCustomerAll(val){
    console.log(val)
    var i = 0
    this.customerList.forEach(element => {
      element['checked'] = val.currentTarget.checked;
      this.isToggleButtonLoadExcel = val.currentTarget.checked;
      if((this.customerList.length-1) == i){
        this.toggleButtonLoadExcel()
      }
      i++
    });
  }

  selectCustomer(item){
    item.checked = !item.checked;
    this.toggleButtonLoadExcel()
  }

  toggleButtonLoadExcel(){
    this.isToggleButtonLoadExcel = false
    this.customerList.forEach(element => {
      if(element['checked']){
        this.isToggleButtonLoadExcel = true
      }
    });
  }

  customerIdList
  exportExcel(){
    var i = 0
    this.customerIdList = []
    this.customerList.forEach(element => {
      if(element['checked']){
        this.customerIdList.push(element['id'])
      }
      if((this.customerList.length-1) == i){
        this.exportExcelProcess()
      }
      i++
    });
  }
  
  exportExcelProcess(){
    console.log(this.customerIdList)
    var req = {}
    req["customerIdList"] = this.customerIdList
    this.spinner.show();
    this.reportService.genReportCustomerLimit(req).subscribe(resp=>{
      console.log(resp);
      this.spinner.hide();
      setTimeout(() => {
        window.open(resp.url);
      }, 100);
    }, err => {
      this.spinner.hide();
      this.failDialog('');
    });
  }


  getStatus(uuid){
    console.log(uuid);
    this.reportService.getStatus(uuid).subscribe(data=>{
      console.log(data);
      if(data.status == 'SUCCESS'){
        this.spinner.hide();
        setTimeout(() => {
          window.open(this.constant.API_REPORT_ENDPOINT + '/report/customer-limit-excel');
        }, 100);
      }else{
        setTimeout(() => {
          this.getStatus(uuid);
        }, 1000)
      }


      // if(data.length > 0){
      //   if(data.length == 1){
      //     if(data[0].status == 'failUploadFile'){
      //       this.failDialog("เกิดข้อผิดพลาด");
      //       setTimeout(() => {location.reload();}, 500);
      //     }else{
      //       this.setDate(data)
      //     }
      //   }else{
      //     this.setDate(data)
      //   }
      // }else{
      //   setTimeout(() => {
      //     this.getUpdateOrder("Shipping");
      //   }, 5000);
      // }

    },
    err => {
      this.spinner.hide();
      console.log(err);
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
