import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { CustomerReportLineService, EmployeeService, CommonService} from 'src/app/shared';
import { CompanyService } from 'src/app/shared';
import { Options } from '@angular-slider/ngx-slider';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from '../shared/constant';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-customer-report-line-oa',
  templateUrl: './customer-report-line-oa.component.html',
  styleUrls: ['./customer-report-line-oa.component.css']
})
export class CustomerReportLineOAComponent implements OnInit  {
  dataList = [];

  value: number = 0;
  highValue: number = 100;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  personnel;

  
  displayedColumns: string[] = ['customer_name','customer_group_name','reporter','message','created_at','respondent','message_reply','reply_datetime'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  public customerCompanyCtrl: FormControl = new FormControl();
  public customerCompanyFilterCtrl: FormControl = new FormControl();
  public filteredCustomerCompanyList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private customerReportLineService: CustomerReportLineService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService
    ) {

    }

  ngOnInit() {
    this.searchAllEmployee();
  }

  displayUpdateDate(date){
    if(date){
      let splitDate = date.split(' ')[0].split('-');
      let value = splitDate[2].concat(' ').concat(this.commonService.convertMonthTH(splitDate[1])) + ' '.concat(splitDate[0])
      .concat(' ' + date.split(' ')[1]).concat(' น.')
      return value;
    }
    return "-";
  }
  
  customerCompanyList = [];
  protected filterWorkSaleSurveys() {
    if (!this.customerCompanyList) {
      return;
    }
    // get the search keyword
    let search = this.customerCompanyFilterCtrl.value;
    if (!search) {
      this.filteredCustomerCompanyList.next(this.customerCompanyList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCustomerCompanyList.next(
      this.customerCompanyList.filter(x => (x.name_main+" | "+x.name).toLowerCase().indexOf(search) > -1)
    );
  }

  isShowStartWork = false;
  daterange: any = {};
  startWork;
  startWorkTo;
  startWorkFrom;
  optionsDate: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
  };
  selectedStartWork(value: any, datepicker?: any) {
    // this is the date  selected
    console.log(value);
    var from = value.start._d;
    var to = value.end._d;

    this.startWork = this.commonService.convertDateToStrngDDMMYYYY(from)+" - "+this.commonService.convertDateToStrngDDMMYYYY(to);
    this.startWorkFrom = this.commonService.convertDateToStrng(from);
    this.startWorkTo = this.commonService.convertDateToStrng(to);
  }

  showStartWork(){
    this.isShowStartWork = !this.isShowStartWork;
  }

  input;
  searchAllEmployee(){
    this.spinner.show();
    this.dataList = [];
    var request = {};

    console.log(request);
    this.customerReportLineService.getAll().subscribe(data => {
        this.dataList = data;
        console.log(this.dataList);
        this.dataSource = new MatTableDataSource(this.dataList);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        setTimeout(() => {
          this.spinner.hide();
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

}
