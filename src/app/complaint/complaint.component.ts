import { Component, OnInit, ViewChild } from '@angular/core';
import { PositionService, CustomerService } from 'src/app/shared';
import { CompanyService, ReportService, EmployeeService, ComplaintService } from 'src/app/shared';
import { Constant } from '../shared/constant';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  positionList = [];
  companyList = [];
  customerList = [];
  addForm: FormGroup;
  submitted_add = false;
  editForm: FormGroup;
  complaintForm: FormGroup
  submitted_edit = false;
  currentcustomerId;
  customer;
  input;
  addressDetail;

  public customerCompanyCtrl: FormControl = new FormControl();
  public customerCompanyFilterCtrl: FormControl = new FormControl();
  public filteredCustomerCompanyList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  public employeeCtrl: FormControl = new FormControl();
  public employeeFilterCtrl: FormControl = new FormControl();
  public filteredEmployeeList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyEmployee = new Subject<void>();

  constructor(
    private positionService: PositionService,
    private fb: FormBuilder,
    private constant: Constant,
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private complaintService: ComplaintService,
    private customerService: CustomerService
    ) { 
      this.complaintForm = fb.group({
        'id': [''],
        'record_story': [''],
        'complaint_type': ['0'],
        'status': ['0'],
        'conclusion': [''],
        'employee_id': ['', Validators.required],
        'customer_id': ['', Validators.required]
      });

    }

  ngOnInit() {
    this.formDataCustomerCompany = new FormGroup({
      valueSelect: new FormControl("")
    });
    this.formDataEmployee = new FormGroup({
      valueSelect: new FormControl("")
    });
    this.search()
    this.getAllForDropDown()
    this.getAllForDropDownEmployee()
  } 

  changeCustomer(data){
    console.log(data);
    this.complaintForm.patchValue({
      customer_id: data.id,
    })
  }

  changeEmployee(data){
    console.log(data);
    this.complaintForm.patchValue({
      employee_id: data.id,
    })
  }

  customerCompanyList = [];
  protected filterWorkSaleSurveys() {
    if (!this.customerCompanyList) {
      return;
    }
    // get the search keyword
    let search = this.customerCompanyFilterCtrl.value;
    if (!search) {
      this.filteredCustomerCompanyList.next(this.customerCompanyList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCustomerCompanyList.next(
      this.customerCompanyList.filter(x => (x.name_main+" | "+x.name).toLowerCase().indexOf(search) > -1)
    );
  }

  formDataCustomerCompany: FormGroup;
  isShowCustomerCompany = false;
  getAllForDropDown(){
    this.spinner.show();
    this.customerService.getCustomerForDropDown().subscribe(datas=>{
      console.log(datas);

      datas.forEach(data => {
        this.customerCompanyList.push(data);
      });

      // load the initial bank list
      this.filteredCustomerCompanyList.next(this.customerCompanyList.slice());

      // listen for search field value changes
      this.customerCompanyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterWorkSaleSurveys();
      });

      setTimeout(() => {
        this.isShowCustomerCompany = true;

        this.formDataCustomerCompany
        .get("valueSelect")
        .setValue(0);

        this.spinner.hide();
      }, 100);

    }, err => {
      this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  employeeList = [];
  protected filterEmployee() {
    if (!this.employeeList) {
      return;
    }
    // get the search keyword
    let search = this.employeeFilterCtrl.value;
    if (!search) {
      this.filteredEmployeeList.next(this.employeeList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredEmployeeList.next(
      this.employeeList.filter(x => (x.first_name+" "+x.last_name).toLowerCase().indexOf(search) > -1)
    );
  }

  formDataEmployee: FormGroup;
  isShowEmployee = false;
  getAllForDropDownEmployee(){
    this.spinner.show();
    this.employeeService.getEmployee().subscribe(datas=>{
      console.log(datas);

      this.employeeList = datas

      // load the initial bank list
      this.filteredEmployeeList.next(this.employeeList.slice());

      // listen for search field value changes
      this.employeeFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyEmployee))
        .subscribe(() => {
          this.filterEmployee();
      });

      setTimeout(() => {
        this.isShowEmployee = true;

        this.formDataEmployee
        .get("valueSelect")
        .setValue(0);

        this.spinner.hide();
      }, 100);

    }, err => {
      this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  isAdd = false;
  openComplaint(){
    this.complaintForm.patchValue({
      record_story: "",
      complaint_type: "0",
      status: "0",
      conclusion: "",
      employee_id: "",
      customer_id: "",
    })
    this.isAdd = true
  }

  closeComplaint(){
    this.isAdd = false
  }

  edit(id){
    this.spinner.show();
    this.complaintService.getById(id).subscribe(data => {
      console.log(data)
      this.complaintForm.patchValue({
        id: data.id,
        record_story: data.record_story,
        complaint_type: data.complaint_type,
        status: data.status,
        conclusion: data.conclusion,
        employee_id: data.employee_id,
        customer_id: data.customer_id,
      })

      var customer = {id:data.customer_id}
      var employee = {id:data.employee_id}

      this.formDataCustomerCompany.patchValue({
        valueSelect:customer
      })
      this.formDataEmployee.patchValue({
        valueSelect:employee
      })

      this.isAdd = true
      this.spinner.hide()
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog('');
    });
  }

  submitComplaint(){
    console.log(this.complaintForm.value);
    this.submitted_add = true;
    if(this.complaintForm.invalid){
      return;
    }
    this.complaintForm.patchValue({
      status: "0",
    })
    this.spinner.show();
    this.complaintService.add(this.complaintForm.value).subscribe(data => {
      this.successDialog()
      this.isAdd = false
      this.spinner.hide()
      this.search()
      this.sendNotifyComplaint()
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog('');
    });
  }

  submitCloseComplaint(){
    console.log(this.complaintForm.value);
    this.submitted_add = true;
    if(this.complaintForm.invalid){
      return;
    }
    this.complaintForm.patchValue({
      status: "1",
    })
    this.spinner.show();
    this.complaintService.add(this.complaintForm.value).subscribe(data => {
      this.successDialog()
      this.isAdd = false
      this.spinner.hide()
      this.search()
      this.sendNotifyComplaint()
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog('');
    });
  }

  sendNotifyComplaint(){
    this.complaintService.sendNotify(this.complaintForm.value).subscribe(data => {
      console.log(data)
    }, error => {
      console.error(error);
    });
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

  search(){
    this.spinner.show();
    this.customerList = [];
    $("#customer_table").DataTable().clear().destroy();
    const params = this.getRequestParams();
    this.complaintService.get().subscribe(data => {
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

  currentId;
  delete(id){
    this.currentId = id;
    $('#modal-remove').modal('show');
  }

  deleteProcess(){
    console.log(this.currentId);
    this.complaintService.delete(this.currentId).subscribe(data => {
      $('#modal-remove').modal('hide');
      this.successDialog();
      this.search();
    })
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
