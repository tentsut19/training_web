import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, ReportService, FileManagerService, 
  MailService, CustomerService, BadHistoryService, ReasonLeaveWorkService,
  CommonService,RemarkEmployeeService,CostEquipmentService ,
  CheckPointService, PermWorkRecordService} from '../../shared';
import { Constant } from '../../shared/constant';
import * as fileSaver from 'file-saver';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee_view.component.html',
  styleUrls: ['./employee_view.component.css']
})
export class EmployeeViewComponent implements OnInit {

  options: any = {
    locale: { format: 'MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  searchForm: FormGroup;
  yearList;
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

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private constant: Constant,
    private costEquipmentService: CostEquipmentService,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private reportService: ReportService,
    private mailService: MailService,
    private badHistoryService: BadHistoryService,
    private reasonLeaveWorkService: ReasonLeaveWorkService,
    private fileManagerService: FileManagerService,
    private commonService: CommonService,
    private remarkEmployeeService: RemarkEmployeeService,
    private checkPointService: CheckPointService,
    private permWorkRecordService: PermWorkRecordService, 
  ) { 
    this.searchForm = fb.group({
      'month':'1-0',
      'year': [new Date().getFullYear()],
      'customerId': [''],
    });
  }
  isHr = false;
  
  ngOnInit() {
    this.personnel = JSON.parse(localStorage.getItem('tisToken'));
    this.generateYearList();
    this.getGuard();
    this.getCustomer();
    //get params
    this.activatedRoute.params.forEach((urlParams) => {
      this.employeeId = urlParams['id'].replace('#', '');
      console.log("employeeId : "+this.employeeId);
      
      if(this.personnel && this.personnel.position 
        && (this.personnel.position.id == 4 
          || this.personnel.position.id == 5
          || this.personnel.position.id == 21
          || this.personnel.position.id == 22
          )){
        this.isGuard = true
      }
      if(this.personnel.position.id == 8 || this.personnel.id == 130){
        this.isHr = true
      }

      this.getEmployee(this.employeeId);
    });
  } 

  generateYearList(){
    this.yearList = [];
    let currentYear = new Date().getFullYear();
    console.log('currentYear : ' + currentYear);
    //generate next 3 year
    for(let i=0;i<5;i++){
      let year = 
      {
        'enYear':currentYear-i,
        'thYear':(currentYear-i) + 543
      };
      this.yearList.push(year);
    }
  } 

  searchCheckPoint(obj){
    this.spinner.show();
    this.checkPointModel = {
      'peroid':'06-01-2022',
      'customerList':[]
    };
    this.checkPointRecheck = [];
    this.dayList = [];

    let splitMonth = this.searchForm.get('month').value.split('-');
    this.peroidMonth = splitMonth[0];
    this.peroidType = splitMonth[1];
    let dateStart = 1;
    let dateEnd = 15;
    if(this.peroidType == 1){
      dateStart = 16;
      dateEnd = 31;
    }
    for(let i=dateStart;i<=dateEnd;i++){
      this.dayList.push(i);
    }
    let month = splitMonth[0];
    let checkPoint = {
      'month':month,
      'year':this.searchForm.get('year').value
    };
    console.log(checkPoint)
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      console.log(data);
      if(data.data != null){
        this.checkPointModel = JSON.parse(data.data['json_data']);
        this.checkPointModelCompare = this.checkPointModel;
        console.log(this.checkPointModel);
        for(let i=0;i<this.checkPointModel.customerList.length;i++){
          for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
            let employee = this.checkPointModel.customerList[i].employeeList[j];
            let emps = this.employeeList.filter(emp => emp.id == employee.employeeId);
            if(emps.length>0 && emps[0].id == this.employeeId){
              let alreadyHasEmp = false;
              for(let k=0;k<this.checkPointRecheck.length;k++){
                if(this.checkPointRecheck[k].id == emps[0].id){
                  alreadyHasEmp = true;
                }
              }
              if(!alreadyHasEmp){
                this.checkPointRecheck.push(emps[0]);
              }
            }
          }
        }
        console.log(this.checkPointRecheck)
        for(let k=0;k<this.checkPointRecheck.length;k++){
          let customerWorkList = [];
          for(let i=0;i<this.checkPointModel.customerList.length;i++){
            for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
              if(this.checkPointModel.customerList[i].employeeList[j].employeeId == this.checkPointRecheck[k].id){
                let workList = [];
                for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
                  let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                  if(workItem.date >= dateStart && workItem.date <= dateEnd){
                    workList.push(workItem);
                  }
                }
                let obj = {
                  'customerId':this.checkPointModel.customerList[i].customerId,
                  'customerName':this.checkPointModel.customerList[i].customerName,
                  'workList':workList
                }
                customerWorkList.push(obj);
              }
            }
          }
          this.checkPointRecheck[k]['customerWorkList'] = customerWorkList;
        }
        
        console.log(this.checkPointRecheck);
        this.spinner.hide();
      }else{
        this.spinner.hide();
      }
    });
  }

  getGuard(){
    this.employeeList = [];
    this.permWorkRecordService.getGuard().subscribe(res=>{
      this.employeeList = res;
      //console.log(this.employeeList);
    });
  }

  //customerList;
  getCustomer(){
    this.customerList = [];
    this.customerService.getCustomer().subscribe(res=>{
      this.customerList = res;
    });
  }

  descOrder = (a, b) => {
    console.log(a.key + " < " + b.key);
    if (a.key < b.key) return b.key;
  }
  
  date_of_birth;
  expired_card;
  start_work;
  leave_work;
  badHistoryList;
  reasonLeaveWorkList;
  recommender;
  costEquipmentList;
  getEmployee(employeeId){
    this.spinner.show();
    this.costEquipmentService.getByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      if(data.length > 0){
        this.costEquipmentList = data;
      }
    }, error => {
      // this.addCostEquipmentList()
      console.error(error);
    });
    this.fileManagerService.getByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      data.forEach((val) => {
        this.fileInfoMap.set(val.id,val);
      });
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
    this.fileManagerService.getImportantDocumentByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      data.forEach((val) => {
        this.fileImportantMap.set(val.id,val);
      });
    }, error => {
      console.error(error);
    });
    this.badHistoryService.getByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      this.badHistoryList = data;
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
    this.reasonLeaveWorkService.getByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      this.reasonLeaveWorkList = data;
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
    this.remarkEmployeeService.getRemarkByEmplyeeId(employeeId).subscribe(data =>{
      this.remarkList = data;
      try{
        this.remarkList.forEach(value => {
          //value['isDeleted'] = false;
        });
      }catch(ex){
        this.remarkList = [];
      } 
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
     
    this.employeeService.getEmployeeById(employeeId).subscribe(data => {
      if(data.recommender){
        this.recommender = data.recommender
      }
      this.employee = data;
      this.employee.date_of_birth = this.commonService.getDateThNotimeDDMMYYYY2(this.employee.date_of_birth);
      this.employee.expired_card = this.commonService.getDateThNotimeDDMMYYYY2(this.employee.expired_card);
      this.employee.start_work = this.commonService.getDateThNotimeDDMMYYYY2(this.employee.start_work);
      this.employee.leave_work = this.commonService.getDateThNotimeDDMMYYYY2(this.employee.leave_work);
      this.employee.permit_card_start_date = this.commonService.getDateThNotimeDDMMYYYY2(this.employee.permit_card_start_date);
      this.employee.permit_card_end_date = this.commonService.getDateThNotimeDDMMYYYY2(this.employee.permit_card_end_date);
      this.urlProfile = data.url;
      console.log(data);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  exportProfile(){
    console.log(this.exportType);
    console.log(this.customPosition);

    let param = {'employee_id':this.employeeId,'exportType':this.exportType,'position':this.customPosition};
    console.log(param);
    $('#modal-export-file').modal('hide');
    this.spinner.show();
    this.reportService.reportEmployeeProfile(param).subscribe(data=>{
        console.log(data);
        window.open(data);
        this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  openModelexportDocument(){
    $('#modal-export-document').modal('show');
    this.reSetFileInfoMap()
  }

  openModelMergeDocument(){
    console.log(this.fileInfoMap);
    this.isEmployeeProfile = false
    $('#modal-merge-document').modal('show');
    this.reSetFileInfoMap()
  }
  
  reSetFileInfoMap(){
    if(this.fileInfoMap.size > 0){
      this.fileInfoMap.forEach(val => {
        val.checked = false
      });
    }
  }

  exportType = true;
  customPosition = "พนักงานรักษาความปลอดภัย";
  openModalExportFile(){
    console.log(this.exportType);
    console.log(this.customPosition);
    $('#modal-export-file').modal('show');
  }

  documents = []
  exportDocument(){
    this.documents = [];
    if(this.fileInfoMap.size == 0){
      this.sendDocument();
    }
    var index = 1;
    this.fileInfoMap.forEach(val => {
      if(val.checked){
        this.documents.push(val.id);
      }

      if(this.fileInfoMap.size == index){
        this.sendDocument();
      }
      index++;
    });
  }


  getCustomerEmail(value){
    console.log(value);
    if(value == ""){
      this.customerEmail = "";
    }else{
      let customerFill = this.customerList.filter(c => c.id = value);
      this.customerEmail = customerFill[0].email;
    }
  }

  sendDocument(){
    if(this.validateCustomer()){
      return
    }
    var param = {};
    param["customer_id"] = this.customerId;
    param["employee_id"] = this.employeeId;
    param["position"] = this.customPosition;
    param["file_ids"] = this.documents;
    param["customer_email"] = this.customerEmail;
    console.log(param);
    this.spinner.show();
    this.mailService.sendMailEmployee(param).subscribe(data=>{
      console.log(data);
      this.spinner.hide();
      Swal.fire("ทำรายการสำเร็จ!", "", "success");
      $('#modal-export-document').modal('hide');
    }, error => {
      $('#modal-export-document').modal('hide');
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  validateCustomer(){
    if(this.customerId){
      this.invalid_customer = false;
      return false;
    }else{
      this.invalid_customer = true;
      return true;
    }
  }

  selectDocument(docId){
    var isPush = true
    if(this.documents.length > 0){
      for(let i=0;i<this.documents.length;i++){
        console.log(this.documents[i]+'=='+docId)
        if(this.documents[i] == docId){
          this.documents.splice(i,1);
          isPush = false
        }
        if((this.documents.length-1) == i){
          console.log('==last==')
          break
        }
      }
      if(isPush){
        this.documents.push(docId);
      }
    }else{
      this.documents.push(docId);
    }
  }

  mergeDocument(){
    // this.documents = [];
    // if(this.isEmployeeProfile){
    //   this.documents.push(0);
    // }
    // var index = 1;
    // this.fileInfoMap.forEach(val => {
    //   if(val.checked){
    //     this.documents.push(val.id);
    //   }

    //   if(this.fileInfoMap.size == index){
    //     this.mergeDocumentToPdf();
    //   }
    //   index++;
    // });

    console.log(this.documents);
    this.mergeDocumentToPdf();
  }

  mergeDocumentToPdf(){
    if(this.documents.length == 0){
      this.warningDialog('กรุณาเลือกเอกสาร','');
      return
    }
    var param = {};
    param["employee_id"] = this.employeeId;
    param["file_ids"] = this.documents;
    param["position"] = this.customPosition;
    console.log(param);
    this.spinner.show();
    this.reportService.reportMergeDocument(param).subscribe(data=>{
      console.log(data);
      // window.open(this.constant.API_ENDPOINT + '/report/download-pdf/'+this.employeeId);
      window.open(data.url);
      this.spinner.hide();
      Swal.fire("ทำรายการสำเร็จ!", "", "success");
      $('#modal-merge-document').modal('hide');
      setTimeout(() => {location.reload();}, 1000);
    }, error => {
      $('#modal-merge-document').modal('hide');
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  exportInspection(){
    this.spinner.show();
    var req = {
      "uuid":"",
      "employeeId":this.employeeId
    }
    this.reportService.genReportInspection(req).subscribe(resp => {
      console.log(resp);
      this.spinner.hide();
      setTimeout(() => {
        window.open(resp.url, '_blank');
      }, 100);
    }, err => {
      this.spinner.hide();
      this.failDialog('');
    });
  }

  exportContractAudit(){
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

  employeePosition = "";
  openModalExportEmployeeCard(){
    console.log(this.employeePosition);
    $('#modal-export-employee-card').modal('show');
  }

  createEmployeeCardReport(){
    this.spinner.show();
    var req = {
      "id":this.employeeId,
      "employeePosition":this.employeePosition
    }
    this.reportService.createEmployeeCardReport(req).subscribe(resp => {
      $('#modal-export-employee-card').modal('hide');
      this.spinner.hide();
      console.log(resp);
      window.open(resp.url, '_blank');
    }, err => {
      this.spinner.hide();
      this.failDialog('');
    });
  }

  openModalExportPermitCard(){
    this.spinner.show();
    var req = {
      "id":this.employeeId
    }
    this.reportService.createPermitCard(req).subscribe(resp => {
      this.spinner.hide();
      console.log(resp);
      window.open(resp.url, '_blank');
    }, err => {
      this.spinner.hide();
      this.failDialog('');
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

  backToWork(status){
    var value = {};
    if(status == 'D'){
      value['delete_reason_leave_work'] = status;
    }
    this.spinner.show();
    this.employeeService.backToWork(this.employeeId,value).subscribe(data => {
      console.log(data);
      this.spinner.hide();
      this.successDialog();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error.error.data.error_message);
    });
  }

  successDialog(){
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
    setTimeout(() => {location.reload();}, 1000);
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
