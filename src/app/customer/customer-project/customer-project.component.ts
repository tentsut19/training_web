import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'ng2-org-chart/src/employee';
import { DepartmentService, CompanyService } from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-customer-project',
  templateUrl: './customer-project.component.html',
  styleUrls: ['./customer-project.component.css']
})
export class CustomerProjectComponent implements OnInit { 

departmentList = new Array();
department = {"name":"","description":""};
addForm: FormGroup;
editForm: FormGroup;
submitted_add = false;
submitted_edit = false;
currentDepartmentId;

  constructor(private fb: FormBuilder,
    private departmentService: DepartmentService,
    private companyService: CompanyService) { 
    this.addForm = fb.group({
      'name': ['', Validators.required],
      'description': [''],
      'company_id': ['', Validators.required]
    });

    this.editForm = fb.group({
      'name': ['', Validators.required],
      'description': [''],
      'company_id': ['', Validators.required],
      'id': ['', Validators.required]
    });

  }

  ngOnInit() { 
    //this.getAllDepartment();
    //this.getAllCompany();
    setTimeout(() => {
      $('#department_table').DataTable({
      });
    }, 10);
  } 

  companyList;
  getAllCompany(){
    $("#company_table").DataTable().clear().destroy();
    this.companyList = [];
    this.companyService.getCompany().subscribe(data => {
      this.companyList = data;
    });
  }
 
  getAllDepartment(){
    $("#department_table").DataTable().clear().destroy();
    this.departmentList = [];
    this.departmentService.getDepartment().subscribe(data=>{
      this.departmentList = data;
      setTimeout(() => {
        $('#department_table').DataTable({
        });
      }, 10);
      console.log(this.departmentList);
    });
  }

  addDepartment(value){
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    console.log(value);
    this.departmentService.addDepartment(value).subscribe(data => {
      this.submitted_add = false;
      $('#modal-department-add').modal('hide');
      this.successDialog();
      this.getAllDepartment();

    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  deleteDepartment(id){
    this.currentDepartmentId = id;
    $('#modal-department-remove').modal('show');
  }

  deleteProcess(id){
    this.departmentService.deleteDepartment(id).subscribe(data => {
      $('#modal-department-remove').modal('hide');
      this.successDialog();
      this.getAllDepartment();
    })
  }

  editDepartment(id){
    this.currentDepartmentId = id;
    this.departmentService.getDepartmentById(id).subscribe(data => {
      this.department = data;

      this.editForm.patchValue({
        id: this.department['id'],
        name: this.department['name'],
        description: this.department['description'],
        company_id: this.department['company_id'],
      });

      $('#modal-department-edit').modal('show');
    });
  }

  updateDepartment(value){
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }

    console.log(value);
    this.departmentService.updateDepartment(value.id, value).subscribe(data => {
      this.submitted_edit = false;
      $('#modal-department-edit').modal('hide');
      this.getAllDepartment();
      this.successDialog();
    })
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
