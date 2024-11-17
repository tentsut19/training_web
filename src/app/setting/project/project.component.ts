import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'ng2-org-chart/src/employee';
import { DepartmentService, CompanyService, UploadFilesService } from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/shared/service/project.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-project-setting',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectSettingComponent implements OnInit { 

projectList = new Array();
addForm: FormGroup;
editForm: FormGroup;
submitted_add = false;
submitted_edit = false;
currentProjectId;
nameFile: string = '';
editNameFile: string = '';
project: any;

  constructor(private fb: FormBuilder,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private projectService: ProjectService,
    private uploadService: UploadFilesService
    ) { 
    this.addForm = fb.group({
      'project_name': ['', Validators.required],
      'conditions': [''],
      'benefit': [''],
      'nameFile':['']
    });

    this.editForm = fb.group({
      'project_name': ['', Validators.required],
      'conditions': [''],
      'benefit': [''],
      'nameFile':[''],
      'id': ['', Validators.required]
    });

  }

  ngOnInit() { 
    this.getProject();
  } 
 
  getProject(){
    $("#project_table").DataTable().clear().destroy();
    this.projectList = [];
    this.projectService.getProject().subscribe(data=>{
      this.projectList = data;
      setTimeout(() => {$('#project_table').DataTable({});}, 10);
      console.log(this.projectList);
    });
  }

  addProject(value){
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    console.log(value);
    $('#modal-project-add').modal('hide');
    this.projectService.create(value).subscribe(data => {
      console.log(data);
      this.submitted_add = false; 
      if(this.selectedFile){
        this.uploadFile(data.data,this.selectedFile,value.nameFile,null,0);
      }else{
        this.successDialog();
        this.getProject();
      } 
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  message: string = '';
  uploadFile(data, file, name, fileInfoMap,docId) {
    console.log(file);
    this.progressInfos[0] = { value: 0, fileName: file.name };
    var formData: FormData = new FormData();
    console.log(file);
    formData.append('file', file);
    formData.append('type', "project");
    formData.append('projectId', data.id);
    formData.append('name', name);
    formData.append('docId', docId);

    this.uploadService.upload(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[0].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log(event);
          if(event.body.code === "success" && event.body.data){
            this.successDialog();
            this.getProject();
          }
        }
      },
      err => {
        this.progressInfos[0].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(err); 
      });
  }

  deleteProject(id){
    this.currentProjectId = id;
    $('#modal-project-remove').modal('show');
  }

  deleteProcess(id){
    this.projectService.deleteProjectById(id).subscribe(data => {
      $('#modal-project-remove').modal('hide');
      this.successDialog();
      this.getProject();
    })
  }

  editProject(id){
    this.selectedFile = undefined;
    this.currentProjectId = id;
    this.projectService.getProjectById(id).subscribe(data => {
      console.log(data);
      this.project = data;
      this.editForm.patchValue({
        id: data['id'],
        project_name: data['project_name'],
        conditions: data['conditions'],
        benefit: data['benefit'],
      });
      if(data.name_origin){
        this.editNameFile = data.name_origin;
      }
      $('#modal-project-edit').modal('show');
    });
  }

  updateProject(value){
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }
    console.log(value);
    $('#modal-project-edit').modal('hide');
    this.projectService.create(value).subscribe(data => {
      this.submitted_edit = false; 
      if(this.selectedFile){
        this.uploadFile(data.data,this.selectedFile,value.nameFile,null,this.project.document_id?this.project.document_id:0);
      }else{
        this.successDialog();
        this.getProject();
      } 
    })
  }

  progressInfos = []
  selectedFile: any
  selectFile(event) {
    this.progressInfos = [];
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
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
