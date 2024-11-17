import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'ng2-org-chart/src/employee';
import { PositionService ,DepartmentService, CompanyService} from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {

positionList = new Array();
position;
addForm: FormGroup;
editForm: FormGroup;
submitted_add = false;
submitted_edit = false;
currentUnitId;
updateDepartmentId = null;

  constructor(
    private positionService: PositionService,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private companyService: CompanyService
    ) { 

    this.addForm = fb.group({
      'name': ['', Validators.required],
      'description': [''],
      'department_id': ['', Validators.required],
      'company_id': ['', Validators.required]
    });

    this.editForm = fb.group({
      'name': ['', Validators.required],
      'description': [''],
      'department_id': ['', Validators.required],
      'company_id': ['', Validators.required],
      'id': ['', Validators.required]
    });

  }

  ngOnInit() {
    this.getAllPosition();
    this.getAllCompany();
  } 

  companyList;
  getAllCompany(){
    this.companyList = [];
    this.companyService.getCompany().subscribe(data => {
      this.companyList = data;
    });
  }

  departmentList;

  getAllPosition(){
    $("#position_table").DataTable().clear().destroy();
    this.positionList = [];
    this.positionService.getPosition().subscribe(data => {
      this.positionList = data;
      console.log(this.positionList);
      setTimeout(() => {
        $('#position_table').DataTable({
        });
      }, 10);
      console.log(this.positionList);
    });
  }

  deletePosition(id){
    this.currentUnitId = id;
    $('#modal-position-remove').modal('show');
  }

  deleteProcess(id){
    this.positionService.deletePosition(id).subscribe(data => {
      $('#modal-position-remove').modal('hide');
      this.successDialog();
      this.getAllPosition();
    })
  }

  addPosition(value){
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    console.log(value);
    this.positionService.addPosition(value).subscribe(data => {
      this.submitted_add = false;
      $('#modal-position-add').modal('hide');
      this.successDialog();
      this.getAllPosition();

    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  editPosition(id){
    this.positionService.getPositionById(id).subscribe(data => {
      this.position = data;
      
      this.getDepartmentByCompanyId(this.position['company_id'])

      this.editForm.patchValue({
        id: this.position['id'],
        name: this.position['name'],
        description: this.position['description'],
        company_id: this.position['company_id'],
        department_id: this.position['department_id'],
      });

      $('#modal-position-edit').modal('show');
    });
  }

  updatePosition(value){
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }

    console.log(value);
    this.positionService.updatePosition(value.id, value).subscribe(data => {
      this.submitted_edit = false;
      $('#modal-position-edit').modal('hide');
      this.getAllPosition();
      this.successDialog();
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  changeCompanyAdd(value){
    console.log(value);
    this.getDepartmentByCompanyId(value);
  }

  getDepartmentByCompanyId(companyId){
    this.departmentList = [];
    if(companyId != ""){
      this.departmentService.getDepartmentByCompanyId(companyId).subscribe(data=>{
        console.log(data);
        this.departmentList = data;
      });
    }
  }

  loadDefaultScript(){
    $('#position_table').DataTable();
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
