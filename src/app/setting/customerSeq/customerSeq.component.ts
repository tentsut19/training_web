import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CompanyService, CustomerService, EmployeeService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerSeqService } from 'src/app/shared/service/customerSeq.service';
@Component({
  selector: 'app-customerSeq',
  templateUrl: './customerSeq.component.html',
  styleUrls: ['./customerSeq.component.css']
})
export class CustomerSeqComponent implements OnInit { 

  masterDataCategory = [];
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  masterDataList = [];
  employeeList = [];
  customerList = [];
  input;
  addressDetail;
  customerSeqId;
  customerSeqList = [];
  currentPosition = 0;

  constructor(
    private masterDataService: MasterDataService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private customerSeqService: CustomerSeqService,
    private fb: FormBuilder,) { 
      this.searchForm = fb.group({
        'category': ['']
      });
      this.addForm = fb.group({
        'category': ['', Validators.required],
        'code': ['', Validators.required],
        'data_value': ['', Validators.required],
        'description': ['']
      });
      this.editForm = fb.group({
        'category': ['', Validators.required],
        'code': ['', Validators.required],
        'data_value': ['', Validators.required],
        'description': [''],
        'id': ['', Validators.required],
      });
   }

  ngOnInit() {
    //this.getMasterDataActive();
    //this.search(this.searchForm.value);
    //this.getEmployeeAllActive();
    this.searchCustomer();
    this.getAllCustomerSeq();
  }

  getEmployeeAllActive(){
    this.spinner.show();
    console.log('getEmployeeAllActive');
    $('#employee_data_table').DataTable().clear().destroy(); 
    this.employeeService.getEmployeeAllActive().subscribe(res=>{
      this.employeeList = res;
      //console.log(this.employeeList);
      this.spinner.hide();
      setTimeout(() => {
        $('#employee_data_table').DataTable({
        });
      }, 100);
    });
  }

  openCustomerModal(position){
    this.currentPosition = position;
    $('#modal-add-customer').modal('show');
  }

  removeCustomer(position){
    this.currentPosition = position;
    this.customerSeqList.splice(this.currentPosition,1);
    let count = 0;
    this.customerSeqList.forEach(item => {
      item.seq = count*2;
      count++;
    });
    console.log(this.customerSeqList);
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
 
  selectCustomer(item){
    console.log(item);
    console.log(this.currentPosition);
    this.customerSeqList.push({
      customer_id: item.id,
      name: item.name,
      seq: this.currentPosition==-1? this.customerSeqList.length*2 :this.customerSeqList[this.currentPosition].seq+1
    });
    console.log(this.customerSeqList);
    this.customerSeqList = this.customerSeqList.sort((a,b) => a.seq - b.seq);
    console.log(this.customerSeqList);
    let count = 0;
    this.customerSeqList.forEach(item => {
      item.seq = count*2;
      count++;
    });
    console.log(this.customerSeqList);
    $('#modal-add-customer').modal('hide');
  }

  getAllCustomerSeq(){
    this.customerSeqList = [];
    this.customerSeqService.getAllCustomerSeq().subscribe(res=>{
      console.log(res);
      if(res){
        let count = 0;
        res.forEach(item => {
            this.customerSeqList.push({
              customer_id: item.customer_id,
              name: item.name,
              seq: count*2
            });
            count++;
        });
        console.log(this.customerSeqList);
      }
    });
  }

  saveCustomerSeq(){
    let request = {customerList: this.customerSeqList};
    this.customerSeqService.create(request).subscribe(res=>{
      this.successDialog();
      setTimeout(() => {location.reload();}, 500);
    }, error => {
      console.error(error);
      this.failDialog(error);
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
