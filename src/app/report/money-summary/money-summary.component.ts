import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'ng2-org-chart/src/employee';
import { DepartmentService, CompanyService } from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-money-summary',
  templateUrl: './money-summary.component.html',
  styleUrls: ['./money-summary.component.css']
})
export class MoneySummaryComponent implements OnInit { 

departmentList = new Array();
department = {"name":"","description":""};
searchForm: FormGroup;
editForm: FormGroup;
submitted_add = false;
submitted_edit = false;
currentDepartmentId;
yearList;

  constructor(private fb: FormBuilder,
    private departmentService: DepartmentService,
    private companyService: CompanyService) { 
    this.searchForm = fb.group({
      'month':'1-0',
      'year': [new Date().getFullYear()],
      'customerId': [''],
    });

    this.editForm = fb.group({
      'month':'1-0',
      'year': [new Date().getFullYear()],
      'customerId': [''],
    });

  }

  ngOnInit() { 
    //this.getAllDepartment();
    //this.getAllCompany();
    this.generateYearList();
    setTimeout(() => {
      $('#department_table').DataTable({
      });
    }, 10);
  }  

  generateYearList(){
    this.yearList = [];
    let currentYear = new Date().getFullYear();
    console.log('currentYear : ' + currentYear);
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

  loadDefaultScript(){
    $('#department_table').DataTable();
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
