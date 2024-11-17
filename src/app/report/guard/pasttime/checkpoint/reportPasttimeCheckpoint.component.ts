import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, ReportService} from '../../../../shared';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-reportPasttimeCheckpoint',
  templateUrl: './reportPasttimeCheckpoint.component.html',
  styleUrls: ['./reportPasttimeCheckpoint.component.css']
})
export class ReportPasttimeCheckpointComponent implements OnInit { 

  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  startDate
  exportForm: FormGroup;
  submitted_export = false; 
  startDateStr;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private reportService: ReportService
    ) { 
       this.exportForm = fb.group({
      'checkpoin_date': [''],
      'report_type': ['', Validators.required],
    });
   }

  ngOnInit() {
       this.loadScript();
       this.startDate = new Date();
       this.startDate.setHours(0);
       this.startDate.setMinutes(0);
       this.startDate.setSeconds(0);

       //get current date
       this.startDateStr = this.getDateStr(new Date());
  }

  exportDocument(value){
    console.log(value);
    this.submitted_export = true;
    if(this.exportForm.invalid){
      console.log("exportForm invalid");
      return;
    }
    let param = {workDate:this.startDateStr, reportType:this.exportForm.get('report_type').value}
    console.log(param);
    this.reportService.reportGuardPasttimeCheckpoint(param).subscribe(data=>{
        console.log(data['data']);
        this.reportService.downloadFile(data).subscribe(res=>{
          let blob:any = new Blob([res], { type: 'text/json; charset=utf-8' });
          fileSaver.saveAs(blob, 'download.pdf');
        });
    });
  }
 
  selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    //console.log(value);
    this.startDate = value.start._d;
    //console.log(this.startDate);
    this.startDateStr = this.getDateStr(this.startDate);
    console.log(this.startDateStr);
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
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

  loadScript(){
     
  }

}
