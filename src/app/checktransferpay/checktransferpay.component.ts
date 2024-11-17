import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { EmployeeService, CustomerService, 
  PasttimeWorkRecordService, CheckPointService,PermWorkRecordService, SlipService,Constant, ReportService} from '../shared';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomerSeqService } from '../shared/service/customerSeq.service';
interface President {
  Name: string;
  Index: number;
}

@Component({
  selector: 'app-checktransferpay',
  templateUrl: './checktransferpay.component.html',
  styleUrls: ['./checktransferpay.component.css']
})
export class CheckTransferPayComponent implements OnInit { 

  searchForm: FormGroup;
  startDate;
  startDateStr;
  endDate;
  endDateStr;
  customerList =  [];
  employeeList = [];
  checkPointList = [];
  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    //singleDatePicker: true
  }; 
  optionSingleDate: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  }; 

  tisToken;
  customerId = 0;
  paidType = '';
  searchDateType = 'W';

  checkPointModel = {
    'peroid':'06-01-2022',
    'customerList':[]
  };
  customerSeqList = [];

  //สำหรับ เสริม และควง
  extendList = [];
  //วันอาทิตย์
  sundayList = [];
  //pasttime
  pasttimeList = [];
  //bank
  bankCode = '';
  bankList = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private pasttimeWorkRecordService: PasttimeWorkRecordService,
    private checkPointService: CheckPointService,
    private spinner: NgxSpinnerService,
    private permWorkRecordService: PermWorkRecordService,
    private slipService: SlipService,
    private constant: Constant,
    private reportService: ReportService,
    private customerSeqService: CustomerSeqService,
    ) { 
      this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
      this.searchForm = fb.group({
        'startDate': [''],
        'endDate': [''],
        'customer_id': ['']
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
       //get customer
       this.getCustomer();
       this.getGuard();
       //get current date
       this.endDateStr = this.getDateStr(new Date());
       //auto search
       //this.search(this.searchForm.value);
       this.getAllCustomerSeq();
       this.initBank();
  }

  initBank(){
    this.bankList.push(
      {'code':'','name':'ทั้งหมด'},
      {'code':'กรุงไทย','name':'กรุงไทย'},
      {'code':'all','name':'ทุกธนาคาร (ยกเว้นกรุงไทย)'},
      {'code':'กสิกร','name':'กสิกร'},
      {'code':'ไทยพาณิชย์','name':'ไทยพาณิชย์'},
      {'code':'UOB','name':'UOB'},
      {'code':'ออมสิน','name':'ออมสิน'},
      {'code':'TTB','name':'TTB'},
      {'code':'กรุงเทพ','name':'กรุงเทพ'},
      {'code':'กรุงศรีฯ','name':'กรุงศรีฯ'}
      )
  }

  getAllCustomerSeq(){
    this.customerSeqList = [];
    this.customerSeqService.getAllCustomerSeq().subscribe(res=>{
      console.log(res);
      if(res){
        let count = 0;
        res.forEach(item => {
            this.customerSeqList.push({
              id: item.id,
              customer_id: item.customer_id,
              name: item.name,
              seq: count*2
            });
            count++;
        });
        console.log(this.customerSeqList);
      }
    });
  }
  
  getCustomer(){
    this.customerList = [];
    this.customerService.getCustomer().subscribe(res=>{
      this.customerList = res;
      //console.log(this.customerList);
    });
  }

  getGuard(){
    this.spinner.show();
    this.employeeList = [];
    this.permWorkRecordService.getGuard().subscribe(res=>{
      this.spinner.hide();
      this.employeeList = res;
      console.log(this.employeeList);
    });
  }

  search(){
    this.spinner.show();
    if(this.paidType != ''){
        this.extendList = [];
        this.sundayList = [];
        this.pasttimeList = [];

        console.log(this.paidType);
        //start date
        let sDay = this.startDate.getDate();
        console.log(this.startDateStr);
        console.log(sDay);
        
        //end date
        let eDay = this.endDate.getDate();
        console.log(this.endDateStr);
        console.log(eDay);
    
        console.log(this.customerId);
        this.checkPointList=[];
        //let searchParam = {};
        
        console.log(this.startDate.getMonth()+1);
        console.log(this.startDate.getFullYear());
        let checkPoint = {
          'month':this.startDate.getMonth()+1,
          'year':this.startDate.getFullYear(),
        };
        this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
            this.spinner.hide();
            console.log(data);
            if(data.data != null){
                this.checkPointModel = JSON.parse(data.data['json_data']);
                //ควง เสริม
                //let aaList = [];
                if(this.paidType == 'AA'){
                    for(let i=0;i<this.checkPointModel.customerList.length;i++){
                      console.log(this.checkPointModel.customerList[i])
                      for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
                            let aaWorkList = [];
                            for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
                              let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                              if(workItem.date >= sDay && workItem.date <= eDay){
                                if(workItem.status == 'A' 
                                || workItem.status == 'AA'
                                || workItem.status == 'AAD'
                                || workItem.status == 'AAN'
                                || workItem.status == 'AADN'){
                                  console.log(workItem)
                                  let wage = workItem.total;
                                  if(workItem.status == 'AAD'
                                  || workItem.status == 'AAN'
                                  || workItem.status == 'AADN'
                                  ){
                                    if(workItem.day && workItem.nigth){
                                      wage = workItem.total/2;
                                    }
                                  }
                                  if(workItem.status == 'A' || workItem.status == 'AA' || workItem.status == 'AADN'){
                                    if(workItem.day){
                                      aaWorkList.push(
                                        {
                                          'date':workItem.date,
                                          'workType':'D',
                                          'wage':wage,
                                          'paidStatus':workItem.paidStatus,
                                          'dataType':workItem.paidStatus == ''?'NEW':'OLD',
                                          'paidDate':workItem.paidDate
                                        });
                                    }
                                    if(workItem.nigth){
                                      aaWorkList.push(
                                        {
                                          'date':workItem.date,
                                          'workType':'N',
                                          'wage':wage,
                                          'paidStatus':workItem.paidStatus,
                                          'dataType':workItem.paidStatus == ''?'NEW':'OLD',
                                          'paidDate':workItem.paidDate
                                        });
                                    }
                                  }

                                  if(workItem.status == 'AAD'){
                                    if(workItem.day){
                                      aaWorkList.push(
                                        {
                                          'date':workItem.date,
                                          'workType':'D',
                                          'wage':wage,
                                          'paidStatus':workItem.paidStatus,
                                          'dataType':workItem.paidStatus == ''?'NEW':'OLD',
                                          'paidDate':workItem.paidDate
                                        });
                                    }
                                  }

                                  if(workItem.status == 'AAN'){
                                    if(workItem.nigth){
                                      aaWorkList.push(
                                        {
                                          'date':workItem.date,
                                          'workType':'N',
                                          'wage':wage,
                                          'paidStatus':workItem.paidStatus,
                                          'dataType':workItem.paidStatus == ''?'NEW':'OLD',
                                          'paidDate':workItem.paidDate
                                        });
                                    }
                                  }
                                  
                                }
                              }
                            }
                            if(aaWorkList.length>0){
                              let emps = this.employeeList.filter(emp => emp.id == this.checkPointModel.customerList[i].employeeList[j].employeeId);
                              let isPush = false;
                              let bankDetail = emps.length>0?emps[0].bank_account_no:'-';
                              if(this.bankCode != ''){
                                let splitBankDetail = bankDetail.split(' ');
                                if(splitBankDetail.length==2){
                                  if(this.bankCode == 'all'){
                                    if(splitBankDetail[1].trim() == 'กรุงไทย'){
                                      isPush = false;
                                    }else{
                                      isPush = true;
                                    }
                                  }else{
                                    if(this.bankCode == splitBankDetail[1].trim()){
                                      isPush = true;
                                    }
                                  }  
                                }else if(splitBankDetail.length==3){
                                  if(this.bankCode == 'all'){
                                    if(splitBankDetail[2].trim() == 'กรุงไทย'){
                                      isPush = false;
                                    }else{
                                      isPush = true;
                                    } 
                                  }else{
                                    if(this.bankCode == splitBankDetail[2].trim()){
                                      isPush = true;
                                    }
                                  }
                                }
                                if(bankDetail == '-'){
                                  isPush = false;
                                }
                              }else{
                                isPush = true;
                              }
                              if(isPush){
                                this.extendList.push(
                                  {
                                    'customerId':this.checkPointModel.customerList[i].customerId,
                                    'customerName':this.checkPointModel.customerList[i].customerName,
                                    'employeeId':this.checkPointModel.customerList[i].employeeList[j].employeeId,
                                    'employeeName':this.checkPointModel.customerList[i].employeeList[j].firstName
                                    +' '+this.checkPointModel.customerList[i].employeeList[j].lastName,
                                    'itemList':aaWorkList,
                                    'bankDetail':bankDetail,
                                    'totalPaid':0.00
                                  }
                                );
                              }
                            }
                      }
                  }
                  console.log(this.extendList);
                  //sort with config
                  this.extendList.forEach(extend => {
                    let findCust = this.customerSeqList.filter(item => item.customer_id == extend.customerId);
                    if(findCust.length>0){
                      extend['seq'] = findCust[0].id;
                    }else{
                      extend['seq'] = 100000;
                    }
                  });
                  this.extendList = this.extendList.sort((a,b) => a.seq - b.seq);
                } 
                //วันอาทิตย์
                else if(this.paidType == 'S'){
                  for(let i=0;i<this.checkPointModel.customerList.length;i++){
                    console.log(this.checkPointModel.customerList[i].name)
                    for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
                          let aaWorkList = [];
                          for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
                            let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                            if(workItem.date >= sDay && workItem.date <= eDay){
                              if(workItem.status == 'S'){
                                console.log(workItem)
                                if(workItem.day){
                                  aaWorkList.push(
                                    {
                                      'date':workItem.date,
                                      'workType':'D',
                                      'wage':workItem.total,
                                      'paidStatus':workItem.paidStatus,
                                      'dataType':workItem.paidStatus == ''?'NEW':'OLD',
                                      'paidDate':workItem.paidDate
                                    });
                                }
                                if(workItem.nigth){
                                  aaWorkList.push(
                                    {
                                      'date':workItem.date,
                                      'workType':'N',
                                      'wage':workItem.total,
                                      'paidStatus':workItem.paidStatus,
                                      'dataType':workItem.paidStatus == ''?'NEW':'OLD',
                                      'paidDate':workItem.paidDate
                                    });
                                }
                              }
                            }
                          }
                          if(aaWorkList.length>0){
                            let emps = this.employeeList.filter(emp => emp.id == this.checkPointModel.customerList[i].employeeList[j].employeeId);
                            //console.log(this.bankCode)
                            //if(this.checkPointModel.customerList[i].employeeList[j].employeeId ==  2066){
                            let isPush = false;
                            let bankDetail = emps.length>0?emps[0].bank_account_no:'-';
                            if(bankDetail != null){
                              if(this.bankCode != ''){
                                console.log(bankDetail)
                                /*if(bankDetail === null){
                                  console.log('xxx' , emps)
                                }*/
                                let splitBankDetail = bankDetail.split(' ');
                                if(splitBankDetail.length==2){
                                  if(this.bankCode == 'all'){
                                    if(splitBankDetail[1].trim() == 'กรุงไทย'){
                                      isPush = false;
                                    }else{
                                      isPush = true;
                                    }
                                  }else{
                                    if(this.bankCode == splitBankDetail[1].trim()){
                                      isPush = true;
                                    }
                                  } 
                                }else if(splitBankDetail.length==3){
                                  if(this.bankCode == 'all'){
                                    if(splitBankDetail[2].trim() == 'กรุงไทย'){
                                      isPush = false;
                                    }else{
                                      isPush = true;
                                    }
                                  }else{
                                    if(this.bankCode == splitBankDetail[2].trim()){
                                      isPush = true;
                                    }
                                  }
                                }
                                if(bankDetail == '-'){
                                  isPush = false;
                                }
                              }else{
                                isPush = true;
                              }
                            }

                            if(isPush){
                              this.sundayList.push(
                                {
                                  'customerId':this.checkPointModel.customerList[i].customerId,
                                  'customerName':this.checkPointModel.customerList[i].customerName,
                                  'employeeId':this.checkPointModel.customerList[i].employeeList[j].employeeId,
                                  'employeeName':this.checkPointModel.customerList[i].employeeList[j].firstName
                                  +' '+this.checkPointModel.customerList[i].employeeList[j].lastName,
                                  'itemList':aaWorkList,
                                  'bankDetail':bankDetail,
                                  'totalPaid':0.00
                                }
                              );
                            }
                          //}
                          }
                    }
                }
                console.log(this.sundayList);
                //sort with config
                this.sundayList.forEach(sunday => {
                  let findCust = this.customerSeqList.filter(item => item.customer_id == sunday.customerId);
                  if(findCust.length>0){
                      sunday['seq'] = findCust[0].id;
                  }else{
                    sunday['seq'] = 100000;
                  }
                });
                this.sundayList = this.sundayList.sort((a,b) => a.seq - b.seq);
              }
                //past time
                else if(this.paidType == 'PA'){
                  for(let i=0;i<this.checkPointModel.customerList.length;i++){
                    console.log(this.checkPointModel.customerList[i])
                    for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
                          let aaWorkList = [];
                          for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
                            let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                            if(workItem.date >= sDay && workItem.date <= eDay){
                              if(workItem.status == 'PA'){
                                console.log(workItem)
                                if(workItem.day){
                                  aaWorkList.push(
                                    {
                                      'date':workItem.date,
                                      'workType':'D',
                                      'wage':workItem.total,
                                      'paidStatus':workItem.paidStatus,
                                      'dataType':workItem.paidStatus == ''?'NEW':'OLD',
                                      'paidDate':workItem.paidDate
                                    });
                                }
                                if(workItem.nigth){
                                  aaWorkList.push(
                                    {
                                      'date':workItem.date,
                                      'workType':'N',
                                      'wage':workItem.total,
                                      'paidStatus':workItem.paidStatus,
                                      'dataType':workItem.paidStatus == ''?'NEW':'OLD',
                                      'paidDate':workItem.paidDate
                                    });
                                }
                              }
                            }
                          }
                          if(aaWorkList.length>0){
                            let emps = this.employeeList.filter(emp => emp.id == this.checkPointModel.customerList[i].employeeList[j].employeeId);
                            let isPush = false;
                            let bankDetail = emps.length>0?emps[0].bank_account_no:'-';
                            if(this.bankCode != ''){
                              let splitBankDetail = bankDetail.split(' ');
                              if(splitBankDetail.length==2){
                                if(this.bankCode == 'all'){
                                  if(splitBankDetail[1].trim() == 'กรุงไทย'){
                                    isPush = false;
                                  }else{
                                    isPush = true;
                                  }
                                }else{
                                  if(this.bankCode == splitBankDetail[1].trim()){
                                    isPush = true;
                                  }
                                } 
                              }else if(splitBankDetail.length==3){
                                if(this.bankCode == 'all'){
                                  if(splitBankDetail[2].trim() == 'กรุงไทย'){
                                    isPush = false;
                                  }else{
                                    isPush = true;
                                  }
                                }else{
                                  if(this.bankCode == splitBankDetail[2].trim()){
                                    isPush = true;
                                  }
                                }
                              }
                              if(bankDetail == '-'){
                                isPush = false;
                              }
                            }else{
                              isPush = true;
                            }
                            if(isPush){
                              this.pasttimeList.push(
                                {
                                  'customerId':this.checkPointModel.customerList[i].customerId,
                                  'customerName':this.checkPointModel.customerList[i].customerName,
                                  'employeeId':this.checkPointModel.customerList[i].employeeList[j].employeeId,
                                  'employeeName':this.checkPointModel.customerList[i].employeeList[j].firstName
                                  +' '+this.checkPointModel.customerList[i].employeeList[j].lastName,
                                  'itemList':aaWorkList,
                                  'bankDetail':bankDetail,
                                  'totalPaid':0.00
                                }
                              );
                            }
                          }
                    }
                }
                console.log(this.pasttimeList);
                //sort with config
                this.pasttimeList.forEach(sunday => {
                  let findCust = this.customerSeqList.filter(item => item.customer_id == sunday.customerId);
                  if(findCust.length>0){
                      sunday['seq'] = findCust[0].id;
                  }else{
                    sunday['seq'] = 100000;
                  }
                });
                this.pasttimeList = this.pasttimeList.sort((a,b) => a.seq - b.seq);
              }

            }
        });
    } 
  }

  trigCheckBoxPaidAll($event){
    //check all sunday
    if(this.paidType == 'S'){
      console.log(this.sundayList);
      this.sundayList.forEach(sunday => {
        for(let i=0;i<sunday.itemList.length;i++){
          let item = sunday.itemList[i];
          this.trigCheckBoxWorkPaid(item.workType,sunday.employeeId,sunday.customerId,this.paidType,item.date,$event);
        }
      });
    }
    //check all pasttime
    if(this.paidType == 'PA'){
      console.log(this.pasttimeList);
      this.pasttimeList.forEach(pastime => {
        for(let i=0;i<pastime.itemList.length;i++){
          let item = pastime.itemList[i];
          this.trigCheckBoxWorkPaid(item.workType,pastime.employeeId,pastime.customerId,this.paidType,item.date,$event);
        }
      });
    }

    //check all extends
    if(this.paidType == 'AA' || this.paidType == 'A'){
      console.log(this.extendList);
      this.extendList.forEach(extend => {
        for(let i=0;i<extend.itemList.length;i++){
          let item = extend.itemList[i];
          this.trigCheckBoxWorkPaid(item.workType,extend.employeeId,extend.customerId,this.paidType,item.date,$event);
        }
      });
    }
  }
 
  trigCheckBoxWorkPaid(type,employeeId,customerId,paidType,date,$event){
    console.log($event.target.checked)
    console.log(type)
    console.log(employeeId)
    console.log(customerId)
    let paidDate = '';
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            for(let k=0;k<this.checkPointModel.customerList[i].employeeList[j].workList.length;k++){
              if(this.checkPointModel.customerList[i].employeeList[j].workList[k].date == date){
                if($event.target.checked){
                  this.checkPointModel.customerList[i].employeeList[j].workList[k].paidStatus = 'P';
                  if(this.checkPointModel.customerList[i].employeeList[j].workList[k].paidDate == ''
                  || this.checkPointModel.customerList[i].employeeList[j].workList[k].paidDate == null){
                     this.checkPointModel.customerList[i].employeeList[j].workList[k].paidDate = this.getDateStr(new Date());
                  }
                  paidDate = this.checkPointModel.customerList[i].employeeList[j].workList[k].paidDate;
                }else{
                  this.checkPointModel.customerList[i].employeeList[j].workList[k].paidStatus = '';
                  this.checkPointModel.customerList[i].employeeList[j].workList[k].paidDate = '';
                  paidDate = '';
                }
                console.log(this.checkPointModel.customerList[i].employeeList[j].workList[k]);
              }
            } 
          }
        }
      }
    }
    if(paidType == 'AA'){
      for(let i=0;i<this.extendList.length;i++){
        if(this.extendList[i].customerId == customerId && this.extendList[i].employeeId == employeeId){
          for(let j=0;j<this.extendList[i].itemList.length;j++){
            if(this.extendList[i].itemList[j].date == date){
              if($event.target.checked){
                this.extendList[i].itemList[j].paidStatus = 'P';
                this.extendList[i].totalPaid = this.extendList[i].totalPaid + this.extendList[i].itemList[j].wage;
              }else{
                this.extendList[i].itemList[j].paidStatus = '';
                this.extendList[i].totalPaid = this.extendList[i].totalPaid - this.extendList[i].itemList[j].wage;
              }
              this.extendList[i].itemList[j].paidDate = paidDate;
            }
          }
        }
      }
    }else if(paidType == 'S'){
      for(let i=0;i<this.sundayList.length;i++){
        if(this.sundayList[i].customerId == customerId && this.sundayList[i].employeeId == employeeId){
          for(let j=0;j<this.sundayList[i].itemList.length;j++){
            if(this.sundayList[i].itemList[j].date == date){
              if($event.target.checked){
                this.sundayList[i].itemList[j].paidStatus = 'P';
                this.sundayList[i].totalPaid = this.sundayList[i].totalPaid + this.sundayList[i].itemList[j].wage;
              }else{
                this.sundayList[i].itemList[j].paidStatus = '';
                this.sundayList[i].totalPaid = this.sundayList[i].totalPaid - this.sundayList[i].itemList[j].wage;
              }
              this.sundayList[i].itemList[j].paidDate = paidDate;
            }
          }
        }
      }
    }else if(paidType == 'PA'){
      for(let i=0;i<this.pasttimeList.length;i++){
        if(this.pasttimeList[i].customerId == customerId && this.pasttimeList[i].employeeId == employeeId){
          for(let j=0;j<this.pasttimeList[i].itemList.length;j++){
            if(this.pasttimeList[i].itemList[j].date == date){
              if($event.target.checked){
                this.pasttimeList[i].itemList[j].paidStatus = 'P';
                this.pasttimeList[i].totalPaid = this.pasttimeList[i].totalPaid + this.pasttimeList[i].itemList[j].wage;
              }else{
                this.pasttimeList[i].itemList[j].paidStatus = '';
                this.pasttimeList[i].totalPaid = this.pasttimeList[i].totalPaid - this.pasttimeList[i].itemList[j].wage;
              }
              this.pasttimeList[i].itemList[j].paidDate = paidDate;
            }
          }
        }
      }
    }
  }


  updateCheckPoint(){
    //console.log(this.searchForm.get('month').value)
    let checkPoint = {
      'month':this.startDate.getMonth()+1,
      'year':this.startDate.getFullYear(),
      'json_data':JSON.stringify(this.checkPointModel),
    };
    console.log(checkPoint);
    this.spinner.show();
    this.checkPointService.createUpdateCheckPoint(checkPoint).subscribe(data => {
      console.log(data)
      this.spinner.hide();
      this.successDialog();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  printCashSlip(){
    let title = '';
    let list = [];
    if(this.paidType == 'AA' || this.paidType == 'A'){
      title = 'ประเภทการจ่าย : เสริม / ควง';
      list = this.extendList;
    }else if(this.paidType == 'S'){
      title = 'ประเภทการจ่าย : วันอาทิตย์';
      list = this.sundayList;
    }else if(this.paidType == 'PA'){
      title = 'ประเภทการจ่าย : พาร์สทาม';
      list = this.pasttimeList;
    }

    let startDate = this.startDateStr;
    let endDate = this.endDateStr;
    let fileName = this.randomString(10);
    let request = {
      'title':title,
      'startDate':startDate,
      'endDate':endDate,
      'detail':{'list':list},
      'fileName':fileName
    }
    console.log(request);
    //return; 
    this.spinner.show();
    this.slipService.cashSlip(request).subscribe(res=>{
      console.log(res)
      console.log(res.data); 
      //this.spinner.hide();
      let parentThis = this;
      let url = this.constant.API_ENDPOINT + "/slip/download/cash/"+fileName;  
      setTimeout(function() {
          parentThis.spinner.hide();
          window.open(url); 
      }, 15000);
    });
  } 

randomChar() {
    var index = Math.floor(Math.random() * 62);
    // Generate Number character
    if (index < 10) {
      return String(index);
      // Generate capital letters
    } else if (index < 36) {
      return String.fromCharCode(index + 55);
    } else {
      // Generate small-case letters
      return String.fromCharCode(index + 61);
    }
  }
  
 randomString(length) {
    var result = "";
    while (length > 0) {
      result += this.randomChar();
      length--;
    }
    return result;
  }

  selectedDate(value: any, datepicker?: any) {
    this.startDate = value.start._d;
    this.startDateStr = this.getDateStr(this.startDate);
    console.log(this.startDateStr);
    this.endDate = value.end._d;
    this.endDateStr = this.getDateStr(this.endDate);
    console.log(this.endDateStr);
  }

  selectedDatePaid(type,employeeId,customerId,paidType,date,value: any, datepicker?: any) {
    let startDate = value.start._d;
    let startDateStr = this.getDateStr(startDate);
    console.log(startDateStr);
    console.log(employeeId)
    console.log(customerId)
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            for(let k=0;k<this.checkPointModel.customerList[i].employeeList[j].workList.length;k++){
              if(this.checkPointModel.customerList[i].employeeList[j].workList[k].date == date){
                  //this.checkPointModel.customerList[i].employeeList[j].workList[k].paidStatus = 'P';
                  this.checkPointModel.customerList[i].employeeList[j].workList[k].paidDate = startDateStr;
                  console.log(this.checkPointModel.customerList[i].employeeList[j].workList[k]);
              }
            } 
          }
        }
      }
    }
  }

  searchDateTypeSeleted(type){
    this.searchDateType = type;
    console.log(this.searchDateType);
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  async exportFileBank(){
    this.spinner.show();
    console.log('exportFileBank'); 
    let dataList = [];
    let tmpList = [];
    if(this.paidType == 'S'){
      tmpList = this.sundayList;
    }else if(this.paidType == 'PA'){
      tmpList = this.pasttimeList;
    }else if(this.paidType == 'AA' || this.paidType == 'A'){
      tmpList = this.extendList;
    }
    tmpList.forEach(item => {
      let bankAcc: any = '';
      let splitBankDetail = item.bankDetail.trim().split(' ');
      console.log(splitBankDetail)
      if(splitBankDetail.length >= 2){
        bankAcc = splitBankDetail[0].trim();
      }
      bankAcc = bankAcc.replaceAll('-','');
      dataList.push({
        bankCode: '006',
        recAcc: bankAcc,
        recName: item.employeeName,
        transferAmount: item.totalPaid,
        taxId: '',
        ddaRef1: '',
        ddaRef2: '',
        email: '',
        mobileNo: '',
      })
    });
    let request = {'tisExcelBankTransferItemList': dataList};
    this.reportService.getExcelBankFile(request).subscribe(res=>{
      this.spinner.hide();
      var url = this.constant.API_REPORT_ENDPOINT+"/report/tis/excel/bankFile/get";
      console.log(url);
      window.open(url, '_blank');
    }); 
  }

  urlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    console.log(http.status);
    return http.status==200;
}

  //example https://github.com/SheetJS/sheetjs/issues/121
  //document https://docs.sheetjs.com/docs/demos/frontend/angular/
 
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

}
