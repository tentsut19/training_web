import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { PositionService, EmployeeService, DepartmentService, CommonService ,PermissionService, CustomerService, ReportService} from 'src/app/shared';
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
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit  {
  pageId = '401';
  departmentList = [];
  positionList = [];
  companyList = [];
  employeeList = [];
  addForm: FormGroup;
  submitted_add = false;
  editForm: FormGroup;
  submitted_edit = false;
  employee;
  companyId = "";
  departmentId = "";
  positionId = "";
  customerId = "";
  olderAge = false;
  currentEmployeeId;
  value: number = 0;
  highValue: number = 100;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  personnel;

  
  displayedColumns: string[] = ['no', 'code', 'identity_no', 'name_full', 'age_th', 'companyName', 'departmentName', 'positionName', 'mobile', 'start_work', 'status', 'id'];
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
    private positionService: PositionService,
    private fb: FormBuilder,
    private constant: Constant,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private departmentService: DepartmentService,
    private customerService: CustomerService,
    private reportService: ReportService,
    private permissionService: PermissionService
    ) { 
      this.addForm = fb.group({
        'prefix': ['', Validators.required],
        'personnelCode': ['', Validators.required],
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required],
        'nickName': ['', Validators.required],
        'gender': ['M'],
        'tel': ['', Validators.required],
        'email': ['', Validators.required],
        'password': ['', Validators.required],
        'companyId': ['', Validators.required],
        'positionId': ['', Validators.required]
      });
  
      this.editForm = fb.group({
        'prefix': ['', Validators.required],
        'personnelCode': ['', Validators.required],
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required],
        'nickName': ['', Validators.required],
        'gender': ['M'],
        'tel': ['', Validators.required],
        'email': ['', Validators.required],
        'password': ['', Validators.required],
        'companyId': ['', Validators.required],
        'positionId': ['', Validators.required]
      });
      this.formDataCustomerCompany = new FormGroup({
        valueSelect: new FormControl("")
      });

    }

    public isHr = false;
    public isFinance = false;
  // permissionPage = {'pageId':'000','positionId':0, p_insert:false,p_update:false,p_view:false,p_delete:false};
  permissionPage = {'pageId':'000','positionId':0, p_insert:true,p_update:true,p_view:true,p_delete:true};
  ngOnInit() {
    this.personnel = JSON.parse(localStorage.getItem('tisToken'));
    // this.permissionPage = this.permissionService.checkPermission(this.pageId,this.personnel.position.id);
    console.log(this.personnel);

    if(this.personnel.position){
      if(this.personnel.position.id == 8){
        this.isHr = true
      }
      if(this.personnel.position.id == 9){
        this.isFinance = true
      }
    }

    this.startWork = this.commonService.convertDateToStrngDDMMYYYY(new Date())+" - "+this.commonService.convertDateToStrngDDMMYYYY(new Date());
    this.startWorkFrom = this.commonService.convertDateToStrng(new Date());
    this.startWorkTo = this.commonService.convertDateToStrng(new Date());
    this.getAllCompany();
    this.searchAllEmployee();
    // this.getAllForDropDown()
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

  changeCustomer(data){
    console.log(data);
    this.customerId = data.id
  }


  isToggleButtonLoadExcel = false
  selectEmployeeAll(val){
    console.log(val)
    var i = 0
    this.employeeList.forEach(element => {
      element['checked'] = val.currentTarget.checked;
      this.isToggleButtonLoadExcel = val.currentTarget.checked;
      if((this.employeeList.length-1) == i){
        this.toggleButtonLoadExcel()
      }
      i++
    });
  }

  selectEmployee(item){
    item.checked = !item.checked;
    this.toggleButtonLoadExcel()
  }

  toggleButtonLoadExcel(){
    this.isToggleButtonLoadExcel = false
    this.employeeList.forEach(element => {
      if(element['checked']){
        this.isToggleButtonLoadExcel = true
      }
    });
  }

  formDataCustomerCompany: FormGroup;
  isShowCustomerCompany = false;
  getAllForDropDown(){
    // this.spinner.show();
    this.customerService.getCustomerForDropDown().subscribe(datas=>{
      console.log(datas);

      var val = {"id":"","name_main":"ALL","name":"ALL"}
      this.customerCompanyList.push(val);

      datas.forEach(data => {
        this.customerCompanyList.push(data);
      });

      // load the initial bank list
      this.filteredCustomerCompanyList.next(this.customerCompanyList.slice());

      // listen for search field value changes
      this.customerCompanyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterWorkSaleSurveys();
      });

      setTimeout(() => {
        this.isShowCustomerCompany = true;

        this.formDataCustomerCompany
        .get("valueSelect")
        .setValue(0);

        // this.spinner.hide();
      }, 100);

    }, err => {
      // this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  employeeIds
  exportInspectionAll(){
    var i = 0
    this.employeeIds = []
    this.employeeList.forEach(element => {
      if(element['checked']){
        this.employeeIds.push(element['id'])
      }
      if((this.employeeList.length-1) == i){
        this.exportInspectionAllProcess()
      }
      i++
    });
  }

  exportInspectionAllProcess(){
    this.spinner.show();
    this.reportService.getUUID().subscribe(data=>{
      console.log(data.uuid);
      var req = {
        "uuid":data.uuid,
        "employeeIds":this.employeeIds
      }
      this.reportService.genReportInspectionAll(req).subscribe(resp => {
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
          var url = this.constant.API_REPORT_ENDPOINT+"/report/inspection-all";
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
      this.searchAllEmployee();

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

   firstName
   lastName
   getRequestParams() {
    let params = {};
    
    if (this.firstName) {
      params[`first_name`] = this.firstName;
    }

    if (this.lastName) {
      params[`last_name`] = this.lastName;
    }
    
    if (this.value) {
      params[`age_begin`] = this.value;
    }

    if (this.highValue) {
      params[`age_high`] = this.highValue;
    }

    if (this.companyId) {
      params[`company_id`] = this.companyId;
    }

    if (this.departmentId) {
      params[`department_id`] = this.departmentId;
    }

    if (this.positionId) {
      params[`position_id`] = this.positionId;
    }

    if(this.isShowStartWork){
      params[`start_work_from`] = this.startWorkFrom;
      params[`start_work_to`] = this.startWorkTo;
    }

    if (this.pageOutPut) {
      params[`page`] = this.pageOutPut;
    }

    if (this.pageSizeOutPut) {
      params[`perPage`] = this.pageSizeOutPut;
    }

    return params;
  }
  
  itemStart;
  itemEnd;
  page = 1;
  pageOutPut = 1;
  pageSizeOutPut = 10;
  from = 0;
  count;
  searchAllEmployee_old(){
    this.spinner.show();
    this.employeeList = [];
    const params = this.getRequestParams();
    console.log(params);
    this.employeeService.search(params).subscribe(resp=>{
      console.log(resp);
      if(resp){
        this.employeeList = resp.data;
        this.employeeList.forEach(item=>{
          // console.log(item['start_work']);
          item['start_work'] = this.commonService.getDateThNotimeYYYYMMDD2(item['start_work']);
        });
        this.count = resp.total;
        this.from = resp.from;
        this.itemStart = resp.from;
        this.itemEnd = resp.to;
      }
      setTimeout(() => {
        this.spinner.hide();
      }, 100);
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  handlePageChange(pageOutPut){
    console.log("=== handlePageChange ===");
    this.pageOutPut = pageOutPut;
    this.searchAllEmployee();
  }

  handlePageSizeChange(pageSizeOutPut){
    console.log("=== handlePageSizeChange ===");
    this.pageSizeOutPut = pageSizeOutPut;
    this.searchAllEmployee();
  }

  input;
  searchAllEmployee(){
    this.spinner.show();
    this.employeeList = [];
    var request = {};
    request["input"] = this.input;
    request["company_id"] = this.companyId;
    request["department_id"] = this.departmentId;
    request["position_id"] = this.positionId;
    request["age_begin"] = this.value;
    request["age_high"] = this.highValue;
    if(this.isShowStartWork){
      request["start_work_from"] = this.startWorkFrom;
      request["start_work_to"] = this.startWorkTo;
    }

    console.log(request);
    $("#employe_table").DataTable().clear().destroy();
    this.employeeService.search(request).subscribe(data => {
        this.employeeList = data;
        console.log(this.employeeList);
        this.dataSource = new MatTableDataSource(this.employeeList);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

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

  exportExcel(){
    console.log(this.employeeList);
    let employeeExportList = []
    if(this.employeeList){
      let count = 1;
      this.employeeList.forEach(item => {
        if(item && item.id !== undefined){
          let workStatus = '';
          if(item.status === 'A'){
            workStatus = 'ปกติ';
          }else if(item.status === 'P'){
            workStatus = 'รอจบอบรม';
          }else if(item.status === 'O'){
            workStatus = 'ลาออก';
          }else if(item.status === 'N'){
            workStatus = 'ไม่ผ่านอบรม';
          }
          employeeExportList.push({'ลำดับ':count, 'รหัสบัตรประชาชน':item.identity_no, 
          'รหัสพนักงาน':item.code,'ชื่อ-สกุล':item.name_full,'อายุ':item.age_th,
          'บริษัท':item.companyName,'แผนก':item.departmentName,'ตำแหน่ง':item.positionName,
          'เบอร์โทร':item.mobile,'วันที่จบการอบรม':item.start_work,'สถานะ':workStatus})
          count++;
        }
      });
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(employeeExportList);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'employee');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: 'application/octet-stream'});
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

  currentId;
  delete(id){
    this.currentId = id;
    $('#modal-employee-remove').modal('show');
  }

  deleteProcess(id){
    this.employeeService.delete(id).subscribe(data => {

      this.employeeService.updateEmployeeSearch().subscribe(data => {
        // clear CacheEvict
        $('#modal-employee-remove').modal('hide');
        this.successDialog();
        this.searchAllEmployee();
      }, error => {
        console.error(error);
        this.failDialog('');
      });

    })
  }

  waitingTraining(id){
    this.currentId = id;
    $('#modal-waiting-training').modal('show');
  }

  waitingTrainingProcess(id){
    var req = {
      status:'P'
    }
    this.spinner.show();
    this.employeeService.updateEmployeeStatus(id,req).subscribe(data => {

      this.employeeService.updateEmployeeSearch().subscribe(data => {
        // clear CacheEvict
        $('#modal-waiting-training').modal('hide');
        this.spinner.hide();
        this.successDialog();
        this.searchAllEmployee();
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog('');
      });

    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  notTrained(id){
    this.currentId = id;
    $('#modal-not-trained').modal('show');
  }

  reasonNotTrained = '';
  invalidReasonNotTrained = false;
  notTrainedProcess(id){
    if(!this.reasonNotTrained){
      this.invalidReasonNotTrained = true;
      return;
    }else{
      this.invalidReasonNotTrained = false;
    }
    var req = {
      status:'N',
      description:this.reasonNotTrained
    }
    this.spinner.show();
    this.employeeService.updateEmployeeStatus(id,req).subscribe(data => {

      this.employeeService.updateEmployeeSearch().subscribe(data => {
        // clear CacheEvict
        $('#modal-not-trained').modal('hide');
        this.spinner.hide();
        this.successDialog();
        this.searchAllEmployee();
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog('');
      });

    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  badHistoryList
  openModalBadHistory(badHistoryList){
    this.badHistoryList = badHistoryList;
    $('#modal-bad-history').modal('show');
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
