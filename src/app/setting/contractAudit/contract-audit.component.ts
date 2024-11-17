import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { ContractAuditService, ReportService } from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from '../../shared/constant';

@Component({
  selector: 'app-contract-audit',
  templateUrl: './contract-audit.component.html',
  styleUrls: ['./contract-audit.component.css']
})
export class ContractAuditComponent implements OnInit {
  Editor = ClassicEditor;
  addForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private constant: Constant,
    private contractAuditService: ContractAuditService,
    private spinner: NgxSpinnerService,
    private reportService: ReportService,
    private httpService: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.addForm = fb.group({
      'detail': [''],
    });
  }

  ngOnInit() {
    this.get()
  }

  get(){
    this.spinner.show()
    this.contractAuditService.get().subscribe(data => {
      console.log(data);
      this.addForm.patchValue({
        detail: data['detail']
      });
      this.spinner.hide()
    }, error => {
      console.error(error)
      this.failDialog(error)
      this.spinner.hide()
    });
  }

  ngAfterViewInit(){
    this.addForm.patchValue({
      detail: ""
    });
  }

  onChangeDetail( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.addForm.value.detail = data;
    console.log( data );
  }

  submit(value){
    console.log(value);
    this.spinner.show();
    this.contractAuditService.createOrUpdate(value).subscribe(data => {
      this.spinner.hide();
      this.successDialog();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  addTag(val){
    console.log(val)
    var tag = '${'+val+'}'
    this.addForm.patchValue({
      detail: this.addForm.value.detail+tag
    });
  }

  employeeId = 41
  preView(){
    this.spinner.show();
    this.reportService.getUUID().subscribe(data=>{
      console.log(data.uuid);
      var req = {
        "uuid":data.uuid,
        "employeeId":this.employeeId
      }
      this.reportService.genReportContractAudit(req).subscribe(resp => {
        console.log(resp);
        setTimeout(() => {
          // this.getUpdateOrder(data.uuid);
          var url = this.constant.API_REPORT_ENDPOINT+"/report/contract-audit";
          console.log(url);
          window.open(url, '_blank');
          this.spinner.hide();
        }, 100);
      }, err => {
        this.spinner.hide();
        this.failDialog('');
      });
    },
    err => {
      this.spinner.hide();
      console.log(err);
    });
  }

  getUpdateOrder(uuid){
    console.log(uuid);
    if(!uuid){
      this.spinner.hide();
      return
    }
    this.reportService.getUpdateOrder(uuid).subscribe(data=>{
      console.log(data);
      if(data.length == 0){
        this.spinner.hide();
      }else{
        if(data[data.length-1].status == 'success'){
          this.spinner.hide();
          var url = this.constant.API_REPORT_ENDPOINT+"/report/inspection";
          console.log(url);
          window.open(url, '_blank');
        }else if(data[data.length-1].status == 'fail'){
          this.spinner.hide();
          this.failDialog('');
        }else{
          setTimeout(() => {
            this.getUpdateOrder(uuid);
          }, 1000)
        }
      }
    },
    err => {
      this.spinner.hide();
      console.log(err);
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
