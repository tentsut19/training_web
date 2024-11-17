import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CommonService, CompanyService, EmployeeService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdvMoneyService } from 'src/app/shared/service/advMoney.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-advMoneyAll',
  templateUrl: './advMoneyAll.component.html',
  styleUrls: ['./advMoneyAll.component.css']
})
export class AdvMoneyAllComponent implements OnInit { 

  masterDataCategory = [];
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  masterDataList = [];
  employeeList = [];
  yearList;
  tmpEmpSelect = [];
  isCheckAll = false;
  advMoneyList = [];
  startDate;
  startDateStr;
  optionSingleDate: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  }; 
  uploadTmpList = [];

  constructor(
    private masterDataService: MasterDataService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private advMoneyService: AdvMoneyService,
    private commonService: CommonService
    ) { 
      this.searchForm = fb.group({
        'category': ['']
      });
      this.addForm = fb.group({
        'pick_date': [''],
        'pick_total_amount': ['',Validators.required],
        'total_installment': ['',Validators.required],
        'paid_per_installment': ['',Validators.required],
        'remark': [''],
        'month': ['',Validators.required],
        'year': ['',Validators.required],
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
    this.generateYearList();
  }

  generateYearList(){
    this.yearList = this.commonService.generateYearList();
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


  applyData(){
    console.log(this.addForm.value)
    let splitMonth = this.addForm.value['month'].split('-');
    let week = Number(splitMonth[1]);
    let month = Number(splitMonth[0]);

    this.advMoneyList.forEach(item=>{
      //item['pick_date'] = new Date();
      item['pick_total_amount'] = this.addForm.value['pick_total_amount'];
      item['total_installment'] = this.addForm.value['total_installment'];
      item['paid_per_installment'] = this.addForm.value['paid_per_installment'];
      item['remark'] = this.addForm.value['remark'];
      item['month'] = this.addForm.value['month'];
      item['year'] = Number(this.addForm.value['year']);
    });
  }

  openEmployeeModal(){
    this.tmpEmpSelect = [];
    $('#modal-advmoney-emp-add').modal('show');
  }

  addEmployeeSelect(){
    console.log(this.tmpEmpSelect);
    $('#modal-advmoney-emp-add').modal('hide');
    this.tmpEmpSelect.forEach(item => {
      item['pick_date'] = this.startDate? new Date():this.startDate;
      item['pick_total_amount'] = this.addForm.value['pick_total_amount'];
      item['total_installment'] = this.addForm.value['total_installment'];
      item['paid_per_installment'] = this.addForm.value['paid_per_installment'];
      item['remark'] = this.addForm.value['remark'];
      item['month'] = this.addForm.value['month'];
      item['year'] = Number(this.addForm.value['year']);
      item['peroidList'] = [];
      this.advMoneyList.push(item);
    });
  }

  removeItem(position){
    console.log(position);
    this.advMoneyList.splice(position,1);
  }

  trigedEmp(emp){
    this.tmpEmpSelect.push(emp);
  }

  trigedEmpAll($event){
    console.log($event.target.checked);
    this.tmpEmpSelect = [];
    if($event.target.checked){
      this.isCheckAll = true;
      this.employeeList.forEach(emp => {
        this.tmpEmpSelect.push(emp);
      });
    }else{
      this.isCheckAll = false;
    }
  }

  saveAll(){
    console.log(this.advMoneyList);
    let valid = true;
    //return;
    this.advMoneyList.forEach(item => {
      let peroidList = [];
      let splitMonth = item.month.split('-');
      let week = Number(splitMonth[1]);
      let month = Number(splitMonth[0]);
      let year = Number(item.year);
      console.log('week : ' + week);
      console.log('month : ' + month);
      console.log('year : ' + year);

      let d = new Date();
      let currDay = d.getDate();
      let currMonth = d.getMonth() + 1;
      let currYear = d.getFullYear();

      console.log('week : ' + currDay);
      console.log('month : ' + currMonth);
      console.log('year : ' + currYear);
      if((month < currMonth) && (currYear == year)){
         valid = false;
      } 

      for (let i = 0; i < item['total_installment']; i++) {
        peroidList.push(month + '-' + week + '_' + year);
        if (week == 0) {
          week++;
        } else if (week == 1) {
          week = 0;
          month++;
        }
        if (month > 12) {
          month = 1;
          year++;
        }
      }
      item['peroidList'] = peroidList;

      if(this.startDate){
        let splitStartDate = this.startDateStr.split('-');
        item['pick_date'] = splitStartDate[2]+'-'+splitStartDate[1]+'-'+splitStartDate[0];
      } 
    });
    /*if(!valid){
      Swal.fire({
        type: 'warning',
        title: 'ไม่สามารถทำรายการได้',
        text: 'มีข้อมูลบางรายการ ที่รอบบิลการเริ่มชำระ น้อยกว่าเดือนปัจจุบัน'
      })
      return;
    }*/
    //save
    let request = {list:this.advMoneyList};
    console.log(request); 
    //return;
    this.advMoneyService.createAll(request).subscribe(res=>{
      this.successDialog();
      setTimeout(() => {location.reload();}, 1000);
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }


  openUploadModal(){
    $('#modal-advmoney-emp-upload').modal('show');
  }

  onFileChange(event: any) {
    /* wire up file reader */
    console.log('onFileChange');
    this.uploadTmpList = [];
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      console.log(data); // Data will be logged in array format containing objects
      this.uploadTmpList = data;
    };
 }

  uploadExcel(){
    $('#modal-advmoney-emp-upload').modal('hide');
    console.log(this.uploadTmpList);
    //console.log(this.employeeList);
    this.uploadTmpList.forEach(item => {
      //console.log(item.STATUS)
      if(item.STATUS == 'Y'){
        let emps = this.employeeList.filter(emp => emp.identity_no == item.ID_NO);
        console.log(emps.length);
        if(emps.length>0){
            emps[0]['pick_date'] = this.startDate? new Date():this.startDate;
            emps[0]['pick_total_amount'] = item.AMOUNT;
            emps[0]['total_installment'] = this.addForm.value['total_installment'];
            emps[0]['paid_per_installment'] = this.addForm.value['paid_per_installment'];
            emps[0]['remark'] = this.addForm.value['remark'];
            emps[0]['month'] = this.addForm.value['month'];
            emps[0]['year'] = Number(this.addForm.value['year']);
            emps[0]['peroidList'] = [];
            this.advMoneyList.push(emps[0]);
        }
      }
    });
    console.log(this.advMoneyList);
  }

  selectedDate(value: any, datepicker?: any) {
    this.startDate = value.start._d;
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

}
