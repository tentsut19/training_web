import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CompanyService, EmployeeService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-advMoney',
  templateUrl: './advMoney.component.html',
  styleUrls: ['./advMoney.component.css']
})
export class AdvMoneyComponent implements OnInit { 

  masterDataCategory = [];
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  masterDataList = [];
  employeeList = [];

  constructor(
    private masterDataService: MasterDataService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
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
    this.getEmployeeAllActive();
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

  getMasterDataActive(){
    this.masterDataService.getMasterDataCategory().subscribe(res=>{
        //console.log(res);
        this.masterDataCategory = res;
    });
  }

  search(param){
    console.log(param);
    $('#master_data_table').DataTable().clear().destroy();
    this.masterDataService.searchMasterData(param).subscribe(res=>{
      //console.log(res);
      this.masterDataList = res;
      setTimeout(() => {
        $('#master_data_table').DataTable({
        });
      }, 100);
    });
  }

  addMasterData(value){
    console.log(value);
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    this.masterDataService.addMasterData(value).subscribe(res=>{
      $('#modal-masterData-add').modal('hide');
      this.successDialog();
      this.search(this.searchForm.value);
      this.submitted_add = false;
      this.getMasterDataActive();
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
