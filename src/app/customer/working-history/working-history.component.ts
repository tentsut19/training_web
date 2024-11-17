import { Component, OnInit, ViewChild } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CommonService, Constant, CustomerService, EmployeeService, MasterDataService, UploadFilesService } from 'src/app/shared';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { TimesheetService } from 'src/app/shared/service/timesheet.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CUST, Customer } from 'src/app/guard/summaryPrecheckpoint/demo-data';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-cust-working-history',
  templateUrl: './working-history.component.html',
  styleUrls: ['./working-history.component.css']
})
export class CustomerWorkingHistoryComponent implements OnInit { 

  masterDataCategory = [];
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  masterDataList = [];
  mainTopicMasterList = [];
  mainTopicId = "";
  subTopicId = "";
  subTopicMasterList = [];
  customerList = [];  
  customerSearchId;
  datas = [];

  optionleDate: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: false
  };
  startDate;
  startDateStr;
  endDate;
  endDateStr;
  /** list of banks */
protected customers: Customer[] = CUST;

/** control for the selected bank */
public custCtrl: FormControl = new FormControl();

/** control for the MatSelect filter keyword */
public custFilterCtrl: FormControl = new FormControl();

/** list of banks filtered by search keyword */
public filteredCust: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);

@ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

/** Subject that emits when the component has been destroyed. */
protected _onDestroy = new Subject<void>();

  constructor(
    private masterDataService: MasterDataService,
    private timesheetService: TimesheetService,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,

    private fb: FormBuilder,) { 
      this.searchForm = fb.group({
        'title': [''],
        'sub_title': [''],
        'customer_id': [''],
        'employee_id': ['']
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
    this.startDate = new Date();
    this.startDate.setHours(0);
    this.startDate.setMinutes(0);
    this.startDate.setSeconds(0);
    this.startDateStr = this.getDateStr(new Date());

    this.endDate = new Date();
    this.endDate.setHours(0);
    this.endDate.setMinutes(0);
    this.endDate.setSeconds(0);
    this.endDateStr = this.getDateStr(new Date());

    this.getCustomer();
    this.getMasterDataActive();
    this.getMainTopic();
    this.searchTimesheet();
  }

  getMainTopic(){
    this.masterDataService.getMainTopic().subscribe(res=>{
      console.log(res);
      this.mainTopicMasterList = res;
    }, error => {
      console.error(error);
    });
  }

  selectMainTopic($event){
    console.log($event.target.value);
    this.masterDataService.getSubTopicByMainTopic($event.target.value).subscribe(res=>{
      console.log(res);
      this.subTopicMasterList = res;
    }, error => {
      console.error(error);
    });
  }

  getMasterDataActive(){
    this.masterDataService.getMasterDataCategory().subscribe(res=>{
        //console.log(res);
        this.masterDataCategory = res;
    });
  }

  getCustomer(){
    this.spinner.show();
    $("#check-point-customer").DataTable().clear().destroy();
    this.customerList = [];
    this.customerService.getCustomerForDropDown().subscribe(res=>{
      this.customerList = res;
      //console.log(this.customerList); 
      this.customers.push(
        {id:0,name:'เลือกหน่วยงาน'}
      )
      this.customerList.forEach(item=>{
        this.customers.push(
          {id:item.id,name:item.name}
        )
      });

      // set initial selection
    this.custCtrl.setValue(this.customers[0]);

    // load the initial bank list
    this.filteredCust.next(this.customers.slice());

    // listen for search field value changes
    this.custFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCust();
      }); 
      this.spinner.hide(); 
    });
  }

  protected filterCust() {
    if (!this.customers) {
      return;
    }
    if(this.custCtrl.value == null){return;}
    // get the search keyword
    console.log(this.custCtrl.value)
    this.customerSearchId = this.custCtrl.value['id'];
    let search = this.custFilterCtrl.value;
    console.log(this.customerSearchId)
    //this.changeFlag = false;
    if (!search) {
      this.filteredCust.next(this.customers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCust.next(
      this.customers.filter(cust => cust.name.toLowerCase().indexOf(search) > -1)
    );
  }
 
  searchTimesheet(){
    console.log('customerSearchId',this.customerSearchId);
    console.log('start date',this.startDateStr);
    console.log('end date',this.endDateStr);
    console.log('customerSearchId',this.mainTopicId);
    console.log('customerSearchId',this.subTopicId);
    const request = {
      customer_id: this.customerSearchId ? this.customerSearchId : '',
      employee_id: '',
      startDate: this.startDateStr,
      endDate: this.endDateStr,
      title: this.mainTopicId,
      sub_title: this.subTopicId
    }
    this.timesheetService.searchSubTimesheet(request).subscribe(res=>{
      console.log(res);
      this.datas = res.data;
    });
  } 

  filterestCustomerChaned($event){}
 
  timesheetSubItem
  viewTimeSheet(id){
    this.spinner.show();
    this.timesheetService.getTimeSheetSubItemById(id).subscribe(res=>{
      console.log(res);
      this.timesheetSubItem = res;
      this.spinner.hide();
      $('#modal-timesheet-view').modal('show');
    }, error => {
      this.spinner.hide();
      console.error(error);
    });
    
  }

  selectedDate(value){
    this.startDate = value.start._d;
    this.startDateStr = this.getDateStr(this.startDate);
    console.log(this.startDateStr);
    this.endDate = value.end._d;
    this.endDateStr = this.getDateStr(this.endDate);
    console.log(this.endDateStr);
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
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
