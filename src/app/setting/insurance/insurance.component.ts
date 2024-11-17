import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'ng2-org-chart/src/employee';
import {  CommonService, InsuranceService} from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  insuranceList = [];
  currentInsuranceId = 0;

  constructor(
    private insuranceService: InsuranceService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    ) { 
      this.searchForm = fb.group({
        'year': [new Date().getFullYear()]
      });
      this.addForm = fb.group({
        'employee_id': ['', Validators.required],
        'total_installment_money': ['', Validators.required],
        'total_installment': ['', Validators.required],
        'paid_per_installment': ['', Validators.required],
      });
      this.editForm = fb.group({
        'id': ['', Validators.required],
        'employee_id': ['', Validators.required],
        'total_installment_money': ['', Validators.required],
        'total_installment': ['', Validators.required],
        'paid_per_installment': ['', Validators.required],
        'paid_installment': [''],
        'remain_installment': [''],
        'paid_installment_money': [''],
        'remain_installment_money': ['']
      });
  }

  ngOnInit() {
     this.search();
  } 
 
  search(){
    $("#insurance_table").DataTable().clear().destroy();
    this.insuranceList = [];
    let param = {};
    this.insuranceService.search(param).subscribe(data=>{
      this.insuranceList = data;
      console.log(this.insuranceList);
      setTimeout(() => {
        $('#insurance_table').DataTable({
        });
      }, 10);
    })
  }

  installmentAddChanged(){
    let paidPerInstallment = 0.00;
    let totalInstallmentMoney = this.addForm.value['total_installment_money']
    let totalInstallment = this.addForm.value['total_installment']
    paidPerInstallment = totalInstallmentMoney/totalInstallment
    this.addForm.patchValue({
      paid_per_installment: paidPerInstallment.toFixed(2)
    })
  }

  addInsurance(value){
    console.log(value)
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    this.spinner.show();
    console.log(value);
    this.insuranceService.addInsurance(value).subscribe(res=>{
      $('#modal-insurance-add').modal('hide');
      this.successDialog();
      this.search();
    }, err => {
      this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  edit(id){
    console.log(id);
    this.insuranceService.getInsuranceById(id).subscribe(res=>{
      console.log(res);
      this.editForm.patchValue({
        id: res.id,
        employee_id:res.employee_id,
        total_installment_money:res.total_installment_money,
        total_installment:res.total_installment,
        paid_per_installment:res.paid_per_installment,
        paid_installment:res.paid_installment,
        remain_installment:res.remain_installment,
        paid_installment_money:res.paid_installment_money,
        remain_installment_money:res.remain_installment_money
      })
    })
    $('#modal-insurance-edit').modal('show');
  }

  openModalDelete(id){
    this.currentInsuranceId = id;
    $('#modal-insurance-remove').modal('show');
  }

  delete(){

  }

  loadDefaultScript(){
    $('#calendar_holiday_table').DataTable();
  }

  successDialog(){
    Swal.fire({
      type: 'success',
      title: '',
      text: "ทำรายการสำเร็จ",
      timer: 1500
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
