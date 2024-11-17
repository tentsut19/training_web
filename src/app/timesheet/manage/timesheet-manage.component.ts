import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CommonService, Constant, EmployeeService, UploadFilesService, CustomerService, MasterDataService } from 'src/app/shared';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { TimesheetService } from 'src/app/shared/service/timesheet.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timesheet-manage',
  templateUrl: './timesheet-manage.component.html',
  styleUrls: ['./timesheet-manage.component.css']
})
export class TimeSheetManageComponent implements OnInit { 

  tisToken: any = null;
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  isApprover = false;
  isUpdate = true;
  isAdd = true;
  submitted_add = false;
  submitted_edit = false;
  submitted_search = false;
  masterDataList = [];
  yearList;
  tmpEmpSelect = [];
  optionleDate: any = {
    locale: {
      format: 'DD/MM/YYYY', // กำหนดรูปแบบวันที่
      daysOfWeek: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'], // วันในสัปดาห์ภาษาไทย
      monthNames: [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ],
      firstDay: 1 // เริ่มต้นสัปดาห์ที่วันจันทร์
    },
    alwaysShowCalendars: false,
    singleDatePicker: false
  }; 
  startDate;
  startDateStr;
  endDate;
  endDateStr;
  optionleAddDate: any = {
    locale: {
      format: 'DD/MM/YYYY', // กำหนดรูปแบบวันที่
      daysOfWeek: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'], // วันในสัปดาห์ภาษาไทย
      monthNames: [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ],
      firstDay: 1 // เริ่มต้นสัปดาห์ที่วันจันทร์
    },
    alwaysShowCalendars: false,
    singleDatePicker: true
  }; 
  addDate;
  addDateStr;
  uploadTmpList = [];
  timesheetList = [];
  employeeId;
  employee: any;
  currentId;
  timesheet: any;
  timesheetDetailList = [];

  dropdownSettings = {};

  //Employee Filtered
  public employeeCtrl: FormControl = new FormControl();
  public employeeFilterCtrl: FormControl = new FormControl();
  public filteredEmployeeList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyEmployee = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private uploadService: UploadFilesService,
    private commonService: CommonService,
    private timesheetService: TimesheetService,
    private customerService: CustomerService,
    private masterDataService: MasterDataService,
    private activatedRoute: ActivatedRoute,
    private constant: Constant
    ) { 
      this.searchForm = fb.group({
        'employee_id': ['',Validators.required],
        'type': ''
      });
      this.addForm = fb.group({
        'employee_id': [''],
        'work_date': [''],
        'type': ['',Validators.required],
        'details': ['']
      });
      this.editForm = fb.group({
        'employee_id': [''],
        'work_date': [''],
        'work_date_display': [''],
        'type': ['',Validators.required],
        'details': [''],
        'id': [''],
      });
      this.isApprover = this.constant.APPROVER_TIMESHEET;
   }

  ngOnInit() {
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      // selectAllText: '',
      // unSelectAllText: '',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    //this.getMasterDataActive();
    //this.search(this.searchForm.value);
    this.formDataEmployee = new FormGroup({
      valueSelect: new FormControl("")
    });
    this.getCustomer();
    this.getMainTopic();
    this.getAllForDropDownEmployee();
    this.generateYearList();
    //initail date
    this.addDate = new Date();
    this.addDateStr = this.getDateStr(this.addDate);
    this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.endDate = new Date();

    //get params
    this.activatedRoute.params.forEach((urlParams) => {
      this.employeeId = urlParams['id'].replace('#', '');
      console.log("employeeId : "+this.employeeId); 
      if(this.employeeId != 0){
        this.searchForm.patchValue({
          employee_id: this.employeeId,
        });
        this.getEmployeeById(this.employeeId);
        this.search();
      }
      var tisToken = JSON.parse(localStorage.getItem('tisToken'));
      console.log(tisToken)
      if(tisToken.id != this.employeeId){
        this.isUpdate = false;
        this.isAdd = false;
      }
      console.log(this.isUpdate)
      console.log(this.isAdd)
    });
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

  selectMainTopic(mainIndex,subIndex){
    var mainTopicId = this.timesheetDetailList[mainIndex].timesheetSubDetailList[subIndex].mainTopicId;
    this.masterDataService.getSubTopicByMainTopic(mainTopicId).subscribe(res=>{
      console.log(res);
      this.timesheetDetailList[mainIndex].timesheetSubDetailList[subIndex].subTopicMasterList = res;
      console.log(this.timesheetDetailList);
    }, error => {
      console.error(error);
    });
  }

  customerList = new Array();
  isShowCustomer = false;
  getCustomer(){
    this.customerService.getCustomerForDropDown().subscribe(datas=>{
      console.log(datas);
      this.isShowCustomer = true;
      this.customerList = datas;
    }, err => {
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  onSelect(event,value) {
    console.log(event);
    console.log(value);
  }

  onDeSelect(value) {
    console.log(value);
  }

  selectedFiles: FileList;
  selectFiles(event) {
    this.message = ''
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    for (var i = 0; i < event.target.files.length; i++) {
      var file = event.target.files[i];
      if (!validImageTypes.includes(file.type)) {
        this.message = `ประเภทไฟล์ไม่ถูกต้อง: ${file.name} โปรดเลือกไฟล์รูปภาพ`;
        return;
      }
    }
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  uploadFiles(mainIndex,subIndex) {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.uploadFileTimesheet(i, this.selectedFiles[i],mainIndex,subIndex);
    }
  }

  uploadFileTimesheet(idx, file,mainIndex,subIndex) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    var formData: FormData = new FormData();
    console.log(file);
    formData.append('file', file);

    this.uploadService.uploadFileTimesheet(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          if(this.progressInfos[idx]){
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          }
        } else if (event instanceof HttpResponse) {
          $('#modal-upload').modal('hide');
          console.log(event);
          if(event.body.code === "success" && event.body.data){
            var uuid = event.body.data.uuid
            var url = event.body.data.url
            this.progressInfos = []
            this.selectedFiles = null
            var subDetail = {
              url:url
            }
            this.timesheetDetailList[mainIndex].timesheetSubDetailList[subIndex].fileList.push(subDetail);
          }
        }
      },
      err => {
        if(this.progressInfos[idx]){
          this.progressInfos[idx].value = 0;
        }
        this.message = 'Could not upload the file:' + file.name;
        console.log(err);
      });
  }

  openModalAdd(){
    this.timesheetDetailList = [];
    $('#modal-timesheet-add').modal('show');
  }

  getEmployeeById(id){
    this.employeeService.getEmployeeByIdV2(id).subscribe(res=>{
      console.log(res);
      this.employee = res;
    })
  }

  generateYearList(){
    this.yearList = this.commonService.generateYearList();
  }

  formDataEmployee: FormGroup;
  isShowEmployee = false;
  getAllForDropDownEmployee(){
    this.spinner.show();
    this.employeeService.getInternalEmployee().subscribe(datas=>{
      //console.log(datas);

      this.employeeList = Object.keys(datas).length === 0 ? [] : datas;
      // load the initial bank list
      this.filteredEmployeeList.next(this.employeeList.slice());

      // listen for search field value changes
      this.employeeFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyEmployee))
        .subscribe(() => {
          this.filterEmployee();
      });

      setTimeout(() => {
        this.isShowEmployee = true;

        this.formDataEmployee
        .get("valueSelect")
        .setValue(0);

        this.spinner.hide();
      }, 100);

    }, err => {
      this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  employeeList = [];
  protected filterEmployee() {
    if (!this.employeeList) {
      return;
    }
    // get the search keyword
    let search = this.employeeFilterCtrl.value;
    if (!search) {
      this.filteredEmployeeList.next(this.employeeList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredEmployeeList.next(
      this.employeeList.filter(x => (x.first_name+" "+x.last_name).toLowerCase().indexOf(search) > -1)
    );
  }

  changeEmployee(data){
    console.log(data);
    this.employee = data;
    this.searchForm.patchValue({
      employee_id: data.id,
    });
    console.log(this.searchForm.value)
    this.search();
  }

  /*clickedSearch(){
    console.log('click search');
    this.employee = null;
    this.search();
  }*/

  search(){
    console.log('search');
    this.submitted_search = true;
    if(this.searchForm.invalid){
      return;
    }
    this.spinner.show();
    let criteria = this.searchForm.value;
    criteria = {
      ...criteria,
      startDate: this.startDate ? this.convertToDateSearch(this.startDate) : null,
      endDate:this.endDate ? this.convertToDateSearch(this.endDate) : null
    }
    console.log(criteria);
    this.spinner.show();
    this.timesheetService.searchByCriteria(criteria).subscribe(res => {
      console.log(res);
      this.timesheetList = [];
      let datas = res.data;
      for (let day = new Date(this.startDate); day <= this.endDate; day.setDate(day.getDate() + 1)) {
        let isDupDate = false;
        let dupIndex = 0;
        for(let i=0; i<datas.length;i++){
          if(datas[i].work_date.split(' ')[0] === this.convertToDateSearch(day)){
            isDupDate = true;
            dupIndex = i;
          }
        }
        if(isDupDate){
          this.timesheetList.push(datas[dupIndex]);
        }else if(this.searchForm.value.type === '' && (day <= new Date())){
          this.timesheetList.push({work_date: this.convertToDateSearch(day), type: undefined});
        }
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  saveTimesheet(value){
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    if(this.tisToken){
      value['employee_id'] = this.tisToken.id;
    }
    if(this.addDate){
      let splitAddDate = this.addDateStr.split('-');
      value['work_date'] = splitAddDate[2]+'-'+splitAddDate[1]+'-'+splitAddDate[0];
    } 

    let isValid = true;
    this.timesheetDetailList.forEach(item => {
      console.log(item)
      if(typeof item.customer === 'undefined' || item.customer.length == 0){
        this.warningDialog('กรุณาเลือกหน่วยงาน','');
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    value['timesheetDetailList'] = this.timesheetDetailList;
    console.log(value);
    this.spinner.show();
    this.timesheetService.createOrUpdate(value).subscribe(data=>{
      this.spinner.hide();
      $('#modal-timesheet-add').modal('hide');
      console.log(data);
      this.successDialog();
      this.search();
    }, error => {
      this.spinner.hide();
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.warningDialog(error_message,'');
    });
  }

  message: string = '';
  uploadFile(data, file, name, fileInfoMap,docId, seq) {
    console.log(file);
    this.progressInfos[0] = { value: 0, fileName: file.name };
    var formData: FormData = new FormData();
    console.log(file);
    formData.append('file', file);
    formData.append('type', "timesheet");
    formData.append('timesheet_id', data.id);
    formData.append('name', name);
    formData.append('docId', docId);
    formData.append('seq', seq);

    this.uploadService.upload(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[0].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log(event);
          if(event.body.code === "success" && event.body.data){
            //this.successDialog();
            //this.getProject();
          }
        }
      },
      err => {
        this.progressInfos[0].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(err); 
      });
  }

  openModalDelete(id){
    this.currentId = id;
    console.log('id',this.currentId);
    $('#modal-delete-timesheet').modal('show');
  }

  delete(currentId){
    this.spinner.show();
    this.timesheetService.deleteTimesheet(currentId).subscribe(res=>{
      console.log(res);
      this.spinner.hide();
      $('#modal-delete-timesheet').modal('hide');
      this.successDialog();
      this.search();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  progressInfos = []
  selectedFile1: any
  selectedFile2: any
  selectedFile3: any
  selectFile(event, type) {
    this.progressInfos = [];
    if(type === 1){
      this.selectedFile1 = event.target.files[0];
    }else if(type === 2){
      this.selectedFile2 = event.target.files[0];
    }else if(type === 3){
      this.selectedFile3 = event.target.files[0];
    }
    //this.selectedFile = event.target.files[0];
    console.log(this.selectedFile1);
    console.log(this.selectedFile2);
    console.log(this.selectedFile3);
  }

  selectedFileEdit1: any
  selectedFileEdit2: any
  selectedFileEdit3: any
  selectEditFile(event, type) {
    this.progressInfos = [];
    if(type === 1){
      this.selectedFileEdit1 = event.target.files[0];
    }else if(type === 2){
      this.selectedFileEdit2 = event.target.files[0];
    }else if(type === 3){
      this.selectedFileEdit3 = event.target.files[0];
    }
    //this.selectedFile = event.target.files[0];
    console.log(this.selectedFileEdit1);
    console.log(this.selectedFileEdit2);
    console.log(this.selectedFileEdit3);
  }

  export(){
    console.log('export');
    this.submitted_search = true;
    if(this.searchForm.invalid){
      return;
    }
    this.spinner.show();
    let criteria = this.searchForm.value;
    let timesheetList = JSON.parse(JSON.stringify(this.timesheetList));
    timesheetList.forEach(item => {
      if(item.work_date) {
        item.work_date = this.displayWorkDate(item.work_date);
      }
      if(!item.type) {
        item.type = "";
      }
      if(!item.details) {
        item['details'] = "";
      }
      if(item.updated_at) {
        item['updated_at'] = this.displayUpdateDate(item['updated_at']);
      }else{
        item['updated_at'] = "";
      }
    });
    criteria = {
      ...criteria,
      startDate: this.startDate ? this.convertToDateSearch(this.startDate) : null,
      endDate:this.endDate ? this.convertToDateSearch(this.endDate) : null,
      timesheetList: timesheetList
    }
    console.log(criteria);
    const parentThis = this;
    this.timesheetService.export(criteria).subscribe(res=>{
      parentThis.spinner.hide();
      window.open(res.data);
    });
  }


  fileEdit1: any
  fileEdit2: any
  fileEdit3: any
  openModalEdit(id,work_date){
    console.log(id);
    this.timesheetDetailList = [];
    if(id){
      this.spinner.show();
      this.timesheetService.getTimesheetDetailById(id).subscribe(res=>{
        console.log(res);
        this.timesheet = res;
        this.timesheetDetailList = res.timesheetDetailList;
        var workDate = work_date;
        if(res.workDate){
          workDate = res.workDate;
        }
        this.editForm.patchValue({
          employee_id: res.employeeId, 
          work_date: res.workDate,
          work_date_display: res.workDateDisplay,
          type: res.type, 
          details: res.details,
          id: res.id
        }); 
        this.spinner.hide();
        $('#modal-timesheet-edit').modal('show');
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog(error);
      }); 
    }else{
      this.editForm.patchValue({
        employee_id: this.tisToken.id, 
        work_date: work_date,
        type: "", 
        details: "",
      }); 
      $('#modal-timesheet-edit').modal('show');
    }

    
  }

  updateTimesheet(value){
    console.log('updateTimesheet');
    console.log(value);
    //return;
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }

    let isValid = true;
    this.timesheetDetailList.forEach(item => {
      console.log(item)
      if(typeof item.customer === 'undefined' || item.customer.length == 0){
        this.warningDialog('กรุณาเลือกหน่วยงาน','');
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    value['timesheetDetailList'] = this.timesheetDetailList;
    console.log(value);
    this.spinner.show();
    this.timesheetService.createOrUpdate(value).subscribe(data=>{
      this.spinner.hide();
      $('#modal-timesheet-edit').modal('hide');
      console.log(data);
      this.successDialog();
      this.search();
    }, error => {
      this.spinner.hide();
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.warningDialog(error_message,'');
    });
  }

  selectedDate(value: any, datepicker?: any) {
    //start date
    this.startDate = value.start._d;
    this.startDateStr = this.getDateStr(this.startDate);
    console.log(this.startDateStr);
    //end date
    this.endDate = value.end._d;
    this.endDateStr = this.getDateStr(this.endDate);
    console.log(this.endDateStr);
  }

  selectedAddDate(value: any, datepicker?: any) {
    this.addDate = value.start._d;
    this.addDateStr = this.getDateStr(this.addDate);
    console.log(this.startDateStr);
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  convertToDateSearch(date){
    //console.log(date);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  displayWorkDate(date){
    if(date){
      let splitDate = date.split(' ')[0].split('-');
      return splitDate[2] + '-' + this.commonService.convertMonthTH(splitDate[1]) + '-' + splitDate[0];
    }
    return "-";
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

  isAccess(){
    //console.log(this.employeeId)
    if(this.employeeId == 0){
      return true;
    }
    return false;
  }

  // isDelete(data){
  //   if(!data.type){
  //     return false;
  //   }
  //   let dateCompare = new Date(new Date().setDate(new Date().getDate() - 6));
  //   if(new Date(data.work_date).setHours(0, 0, 0, 0) <= dateCompare.setHours(0, 0, 0, 0)){
  //     return false;
  //   }
  //   return true;
  // }

  // isEdit(data){
  //   if(!data.type){
  //     return false;
  //   }
  //   let dateCompare = new Date(new Date().setDate(new Date().getDate() - 6));
  //   if(new Date(data.work_date).setHours(0, 0, 0, 0) <= dateCompare.setHours(0, 0, 0, 0)){
  //     return false;
  //   }
  //   return true;
  // }

  addTimesheetDetail(){
    console.log('addTimesheetDetail')
    this.timesheetDetailList.push(
      {
        timesheetSubDetailList:[]
      }
    );
  }

  remoteTimesheetDetail(index){
    this.timesheetDetailList.splice(index, 1);
  }

  addTimesheetSubDetail(index){
    this.timesheetDetailList[index].timesheetSubDetailList.push({
      mainTopicId:'',
      subTopicId:'',
      description:'',
      fileList:[],
      subTopicMasterList:[]
    });
  }

  remoteTimesheetSubDetail(i,index){
    this.timesheetDetailList[i].timesheetSubDetailList.splice(index, 1);
  }

  remoteFileList(mainIndex,subIndex,fileIndex){
    this.timesheetDetailList[mainIndex].timesheetSubDetailList[subIndex].fileList.splice(fileIndex, 1);
  }

  updateApprover(id,status){
    $('#modal-timesheet-edit').modal('hide');
    if(status == "A"){
      Swal.fire({
        title: "ยืนยันอนุมัติ",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: `ยกเลิก`
      }).then((result) => {
        console.log(result)
        if(result.value){
          var value = {
            id: id,
            status: status,
            reason: ''
          }
          this.spinner.show();
          this.timesheetService.patchStatus(value).subscribe(data=>{
            this.spinner.hide();
            console.log(data);
            this.search();
            return data;
          }, error => {
            this.spinner.hide();
            console.error(error);
            this.failDialog(error);
          });
        }
      });
    }else{
      Swal.fire({
        title: "ใส่เหตุผลที่ไม่อนุมัติ",
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: `ยกเลิก`,
        showLoaderOnConfirm: true,
        preConfirm: async (data) => {
          console.log(data)
          var value = {
            id: id,
            status: status,
            reason: data,
          }
          this.spinner.show();
          this.timesheetService.patchStatus(value).subscribe(data=>{
            this.spinner.hide();
            console.log(data);
            this.search();
            return data;
          }, error => {
            this.spinner.hide();
            console.error(error);
            this.failDialog(error);
            return data;
          });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        console.log(result)
      });
    }
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
