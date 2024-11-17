import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CompanyService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';
@Component({
  selector: 'app-masterData',
  templateUrl: './masterData.component.html',
  styleUrls: ['./masterData.component.css']
})
export class MasterDataComponent implements OnInit { 

  masterDataCategory = [];
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  masterDataList = [];

  constructor(private masterDataService: MasterDataService,
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
    this.getMasterDataActive();
    this.search(this.searchForm.value);
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
