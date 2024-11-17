import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';
@Component({
  selector: 'app-timesheetMaster',
  templateUrl: './timesheetMaster.component.html',
  styleUrls: ['./timesheetMaster.component.css']
})
export class TimesheetMasterComponent implements OnInit { 

  timeSheetMasterList = [];
  searchForm: FormGroup;
  mainTopicAddForm: FormGroup;
  mainTopicEditForm: FormGroup;
  subTopicAddForm: FormGroup;
  subTopicEditForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  masterDataList = [];

  constructor(private masterDataService: MasterDataService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,) { 
      this.searchForm = fb.group({
        'mainTopicId': [''],
        'subTopicId': ['']
      });
      this.mainTopicAddForm = fb.group({
        'title': ['', Validators.required],
        'description': [''],
        'active': [true, Validators.required]
      });
      this.mainTopicEditForm = fb.group({
        'title': ['', Validators.required],
        'description': [''],
        'active': [true, Validators.required],
        'id': ['', Validators.required]
      });
      this.subTopicAddForm = fb.group({
        'mainTopicId': ['', Validators.required],
        'title': ['', Validators.required],
        'description': [''],
        'active': [true, Validators.required]
      });
      this.subTopicEditForm = fb.group({
        'mainTopicId': ['', Validators.required],
        'title': ['', Validators.required],
        'description': [''],
        'active': [true, Validators.required],
        'id': ['', Validators.required]
      });
   }

  ngOnInit() {
    this.getMainTopic();
    this.search();
  }

  mainTopicMasterList
  getMainTopic(){
    this.masterDataService.getMainTopic().subscribe(res=>{
      console.log(res);
      this.mainTopicMasterList = res;
    }, error => {
      console.error(error);
    });
  }

  subTopicMasterList
  getSubTopic(){
    this.masterDataService.getSubTopic().subscribe(res=>{
      console.log(res);
      this.subTopicMasterList = res;
    }, error => {
      console.error(error);
    });
  }

  openModalAdd(){
    this.topic = 'MAIN'
    this.mainTopicAddForm.patchValue({
      title: "",
      description: "",
      active: '1',
    });
    this.subTopicAddForm.patchValue({
      mainTopicId: "",
      title: "",
      description: "",
      active: '1',
    });
    $('#modal-masterData-add').modal('show');
  }

  openModalEdit(data){
    console.log(data)
    if(data.mainTopicId){
      this.topic = 'SUB'
      this.subTopicEditForm.patchValue({
        mainTopicId: data.mainTopicId,
        title: data.subTopic,
        description: data.description,
        active: data.active,
        id: data.id
      });
    }else{
      this.topic = 'MAIN'
      this.mainTopicEditForm.patchValue({
        title: data.mainTopic,
        description: data.description,
        active: data.active,
        id: data.id
      });
    }

    $('#modal-masterData-edit').modal('show');
  }

  mainTopicList
  search(){
    console.log(this.searchForm.value);
    this.spinner.show();
    $("#master_data_table").DataTable().clear().destroy();
    this.masterDataService.searchTimeSheetMaster(this.searchForm.value).subscribe(res=>{
      this.spinner.hide();
      console.log(res);
      this.timeSheetMasterList = res;
      setTimeout(() => {
        $('#master_data_table').DataTable({
        });
      }, 100);
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  topic = 'MAIN'
  topicSelection() {
    if (this.topic === 'MAIN') {
      console.log("topic: MAIN");
    }
    else if (this.topic === 'SUB') {
      console.log("topic: SUB");
    }
  } 

  addMasterData(form){
    console.log(form.value);
    this.submitted_add = true;
    if(form.invalid){
      return;
    }
    this.spinner.show();
    this.masterDataService.addTimeSheetMaster(form.value).subscribe(res=>{
      $('#modal-masterData-add').modal('hide');
      this.spinner.hide();
      this.successDialog();
      this.getMainTopic();
      this.search();
      this.submitted_add = false;
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  updateMasterData(form){
    console.log(form.value);
    this.submitted_edit = true;
    if(form.invalid){
      return;
    }
    this.spinner.show();
    this.masterDataService.updateTimeSheetMaster(form.value,form.value.id).subscribe(res=>{
      $('#modal-masterData-edit').modal('hide');
      this.spinner.hide();
      this.successDialog();
      this.getMainTopic();
      this.search();
      this.submitted_edit = false;
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  currentId;
  delete(id){
    this.currentId = id;
    $('#modal-remove').modal('show');
  }

  deleteProcess(id){
    this.spinner.show();
    this.masterDataService.delete(id).subscribe(data => {
      $('#modal-remove').modal('hide');
      this.spinner.hide();
      this.successDialog();
      this.getMainTopic();
      this.search();
    }, error => {
      this.spinner.hide();
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
