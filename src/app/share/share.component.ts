import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PositionService, EmployeeService, DepartmentService, CommonService , OutsiderService, ShareService, ReportService, Constant} from 'src/app/shared';
import { CompanyService } from 'src/app/shared';
import { Options } from '@angular-slider/ngx-slider';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Customer } from '../guard/permanent/guardCheckPoint/demo-data';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  pageId = '401';
  departmentList = [];
  positionList = [];
  companyList = [];
  shareList = [];
  addForm: FormGroup;
  submitted_add = false;
  editForm: FormGroup;
  submitted_edit = false;
  employee;
  companyId = "";
  departmentId = "";
  positionId = "";
  olderAge = false;
  currentEmployeeId;
  value: number = 0;
  highValue: number = 100;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  personnel;
  isAdmin = false;
  numberShares = 0
  sumTotalShareValue = 0
  sumReceived = 0
  sumNotReceived = 0
  recommenderName = ''
  employeeName = ''
  monthList;
  yearList;
  yearNewList;
  month = 0
  year = 0
  monthModal = 0
  yearModal = 0
  dayModal = '0'
  daysMidInMonth = 0;
  isShowYearMonth = false
  isShowYearMonthModal = false
  recommenderType = ''

  /** list of banks */
  // protected employeeList: Employee[] = EMP;

  /** control for the selected bank */
  public employeeCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public employeeFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredEmployee: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  displayedColumns: string[] = ['no', 'code', 'recommender_name', 'recommender_type', 'employee_name', 'start_date', 'quantity_months_payment', 'amount', 'status', 'id'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  constructor(
    private positionService: PositionService,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private departmentService: DepartmentService,
    private reportService: ReportService,
    private constant: Constant,
    private outsiderService: OutsiderService,
    private shareService: ShareService
    
    ) {

    }

  // permissionPage = {'pageId':'000','positionId':0, p_insert:false,p_update:false,p_view:false,p_delete:false};
  permissionPage = {'pageId':'000','positionId':0, p_insert:true,p_update:true,p_view:true,p_delete:true};
  ngOnInit() {
    console.log('=== ngOnInit ===')
    this.personnel = JSON.parse(localStorage.getItem('tisToken'));
    // this.permissionPage = this.permissionService.checkPermission(this.pageId,this.personnel.position.id);
    console.log(this.personnel);
    if(this.personnel && this.personnel.position && (this.personnel.position.id == 3 || this.personnel.position.id == 8)){ // fix admin id = 3 && 8
      this.isAdmin = true
    }
    console.log('=== isAdmin : '+this.isAdmin+'===')
    this.startWork = this.commonService.convertDateToStrngDDMMYYYY(new Date())+" - "+this.commonService.convertDateToStrngDDMMYYYY(new Date());
    this.startWorkFrom = this.commonService.convertDateToStrng(new Date());
    this.startWorkTo = this.commonService.convertDateToStrng(new Date());

    //month list
    this.monthList = this.commonService.getMonthList();
    //year list
    this.yearList = this.commonService.getYearList();

    this.yearNewList = this.commonService.getYearNewList();

    // this.getAllCompany();
  }

  selectedItems = [];
  dropdownSettings = {};

  selectedOutsiderItems = [];
  dropdownOutsiderSettings = {};

  ngAfterViewInit(){
    console.log('=== ngAfterViewInit ===')
    console.log('=== isAdmin : '+this.isAdmin+'===')

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name_full',
      selectAllText: 'เลือกทั้งหมด',
      unSelectAllText: 'ยกเลิกทั้งหมด',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.dropdownOutsiderSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name_full',
      selectAllText: 'เลือกทั้งหมด',
      unSelectAllText: 'ยกเลิกทั้งหมด',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.searchAllShare();
    this.searchAllEmployee();
    this.getOutsiderAll();
  }

  outsiderList
  getOutsiderAll(){
    this.outsiderList = [];
    this.outsiderService.get().subscribe(data=>{
      this.outsiderList = data;
      console.log(this.outsiderList);
    },
    err => {
      this.failDialog('');
      console.log(err);
    });
  }

  employeeList
  searchAllEmployee(){
    this.employeeList = []
    var request = {};
    this.employeeService.search(request).subscribe(data => {
        this.employeeList = data;
        console.log(this.employeeList)
        
    }, error => {
      console.error(error);
    });
  }

  employeeIds = []
  employeeId = 0
  onItemSelect(item: any) {
    console.log(item);
    this.employeeIds.push(item['id'])
  }
  onItemSelectAll(items: any) {
    console.log(items);
    var i = 0
    this.employeeIds = []
    items.forEach(element => {
      this.employeeIds.push(element['id'])
      i++
    });
  }
  onDeSelect(item: any){
    console.log(item);
    var index = this.employeeIds.indexOf(item['id']);
    if (index !== -1) {
      this.employeeIds.splice(index, 1);
    }
  }
  onDeSelectAll(items: any){
    console.log(items);
    this.employeeIds = []
  }

  outsiderIds = []
  outsiderId = 0
  onOutsiderItemSelect(item: any) {
    console.log(item);
    this.outsiderIds.push(item['id'])
  }
  onOutsiderItemSelectAll(items: any) {
    console.log(items);
    var i = 0
    this.outsiderIds = []
    items.forEach(element => {
      this.outsiderIds.push(element['id'])
      i++
    });
  }
  onOutsiderDeSelect(item: any) {
    console.log(item);
    var index = this.outsiderIds.indexOf(item['id']);
    if (index !== -1) {
      this.outsiderIds.splice(index, 1);
    }
  }
  onOutsiderDeSelectAll(items: any){
    console.log(items);
    this.outsiderIds = []
  }

  export(){
    // if(this.employeeId == 0){
      
    // }
    this.spinner.show();
    var req = {
      "month":this.monthModal,
      "year":this.yearModal,
      "day":this.dayModal,
      "daysMidInMonth":this.daysMidInMonth,
      "employeeId":this.employeeId,
      "employeeIds":this.employeeIds,
      "outsiderId":this.outsiderId,
      "outsiderIds":this.outsiderIds
    }
    console.log(req)
    this.reportService.genReportShare(req).subscribe(resp => {
      this.spinner.hide();
      console.log(resp);
      window.open(resp.url, '_blank');
    }, err => {
      this.spinner.hide();
      this.failDialog('');
    });
  }

  export_old_v1(){
    // if(this.employeeId == 0){
      
    // }
    this.spinner.show();
    var req = {
      "month":this.monthModal,
      "year":this.yearModal,
      "day":this.dayModal,
      "daysMidInMonth":this.daysMidInMonth,
      "employeeId":this.employeeId,
      "outsiderId":this.outsiderId
    }
    this.reportService.genReportShare(req).subscribe(resp => {
      this.spinner.hide();
      console.log(resp);
      window.open(resp.url, '_blank');
    }, err => {
      this.spinner.hide();
      this.failDialog('');
    });
  }

  export_old(){
    // if(this.employeeId == 0){
      
    // }
    this.spinner.show();
    this.reportService.getUUID().subscribe(data=>{
      console.log(data.uuid);
      var req = {
        "uuid":data.uuid,
        "month":this.monthModal,
        "year":this.yearModal,
        "day":this.dayModal,
        "daysMidInMonth":this.daysMidInMonth,
        "employeeId":this.employeeId,
        "outsiderId":this.outsiderId
      }
      this.reportService.genReportShare(req).subscribe(resp => {
        console.log(resp);
        setTimeout(() => {
          this.getUpdateOrder(data.uuid);
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
          var url = this.constant.API_REPORT_ENDPOINT+"/report/share";
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

  getDepartmentByCompanyId(companyId){
    this.departmentList = [];
    this.positionList = [];
    this.departmentId = "";
    this.positionId = "";
    if(companyId){
      this.departmentService.getDepartmentByCompanyId(companyId).subscribe(data=>{
        this.departmentList = data;
      });
    }
  }

  getPositionByDepartmentId(departmentId){
    this.positionList = [];
    this.positionId = "";
    if(departmentId){
      this.positionService.getByDepartmentId(departmentId).subscribe(data => {
        this.positionList = data;
      });
    }
  }

  getAllCompany(){
    this.companyList = [];
    this.companyService.getCompany().subscribe(data => {
      this.companyList = data;
    });
  }

  addEmployee(employee){
    console.log(employee);
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    
    this.employeeService.addEmployee(employee).subscribe(data => {
      this.submitted_add = false;
      $('#modal-employee-add').modal('hide');
      this.successDialog();
      this.searchAllShare();

    }, error => {
      console.error(error);
      this.failDialog(error);
    });
    
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

  showEditOrUpdate(item){
    if(item.isEdit){
      console.log(item)
      this.spinner.show();
      var req = {}
      req["code"] = item.code
      this.shareService.updateCode(req,item.id).subscribe(data => {
        this.spinner.hide();
        item.isEdit = !item.isEdit;
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog(error);
      });
    }else{
      item.isEdit = !item.isEdit;
    }
  }

  searchAllShare(){
    this.search()
  }

  search(){
    console.log('=== search ===')
    this.spinner.show();
    this.shareList = [];
    $("#share_table").DataTable().clear().destroy();

    var type = 'employee';
    if(this.personnel && this.personnel.type == "outsider"){
      type = this.personnel.type;
    }

    var req = {}
    req["isAdmin"] = this.isAdmin
    req["outsider"] = type
    req["employeeId"] = this.personnel.id
    if(this.isShowYearMonth){
      req["yearMonth"] = Number(this.year+this.month)
    }
    req["recommenderName"] = this.recommenderName
    req["employeeName"] = this.employeeName
    req["recommenderType"] = this.recommenderType
    
    
    console.log(req)

    this.shareService.search(req).subscribe(data => {
        this.shareList = data.shareSearchResponseList;
        this.sumTotalShareValue = data.sumTotalShareValue;
        this.sumReceived = data.sumReceived;
        this.sumNotReceived = data.sumNotReceived;
        console.log(this.shareList);

        this.dataSource = new MatTableDataSource(this.shareList);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // this.mapDate()
        setTimeout(() => {
          this.spinner.hide();
          $('#share_table').DataTable({

          });
        }, 100);

    }, error => {
      this.spinner.hide();
      console.error(error);
    });
  }

  mapDate(){
    this.sumTotalShareValue = 0
    this.sumReceived = 0
    this.sumNotReceived = 0
    console.log(this.shareList)
    if(this.shareList){
      this.numberShares = this.shareList.length;
      this.shareList.forEach(stocks => {
        if(stocks['start_date']){
          const date = new Date(stocks['start_date'])
          const start_date = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          stocks['start_date'] = start_date
        }
        if(stocks['end_date']){
          const date = new Date(stocks['end_date'])
          const end_date = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          stocks['end_date'] = end_date
        }
        
        if(stocks.totalShareValue){
          this.sumTotalShareValue += stocks.totalShareValue
        }
        if(stocks.received){
          this.sumReceived += stocks.received
        }
        if(stocks.notReceived){
          this.sumNotReceived += stocks.notReceived
        }
        stocks['isEdit'] = false
        
      });
    }
  }

  showYearMonth(){
    this.isShowYearMonth = !this.isShowYearMonth;
  }

  showYearMonthModal(){
    this.isShowYearMonthModal = !this.isShowYearMonthModal;
  }
  
  currentId;
  delete(id){
    this.currentId = id;
    $('#modal-employee-remove').modal('show');
  }

  deleteProcess(id){
    this.employeeService.delete(id).subscribe(data => {
      $('#modal-employee-remove').modal('hide');
      this.successDialog();
      this.searchAllShare();
    })
  }

  shareItemList
  openModalShare(shareId){
    console.log(shareId)
    this.spinner.show();
    this.shareItemList = [];
    $("#share_item_table").DataTable().clear().destroy();
    this.shareService.getShareItemByShareId(shareId).subscribe(data => {
        this.shareItemList = data;
        console.log(data)

        this.shareItemList.forEach(stocks => {
          if(stocks['period_date']){
            const date = new Date(stocks['period_date'])
            const period_date = date.toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            stocks['period_date'] = period_date
          }
          if(stocks['payment_date']){
            const date = new Date(stocks['payment_date'])
            const payment_date = date.toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            stocks['payment_date'] = payment_date
          }
        });

        setTimeout(() => {
          this.spinner.hide();
          $('#share_item_table').DataTable({

          });
          $('#modal-share-item').modal('show');
        }, 100);

    }, error => {
      this.failDialog('');
      this.spinner.hide();
      console.error(error);
    });
  }

  openModalExport(){
    $('#modal-share-export').modal('show');
  }

  updateShare(){
    Swal.fire({
      title: 'คุณต้องการอัปเดตหุ้นลอยใช่ไหม',
      text: "กดยืนยันเพื่ออัปเดตหุ้นลอย",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        this.spinner.show()
        this.shareService.updateShare().subscribe(resp => {
          this.spinner.hide()
          Swal.fire("ทำรายการสำเร็จ!", "ระบบจะแจ้งเตือนไปที่กลุ่มไลน์เมื่อระบบอัปเดตหุ้นลอยเรียบร้อย", "success");
        }, err => {
          this.spinner.hide()
          this.failDialog('')
          console.log("=== err ===")
          console.log(err)
        });

      }
    })
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
