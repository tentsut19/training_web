import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import { OutsiderService, UploadFilesService, FileManagerService, DepartmentService, CompanyService, PositionService } from 'src/app/shared';
import { HttpEventType, HttpResponse } from '@angular/common/http';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit { 

outsiderList = new Array();
outsider;
addForm: FormGroup;
editForm: FormGroup;
submitted_add = false;
submitted_edit = false;
currentOutsiderId;
nameFile = '';
ownType = '';
companyId = '';
departmentId = '';
positionId = '';

valid_ownType = false;
valid_company = false;
valid_department = false;
valid_position = false;

  constructor(private fb: FormBuilder,
    private outsiderService: OutsiderService,
    private uploadService: UploadFilesService,
    private fileManagerService: FileManagerService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private companyService: CompanyService,
    private spinner: NgxSpinnerService,
    private httpService: HttpClient) { 
    this.addForm = fb.group({
      'prefix': [''],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'identity_no': ['', Validators.required],
      'bank_account_no': [''],
      'mobile': [''],
      'address_detail': [''],
      'provinceMain': [''],
      'amphurMain': [''],
      'thumbonMain': [''],
      'postcode': [''],
    });

    this.editForm = fb.group({
      'prefix': [''],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'identity_no': ['', Validators.required],
      'bank_account_no': [''],
      'mobile': [''],
      'address_detail': [''],
      'provinceMain': [''],
      'amphurMain': [''],
      'thumbonMain': [''],
      'postcode': [''],
      'id': [''],
    });

  }

  tisToken
  ngOnInit() {
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
    console.log(this.tisToken)
    this.get();
    this.getAllCompany();
  }
 
  // getAllPosition(){
  //   this.positionList = [];
  //   this.positionService.getPosition().subscribe(data => {
  //     this.positionList = data;
  //     console.log(this.positionList);
  //     setTimeout(() => {
  //       $('#position_table').DataTable({
  //       });
  //     }, 10);
  //     console.log(this.positionList);
  //   });
  // }

  fileInfoMap = new Map()
  get(){
    this.spinner.show();
    var ownId = this.tisToken.id;
    $("#document_table").DataTable().clear().destroy();
      this.fileManagerService.getDocument(ownId).subscribe(data => {
        console.log(data);
        var i = 0
        data.forEach((val) => {
          this.fileInfoMap.set(val.id,val);
          i++
        });
        setTimeout(() => {
          $('#document_table').DataTable({
          });
        }, 10);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog(error);
      });
  }

  fileInfoMainMap = new Map()
  openModalUpload(fileInfoMap){
    this.fileInfoMainMap = fileInfoMap;
    console.log(this.fileInfoMainMap);
    $('#modal-upload').modal('show');
  }

  progressInfos = []
  selectedFiles: FileList
  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  selectOwnType(val){
    console.log(val)
  }

  uploadFiles() {
    console.log(this.ownType)
    if(!this.ownType){
      this.valid_ownType = true
      return;
    }
    if(this.ownType == 'D' || this.ownType == 'P'){
      if(!this.companyId){
        this.valid_company = true
        return;
      }else{
        this.valid_company = false
      }
      if(!this.departmentId){
        this.valid_department = true
        return;
      }else{
        this.valid_department = false
      }
      if(this.ownType == 'P'){
        if(!this.positionId){
          this.valid_position = true
          return;
        }else{
          this.valid_position = false
        }
      }
    }
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i],this.nameFile,this.fileInfoMainMap);
    }
  }

  message = '';
  upload(idx, file, name, fileInfoMap) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    var formData: FormData = new FormData();
    console.log(file);
    formData.append('file', file);
    formData.append('type', "document");
    formData.append('ownType', this.ownType);
    formData.append('departmentId', this.departmentId);
    formData.append('positionId', this.positionId);
    formData.append('employeeId', this.tisToken.id);
    formData.append('name', name);

    this.uploadService.upload(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          $('#modal-upload').modal('hide');
          console.log(event);
          if(event.body.code === "success" && event.body.data){
            var id = event.body.data.id;
            location.reload()
          }
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(err);
        $('#modal-upload').modal('hide');
      });
  }

  companyList;
  getAllCompany(){
    this.companyList = [];
    this.companyService.getCompany().subscribe(data => {
      this.companyList = data;
    });
  }

  changeOwnType(value){
    if(!value){
      this.valid_ownType = true
    }else{
      this.valid_ownType = false
    }
  }

  changePosition(value){
    if(!value){
      this.valid_position = true
    }else{
      this.valid_position = false
    }
  }

  departmentList
  getDepartmentByCompanyId(companyId){
    if(!companyId){
      this.valid_company = true
    }else{
      this.valid_company = false
    }
    this.departmentList = [];
    if(companyId != ""){
      this.departmentService.getDepartmentByCompanyId(companyId).subscribe(data=>{
        console.log(data);
        this.departmentList = data;
      });
    }
  }

  positionList
  getPositionByDepartmentId(departmentId){
    if(!departmentId){
      this.valid_department = true
    }else{
      this.valid_department = false
    }
    this.positionList = [];
    if(departmentId != ""){
      this.positionService.getByDepartmentId(departmentId).subscribe(data=>{
        console.log(data);
        this.positionList = data;
      });
    }
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
