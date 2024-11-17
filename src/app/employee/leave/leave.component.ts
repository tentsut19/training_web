import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, LeaveService, CommonService } from '../../shared';
import { Constant } from '../../shared/constant';
import * as fileSaver from 'file-saver';
import { NgxSpinnerService } from "ngx-spinner";
import { AdvMoneyService } from 'src/app/shared/service/advMoney.service';
import { ReplaySubject, Subject } from 'rxjs';
import { CUST, Customer } from 'src/app/guard/permanent/guardCheckPoint/demo-data';
import { MatSelect } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {

  options: any = {
    locale: { format: 'MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  yearList;
  monthList;
  currentYear;
  dayList = [];
  customerList =  [];
  employeeList = [];
  peroidType = 0;
  peroidText = '';
  peroidMonth = 0;

  checkPointModel = {
    'peroid':'06-01-2022',
    'customerList':[]
  };

  checkPointModelCompare = {
    'peroid':'06-01-2022',
    'customerList':[]
  };
  checkPointRecheck = [];

  employeeId;
  customerId = "";
  invalid_customer = false;
  invalid_customer_email = false;
  employee;
  fileInfoMap = new Map();
  fileImportantMap = new Map();
  urlProfile;
  isEmployeeProfile = false;
  customerEmail = "";
  remarkList = [];
  personnel;
  isGuard = false;
  customerSearchId = 0;
  isShowSlip = false;
  advMoneyList = [];

  /** list of banks */
  protected customers: Customer[] = CUST;

  /** control for the selected bank */
  public empCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public empFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredEmp: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  employees = [];

  displayedColumns: string[] = ['leaveTypeName', 'leaveDate', 'useLeaveDay', 'institution', 'details', 'url1', 'id'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild('selectFile1', { static: true }) selectFile1: ElementRef;
  @ViewChild('selectFile2', { static: true }) selectFile2: ElementRef;
  @ViewChild('selectFile3', { static: true }) selectFile3: ElementRef;
  
  InputVar: ElementRef;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private constant: Constant,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private commonService: CommonService,
    private leaveService: LeaveService,
  ) { 
    this.searchForm = fb.group({
      'month':'1-0',
      'year': [new Date().getFullYear()],
      'customerId': [''],
      'employeeId': [''],
    });

    this.addForm = fb.group({
      'employeeId': ['',Validators.required],
      'leaveDate': ['',Validators.required],
      'leaveType': ['',Validators.required],
      'details': [''],
      'nameUrl1': [''],
      'nameUrl2': [''],
      'nameUrl3': ['']
    });

    this.editForm = fb.group({
      'id': ['',Validators.required],
      'employeeId': ['',Validators.required],
      'employeeFullName': [''],
      'leaveDate': ['',Validators.required],
      'leaveType': ['',Validators.required],
      'details': [''],
      'nameUrl1': [''],
      'nameUrl2': [''],
      'nameUrl3': [''],
      'url1': [''],
      'url2': [''],
      'url3': ['']
    });
  }
  isHr = false;

  leaveDateNow = this.getDateStr(new Date()) + " " + this.getDateStr(new Date());
  selectedLeaveDate(value: any, datepicker?: any) {
    console.log(value);
    this.leaveDateNow = this.getDateStr(value.start._d) + " " + this.getDateStr(value.end._d);
    console.log(this.leaveDateNow);
    this.addForm.patchValue({
      leaveDate: this.leaveDateNow,
    });
    this.editForm.patchValue({
      leaveDate: this.leaveDateNow,
    });
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  currentId;
  delete(id){
    this.currentId = id;
    $('#modal-remove').modal('show');
  }

  deleteProcess(){
    this.spinner.show();
    console.log(this.currentId)
    console.log(this.personnel)
    this.leaveService.deleteLeaveHistory(this.currentId, this.personnel.id).subscribe(data => {
      $('#modal-remove').modal('hide');
      this.successDialog();
      this.leaveSearch();
      this.spinner.hide();
    }, err => {
      console.error(err);
      this.spinner.hide();
      this.failDialog('');
    });
  }

  ngOnInit() {
    this.personnel = JSON.parse(localStorage.getItem('tisToken'));
    console.log("personnel : "+this.personnel);
    this.monthList = this.commonService.getMonthListDefault();
    this.generateYearList();
    this.searchAllEmployee();
    //get params
    this.activatedRoute.params.forEach((urlParams) => {
      //this.employeeId = urlParams['id'].replace('#', '');
      console.log("employeeId : "+this.employeeId);
      
      if(this.personnel && this.personnel.position 
        && (this.personnel.position.id == 4 
          || this.personnel.position.id == 5
          || this.personnel.position.id == 21
          || this.personnel.position.id == 22
          )){
        this.isGuard = true
      }
      //this.getEmployee(this.employeeId);
    });

    if(this.personnel.position.id == 8 || this.personnel.position.id == 9 ||
      this.personnel.position.id == 35
    ){
      this.isHr = true
    }else{
      this.employeeId = this.personnel.id;
      this.leaveSearch();
    }

    var m = new Date().getMonth()+1;
    if(m < 10){
      this.monthModal = "0"+m;
    }else{
      this.monthModal = ""+m;
    }
  } 

  openModalExport(){
    console.log(this.monthModal)
    $('#modal-export').modal('show');
  }

  openModalExportSecurityGuard(){
    $('#modal-export-security-guard').modal('show');
  }

  monthModal;
  yearModal = new Date().getFullYear();
  daysMidInMonth = '1';
  leaveType = 'SL';
  export(){
    this.spinner.show();
    var req = {
      "month":this.monthModal,
      "year":this.yearModal,
      "daysMidInMonth":this.daysMidInMonth,
      "employeeType":this.employeeType,
      "leaveType":this.leaveType
    }
    console.log(req)
    this.leaveService.genExcel(req).subscribe(resp => {
      this.spinner.hide();
      console.log(resp);
      window.open(resp.url, '_blank');
    }, err => {
      this.spinner.hide();
      this.failDialog('');
    });
  }

  employeeType = 'securityGuard';
  exportSecurityGuard(){
    this.spinner.show();
    var req = {
      "month":this.monthModal,
      "year":this.yearModal,
      "daysMidInMonth":this.daysMidInMonth,
      "employeeType":this.employeeType,
      "leaveType":this.leaveType
    }
    console.log(req)
    this.leaveService.genExcelSecurityGuard(req).subscribe(resp => {
      this.spinner.hide();
      console.log(resp);
      window.open(resp.url, '_blank');
    }, err => {
      this.spinner.hide();
      this.failDialog('');
    });
  }

  openModalLeaveAdd(){
    this.submitted_add = false;
    this.selectFile1.nativeElement.value = null;
    this.selectFile2.nativeElement.value = null;
    this.selectFile3.nativeElement.value = null;
    this.addForm.patchValue({
      leaveDate: '',
      leaveType: '',
      details: '',
      nameUrl1:'',
      nameUrl2:'',
      nameUrl3:''
    });
    this.addForm.patchValue({
      leaveDate: this.leaveDateNow,
    });
    $('#modal-leave-add').modal('show');
  }

  data
  openModalLeaveEdit(obj){
    this.data = obj
    console.log(obj)
    this.submitted_edit = false;
    this.selectFile1.nativeElement.value = null;
    this.selectFile2.nativeElement.value = null;
    this.selectFile3.nativeElement.value = null;

    var nameUrl1 = ''
    if(obj.url1){
      nameUrl1 = obj.nameUrl1
    }
    var nameUrl2 = ''
    if(obj.url2){
      nameUrl2 = obj.nameUrl2
    }
    var nameUrl3 = ''
    if(obj.url3){
      nameUrl3 = obj.nameUrl3
    }

    var leaveDate = this.getDateStr(new Date(obj.leaveDateStart)) + " " 
    + this.getDateStr(new Date(obj.leaveDateEnd));

    this.editForm.patchValue({
      id: obj.id,
      employeeId: obj.employeeId,
      employeeFullName: obj.employeeFullName,
      leaveDate: leaveDate,
      leaveType: obj.leaveType,
      details: obj.details,
      nameUrl1: nameUrl1,
      nameUrl2: nameUrl2,
      nameUrl3: nameUrl3,
      url1: obj.url1,
      url2: obj.url2,
      url3: obj.url3,
    });
    $('#modal-leave-edit').modal('show');
  }

  searchAllEmployee(){
    this.spinner.show();
    this.employeeList = []
    var request = {};
    this.employeeService.search(request).subscribe(data => {
        this.employeeList = data;
        console.log(this.employeeList)
        this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.error(error);
    });
  }

  selectedItems = [];
  dropdownSettings = {};
  dropdownCreateSettings = {};
  ngAfterViewInit(){
    console.log('=== ngAfterViewInit ===')

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name_full',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.dropdownCreateSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name_full',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

  }

  onItemSelect(item: any) {
    console.log(item);
    this.employeeId = item['id']
    this.addForm.patchValue({
      employeeId: item['id']
    });
  }

  onDeSelect(item: any){
    console.log(item);
    this.employeeId = '';
    this.addForm.patchValue({
      employeeId: ''
    });
  }

  onItemSelectCreate(item: any) {
    console.log(item);
    this.addForm.patchValue({
      employeeId: item['id']
    });
  }

  onDeSelectCreate(item: any){
    console.log(item);
    this.addForm.patchValue({
      employeeId: ''
    });
  }

  openImage(imageUrl,imageAlt){
    Swal.fire({
      title: "",
      text: "",
      imageUrl: imageUrl,
      // imageWidth: 400,
      // imageHeight: 200,
      width: 1000,
      imageAlt: imageAlt,
      showCancelButton: true,
      confirmButtonText: "โหลด",
      cancelButtonText: "ปิด"
    }).then((result) => {
      console.log(result)
      if (result.value) {
        window.open(imageUrl);
      }
    });
  }

  selectedFile1 = []
  selectedFile2 = []
  selectedFile3 = []
  selectFile(event, type) {
    if(type === 1){
      this.selectedFile1 = event.target.files;
    }else if(type === 2){
      this.selectedFile2 = event.target.files;
    }else if(type === 3){
      this.selectedFile3 = event.target.files;
    }
    //this.selectedFile = event.target.files[0];
    console.log(this.selectedFile1);
    console.log(this.selectedFile2);
    console.log(this.selectedFile3);
  }

  saveLeave(){
    this.submitted_add = true;
    console.log(this.addForm.value);
    if(this.addForm.invalid){
      return;
    }

    var file1 = new File([""], "");
    if(this.selectedFile1.length > 0){
      file1 = this.selectedFile1[0];
    }
    var file2 = new File([""], "");
    if(this.selectedFile2.length > 0){
      file2 = this.selectedFile2[0];
    }
    var file3 = new File([""], "");
    if(this.selectedFile3.length > 0){
      file3 = this.selectedFile3[0];
    }

    var file1Name = '-';
    var file2Name = '-';
    var file3Name = '-';
    if(this.addForm.value.nameUrl1){
      file1Name = this.addForm.value.nameUrl1;
    }
    if(this.addForm.value.nameUrl2){
      file2Name = this.addForm.value.nameUrl2;
    }
    if(this.addForm.value.nameUrl3){
      file3Name = this.addForm.value.nameUrl3;
    }

    var formData: FormData = new FormData();
    formData.append('file1', file1);
    formData.append('file1Name', file1Name);
    formData.append('file2', file2);
    formData.append('file2Name', file2Name);
    formData.append('file3', file3);
    formData.append('file3Name', file3Name);
    formData.append('employeeId', this.addForm.value.employeeId);
    formData.append('leaveType', this.addForm.value.leaveType);
    formData.append('leaveDate', this.addForm.value.leaveDate);
    formData.append('details', this.addForm.value.details);

    this.spinner.show();
    this.leaveService.createLeave(formData).subscribe(data=>{
      $('#modal-leave-add').modal('hide');
      console.log(data);
      this.spinner.hide();
      this.successDialog();
      this.leaveSearch();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  updateLeave(){
    this.submitted_edit = true;
    console.log(this.editForm.value);
    if(this.editForm.invalid){
      return;
    }

    var file1 = new File([""], "");
    if(this.selectedFile1.length > 0){
      file1 = this.selectedFile1[0];
    }
    var file2 = new File([""], "");
    if(this.selectedFile2.length > 0){
      file2 = this.selectedFile2[0];
    }
    var file3 = new File([""], "");
    if(this.selectedFile3.length > 0){
      file3 = this.selectedFile3[0];
    }

    var file1Name = '-';
    var file2Name = '-';
    var file3Name = '-';
    if(this.editForm.value.nameUrl1){
      file1Name = this.editForm.value.nameUrl1;
    }
    if(this.editForm.value.nameUrl2){
      file2Name = this.editForm.value.nameUrl2;
    }
    if(this.editForm.value.nameUrl3){
      file3Name = this.editForm.value.nameUrl3;
    }

    var formData: FormData = new FormData();
    formData.append('id', this.editForm.value.id);
    formData.append('file1', file1);
    formData.append('file1Name', file1Name);
    formData.append('file2', file2);
    formData.append('file2Name', file2Name);
    formData.append('file3', file3);
    formData.append('file3Name', file3Name);
    formData.append('employeeId', this.editForm.value.employeeId);
    formData.append('leaveType', this.editForm.value.leaveType);
    formData.append('leaveDate', this.editForm.value.leaveDate);
    formData.append('details', this.editForm.value.details);

    this.spinner.show();
    this.leaveService.updateLeave(formData).subscribe(data=>{
      $('#modal-leave-edit').modal('hide');
      console.log(data);
      this.spinner.hide();
      this.successDialog();
      this.leaveSearch();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  optionleDate: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: false
  };

  generateYearList(){
    this.yearList = [];
    let date = new Date();
    let currentYear = date.getFullYear();
    for(let i=0;i<=1;i++){
      this.yearList.push(currentYear - i);
    }
  }

  leaveActiveDate = '';
  slNumberLeaveDay = '-';
  slUseLeaveDay = '-';
  slBalanceLeaveDay = '-';
  vlNumberLeaveDay = '-';
  vlUseLeaveDay = '-';
  vlBalanceLeaveDay = '-';
  blNumberLeaveDay = '-';
  blUseLeaveDay = '-';
  blBalanceLeaveDay = '-';
  otherNumberLeaveDay = '-';
  otherUseLeaveDay = '-';
  otherBalanceLeaveDay = '-';
  employeeFullName = '';

  input;
  leaveSearch(){
    this.spinner.show();
    this.leaveActiveDate = '';
    this.slNumberLeaveDay = '-';
    this.slUseLeaveDay = '-';
    this.slBalanceLeaveDay = '-';
    this.vlNumberLeaveDay = '-';
    this.vlUseLeaveDay = '-';
    this.vlBalanceLeaveDay = '-';
    this.blNumberLeaveDay = '-';
    this.blUseLeaveDay = '-';
    this.blBalanceLeaveDay = '-';
    this.otherNumberLeaveDay = '-';
    this.otherUseLeaveDay = '-';
    this.otherBalanceLeaveDay = '-';
    this.employeeFullName = '';
    var request = {};
    request["employeeId"] = this.employeeId;

    console.log(request);
    $("#employe_table").DataTable().clear().destroy();
    this.leaveService.leaveSearch(request).subscribe(data => {
        console.log(data);
        if(data.employeeFullName && data.employeeCode){
          this.employeeFullName = data.employeeFullName +" "+ data.employeeCode;
          this.leaveActiveDate = data.leaveActiveDate;
          this.slNumberLeaveDay = data.slNumberLeaveDay;
          this.slUseLeaveDay = data.slUseLeaveDay;
          this.slBalanceLeaveDay = data.slBalanceLeaveDay;
          this.vlNumberLeaveDay = data.vlNumberLeaveDay;
          this.vlUseLeaveDay = data.vlUseLeaveDay;
          this.vlBalanceLeaveDay = data.vlBalanceLeaveDay;
          this.blNumberLeaveDay = data.blNumberLeaveDay;
          this.blUseLeaveDay = data.blUseLeaveDay;
          this.blBalanceLeaveDay = data.blBalanceLeaveDay;
          this.otherUseLeaveDay = data.otherUseLeaveDay;
        }else{
          this.employeeFullName = 'ยังไม่มีสิทธิ์การลา';
        }

        this.dataSource = new MatTableDataSource(data.leaveHistoryList);
        if(this.dataSource.paginator && this.dataSource.sort){
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        // this.employeeList.forEach(item=>{
        //   item['start_work'] = this.commonService.getDateThNotimeYYYYMMDD2(item['start_work']);
        // });
        // console.log(this.employeeList);

        setTimeout(() => {
          this.spinner.hide();
          $('#employe_table').DataTable({
            "columnDefs": [ {
              "targets": 'no-sort',
              "orderable": false,
        } ]
          });
        }, 100);

    }, error => {
      this.spinner.hide();
      console.error(error);
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

  warningDialog(title,text){
    Swal.fire({
      type: 'warning',
      title: title,
      text: text
    })
  }
  

}
