import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, ReportService, FileManagerService, 
  MailService, CustomerService, BadHistoryService, ReasonLeaveWorkService,
  CommonService,RemarkEmployeeService,CostEquipmentService ,
  CheckPointService, PermWorkRecordService, SlipService} from '../../shared';
import { Constant } from '../../shared/constant';
import * as fileSaver from 'file-saver';
import { NgxSpinnerService } from "ngx-spinner";
import { AdvMoneyService } from 'src/app/shared/service/advMoney.service';
import { ReplaySubject, Subject } from 'rxjs';
import { CUST, Customer } from 'src/app/guard/permanent/guardCheckPoint/demo-data';
import { MatSelect } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-work-history',
  templateUrl: './work_history.component.html',
  styleUrls: ['./work_history.component.css']
})
export class EmployeeWorkHistoryComponent implements OnInit {

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
  employeeSearchId;
  employees = [];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private constant: Constant,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private checkPointService: CheckPointService,
    private permWorkRecordService: PermWorkRecordService, 
    private slipService: SlipService,
    private advMoneyService: AdvMoneyService
  ) { 
    this.searchForm = fb.group({
      'month':'1-0',
      'year': [new Date().getFullYear()],
      'customerId': [''],
      'employeeId': [''],
    });
  }
  isHr = false;
  
  ngOnInit() {
    this.personnel = JSON.parse(localStorage.getItem('tisToken'));
    this.getDeductExtend005();
    this.generateYearList();
    this.getGuard();
    this.getCustomer();
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
      if(this.personnel.position.id == 8){
        this.isHr = true
      }

      //this.getEmployee(this.employeeId);
    });
  } 

  getGuard(){
    this.employeeList = [];
    this.employees = [];
    this.permWorkRecordService.getGuard().subscribe(res=>{
      this.employeeList = res;
      //console.log(this.employeeList);
      this.employeeList.push(
        {id:0,name:'เลือกพนักงาน'}
      );
      this.employees.push(
        {id:0,name:'เลือกพนักงาน'}
      );

      this.employeeList.forEach(item=>{
        this.employees.push(
          {id:item.id,name:item.first_name +' '+item.last_name}
        )
      });

       // set initial selection
    this.empCtrl.setValue(this.employees[0]);

    // load the initial bank list
    this.filteredEmp.next(this.employees.slice());

    // listen for search field value changes
    this.empFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterEmp();
      });
    });
  } 

  protected filterEmp() {
    if (!this.employees) {
      return;
    }
    if(this.empCtrl.value == null){return;}
    // get the search keyword
    console.log(this.empCtrl.value)
    this.employeeSearchId = this.empCtrl.value['id'];
    let search = this.empFilterCtrl.value;
    console.log(this.employeeSearchId)
    this.employeeId = this.employeeSearchId;
    if (!search) {
      this.filteredEmp.next(this.employees.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredEmp.next(
      this.employees.filter(emp => emp.name.toLowerCase().indexOf(search) > -1)
    );
  }

  getDeductExtend005(){
    this.advMoneyList = [];
    console.log('getDeductExtend005');
    this.advMoneyService.getAll().subscribe(res=>{
      console.log(res);
      this.advMoneyList = res;
    })
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
    console.log('employeeSearchId',this.employeeSearchId);
    this.employeeId = this.employeeSearchId;
    this.isShowSlip = false;
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
                
                //if(this.checkPointModel.customerList[i].employeeList[j].employeeId!=4082){continue;}
              //console.log(this.checkPointModel.customerList[i].employeeList[j])
              let sumSociety = 0.00;
              let employee = this.checkPointModel.customerList[i].employeeList[j];
              let emps = this.employeeList.filter(emp => emp.id == employee.employeeId);
              let customerAuditConfig = null;
              if(emps.length>0){
                if(emps[0].customerAuditConfig && emps[0].customerAuditConfig.length>0){
                  customerAuditConfig = emps[0].customerAuditConfig[0];
                } 
              }
              //console.log('customerAuditConfig')
              //console.log(customerAuditConfig)

              this.checkPointModel.customerList[i].employeeList[j]['bankDetail']=emps.length>0?emps[0].bank_account_no:'-';
              if(!employee.totalIncome){
                this.checkPointModel.customerList[i].employeeList[j]['totalIncome'] = 0.00;
              }
              if(!employee.totalDeduct){
                this.checkPointModel.customerList[i].employeeList[j]['totalDeduct'] = 0.00;
              }
              //check การทำงานช่วย
              let isHH = false;
              for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
                let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                  if(workItem.date >= dateStart && workItem.date <= dateEnd){
                    if(workItem.status == 'HE'){
                      isHH = true;
                    }
                  }
               }  
               this.checkPointModel.customerList[i].employeeList[j]['isHH']=isHH;
  
               if(!isHH){
                  //income list
                  //if(!employee.incomeList){
                    let incomeList = [];
                    if(employee.incomeList){
                      incomeList = employee.incomeList;
                    }
                    let countDay = 0;
                    let priceDay = 0.00;
                    let totalDay = 0.00;
                    let countNigth = 0;
                    let priceNigth = 0.00;
                    let totalNigth = 0.00;
  
                    for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
                      let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                        if(workItem.date >= dateStart && workItem.date <= dateEnd){
                          if(workItem.status == 'W'){
                            if(workItem.day){
                              countDay++;
                              priceDay = Number(workItem.waged);
                              totalDay = totalDay + priceDay;
                              sumSociety = sumSociety + ((priceDay/12)*8);
                            }
                            if(workItem.nigth){
                              countNigth++;
                              priceNigth = Number(workItem.wagen);
                              totalNigth = totalNigth + priceNigth;
                              sumSociety = sumSociety + ((priceNigth/12)*8);
                            }
                          }
                          if(workItem.status == 'AAD'){
                            if(workItem.nigth){
                              countNigth++;
                              priceNigth = Number(workItem.wagen);
                              totalNigth = totalNigth + priceNigth;
                              sumSociety = sumSociety + ((priceNigth/12)*8);
                            }
                          }
                          if(workItem.status == 'AAN'){
                            if(workItem.day){
                              countDay++;
                              priceDay = Number(workItem.waged);
                              totalDay = totalDay + priceDay;
                              sumSociety = sumSociety + ((priceDay/12)*8);
                            }
                          }
  
                        }
                    }
                    let isOld = false;
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '001'){
                        incomeList[countInloop] = {'code':'001','name':'ค่าแรง(D)','quantity':countDay,'price':priceDay,'total':totalDay,'editType':0,'incomeType':'FIX'};
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'001','name':'ค่าแรง(D)','quantity':countDay,'price':priceDay,'total':totalDay,'editType':0,'incomeType':'FIX'});
                    }
                    isOld = false;
  
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '002'){
                        incomeList[countInloop] = {'code':'002','name':'ค่าแรง(N)','quantity':countNigth,'price':priceNigth,'total':totalNigth,'editType':0,'incomeType':'FIX'};
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'002','name':'ค่าแรง(N)','quantity':countNigth,'price':priceNigth,'total':totalNigth,'editType':0,'incomeType':'FIX'});
                    }
                    isOld = false;
  
                    let countDayHh = 0;
                    let priceDayHh = 0.00;
                    let totalDayHh = 0.00;
                    let countNigthHh = 0;
                    let priceNigthHh = 0.00;
                    let totalNigthHh = 0.00;
                    for(let ii=0;ii<this.checkPointModelCompare.customerList.length;ii++){
                      for(let jj=0;jj<this.checkPointModelCompare.customerList[ii].employeeList.length;jj++){
                        if(employee.employeeId == this.checkPointModelCompare.customerList[ii].employeeList[jj].employeeId){
                            for(let mm=0;mm<this.checkPointModelCompare.customerList[ii].employeeList[jj].workList.length;mm++){
                              let workItem = this.checkPointModelCompare.customerList[ii].employeeList[jj].workList[mm];
                                if(workItem.date >= dateStart && workItem.date <= dateEnd){
                                  if(workItem.status == 'HE'){
                                    if(workItem.day){
                                      countDayHh++;
                                      priceDayHh = Number(workItem.waged);
                                      totalDayHh = totalDayHh + priceDayHh;
                                      sumSociety = sumSociety + ((priceDayHh/12)*8);
                                    }
                                    if(workItem.nigth){
                                      countNigthHh++;
                                      priceNigthHh = Number(workItem.wagen);
                                      totalNigthHh = totalNigthHh + priceNigthHh;
                                      sumSociety = sumSociety + ((priceNigthHh/12)*8);
                                    }
                                  }
                                }
                            }
                        }
                      }
                    }
  
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '003'){
                        incomeList[countInloop] = {'code':'003','name':'ค่าแรง(ช่วย)(D)','quantity':countDayHh,'price':priceDayHh,'total':totalDayHh,'editType':0,'incomeType':'FIX'};
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'003','name':'ค่าแรง(ช่วย)(D)','quantity':countDayHh,'price':priceDayHh,'total':totalDayHh,'editType':0,'incomeType':'FIX'});
                    }
                    isOld = false;
  
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '004'){
                        incomeList[countInloop] = {'code':'004','name':'ค่าแรง(ช่วย)(N)','quantity':countNigthHh,'price':priceNigthHh,'total':totalNigthHh,'editType':0,'incomeType':'FIX'};
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'004','name':'ค่าแรง(ช่วย)(N)','quantity':countNigthHh,'price':priceNigthHh,'total':totalNigthHh,'editType':0,'incomeType':'FIX'});
                    }
                    isOld = false; 
  
                    //compare old income
                    //005 ค่าเข็ม
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '005'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'005','name':'ค่าเข็ม','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false; 
  
                    //006 หุ้นลอย
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '006'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'006','name':'หุ้นลอย','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false; 
  
                    //007 ลาพักร้อน
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '007'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'007','name':'ลาพักร้อน','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false; 
  
                    //008 วันหยุดนักขัตฤกษ์
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '008'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'008','name':'วันหยุดนักขัตฤกษ์','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false; 
  
                    //009 ลาป่วย
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '009'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'009','name':'ลาป่วย','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false; 
  
                    //option list
                    for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].optionList.length;m++){
                      let optionItem = this.checkPointModel.customerList[i].employeeList[j].optionList[m];
                      let quantityItem = 0;
                      let priceItem = 0.00;
                      let totalItem = 0.00;
                      for(let kk=0;kk<optionItem.list.length;kk++){
                        let item = optionItem.list[kk];
                        if(item.day >= dateStart && item.day <= dateEnd){
                          quantityItem++;
                          priceItem = Number(item.wage);
                          totalItem = totalItem + priceItem;
                        }
                      }
  
                      let name = '';
                      if(optionItem.code == '001'){
                        name = 'อื่นๆ';
                      }else if(optionItem.code == '002'){
                        name = 'ค่าเดินทาง';
                      }else if(optionItem.code == '003'){
                        name = 'ค่าจุด';
                      }else if(optionItem.code == '004'){
                        name = 'ค่าตำแหน่ง';
                      }else{
                        name = 'อื่นๆ';
                      }
                      for(let x=0;x<this.checkPointModelCompare.customerList.length;x++){
                        for(let y=0;y<this.checkPointModelCompare.customerList[x].employeeList.length;y++){
                          if(employee.employeeId == this.checkPointModelCompare.customerList[x].employeeList[y].employeeId){
                              for(let mm=0;mm<this.checkPointModelCompare.customerList[x].employeeList[y].optionList.length;mm++){
                                let optionItem = this.checkPointModel.customerList[x].employeeList[y].optionList[mm];
                                let workItemList = this.checkPointModelCompare.customerList[x].employeeList[y].workList;
                                let tmpName = '';
                                if(optionItem.code == '001'){
                                  tmpName = 'อื่นๆ';
                                }else if(optionItem.code == '002'){
                                  tmpName = 'ค่าเดินทาง';
                                }else if(optionItem.code == '003'){
                                  tmpName = 'ค่าจุด';
                                }else if(optionItem.code == '004'){
                                  tmpName = 'ค่าตำแหน่ง';
                                }else{
                                  tmpName = 'อื่นๆ';
                                }
                                if(tmpName == name){
                                    for(let kk=0;kk<optionItem.list.length;kk++){
                                      let item = optionItem.list[kk];
                                      if(item.day >= dateStart && item.day <= dateEnd){
                                        if(workItemList[kk].status=='HE'){
                                          console.log('HE')
                                          quantityItem++;
                                          priceItem = Number(item.wage);
                                          totalItem = totalItem + priceItem;
                                        }
                                      }
                                    }
                                }
                              }
                          }
                        }
                      }
  
                      //00x xxxxx
                      let isOld = false;
                      for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                        if(incomeList[countInloop].code == '00'+(9+m) && incomeList[countInloop].name == name){
                          incomeList[countInloop] = {
                            'code':'00'+(9+m),
                            'name':name,
                            'quantity':quantityItem,
                            'price':(totalItem/quantityItem),
                            'total':totalItem,
                            'editType':0, //0=มาจากการเช็กจุด ,1=ฝ่ายการเงินบัญชีแก้ไขหน้าใบยาวได้
                            'incomeType':'FIX'
                          };
                          isOld = true;
                        }
                      }
                      if(!isOld){
                        incomeList.push({
                          'code':'00'+(9+m),
                          'name':name,
                          'quantity':quantityItem,
                          'price':(totalItem/quantityItem),
                          'total':totalItem,
                          'editType':0, //0=มาจากการเช็กจุด ,1=ฝ่ายการเงินบัญชีแก้ไขหน้าใบยาวได้
                          'incomeType':'FIX'
                        });
                      } 
                    }
                    this.checkPointModel.customerList[i].employeeList[j]['incomeList'] = incomeList;
                  //}
                  //end income list
  
                  //deduction list
                  //คำนวณประกันสังคม
                  let summarySociety = 0.00;
                  let manDay = 0.00;
                  let calNigth = false;
                  for(let x=0;x<incomeList.length;x++){
                    if(incomeList[x].code == '001'){
                        if(incomeList[x].quantity > 0){
                          let hoursePrice = incomeList[x].price/12;
                          manDay = hoursePrice*8;
                        }else{
                          calNigth = true;
                        }
                    }
                    if(incomeList[x].code == '002' && calNigth){
                      if(incomeList[x].quantity > 0){
                        let hoursePrice = incomeList[x].price/12;
                        manDay = hoursePrice*8;
                      }
                    }
                  }

                  let societyPercent = 0.05;
                  let societyPercentText = '5%';
                  if(Number(month) >= 10 && this.searchForm.get('year').value == 2022){
                    societyPercent = 0.03;
                    societyPercentText = '3%';
                  }
                  if((Number(month) >= 5 && Number(month) <= 7) && this.searchForm.get('year').value == 2022){
                    societyPercent = 0.01;
                    societyPercentText = '1%';
                  }
                  let sumDay = 
                  incomeList[0].quantity+incomeList[1].quantity+incomeList[2].quantity+incomeList[3].quantity;
                  //console.log('sumDay : ' + sumDay)
                  //sumSociety = sumSociety*0.05;
                  /*if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                    this.checkPointModel.customerList[i]['isAudit']=true;
                    console.log(customerAuditConfig)
                    summarySociety = Math.ceil((sumDay*(Number(customerAuditConfig.wage))) * (societyPercent));
                  }else if(customerAuditConfig==null){
                    this.checkPointModel.customerList[i]['isAudit']=false;
                    summarySociety = Math.ceil((sumDay*manDay) * (societyPercent));
                  } */
                  summarySociety = Math.ceil((sumSociety) * (societyPercent));
                  //console.log('summarySociety:' + summarySociety)
  
                  if(!employee.deductList){
                    let deductExtendList = [];
                    let deductExtendList002 = [];
                    let deductExtendList003 = [];
                    let deductExtendList004 = [];
                    let deductExtendList005 = [];
                    let deductList = [];

                    if(this.advMoneyList){ 
                      this.advMoneyList.forEach(item => {
                        if(item.employee_id == this.checkPointModel.customerList[i].employeeList[j].employeeId){
                          console.log(this.checkPointModel.customerList[i].employeeList[j])
                          let pickDate = item.pick_date.split(' ');
                          let splitPickDate = pickDate[0].split('-');
                          for(let countAdvItem = 0;countAdvItem<item.item.length;countAdvItem++){
                            let paidPeroid = item.item[countAdvItem].paid_peroid;
                            let splitPaidPeroid = paidPeroid.split('_'); 
                            console.log(this.searchForm.get('month').value);
                            console.log(this.searchForm.get('year').value);
                            console.log(splitPaidPeroid);
                            if(splitPaidPeroid[0] == this.searchForm.get('month').value
                            && Number(splitPaidPeroid[1]) == Number(this.searchForm.get('year').value)){
                              console.log('push') 
                              deductExtendList005.push(
                                {
                                  key:item.item[countAdvItem].item_id,
                                  desc:splitPickDate[2]+'/'+splitPickDate[1]+'',
                                  amount:item.item[countAdvItem].amount
                                }
                                )
                            }
                          } 
                          /*this.deductionChange(this.checkPointModel.customerList[i].customerId,
                            this.checkPointModel.customerList[i].employeeList[j].employeeId,
                            '005',
                            null
                          );*/
                        }
                      });
                      console.log(deductExtendList005); 
                    }

                    deductList.push({'code':'001','name':'ประกันสังคม('+societyPercentText+'%)','quantity':1,'price':0,'total':summarySociety,'editType':0,'incomeType':'MANUAL'});
                    //ค่าบ้าน
                    deductList.push({'code':'002','name':'ค่าบ้าน','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList002,'editType':0,'incomeType':'FIX'});
                    //อุปกรณ์
                    deductList.push({'code':'003','name':'อุปกรณ์','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList003,'editType':0,'incomeType':'FIX'});
                    //ประกันความเสียหาย
                    deductList.push({'code':'004','name':'ประกันความเสียหาย','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList004,'editType':0,'incomeType':'FIX'});
                    //เบิกล่วงหน้า
                    deductList.push({'code':'005','name':'เบิกล่วงหน้า','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList005,'editType':0,'incomeType':'FIX'});
                    //ค่าโอน
                    deductList.push({'code':'006','name':'ค่าโอน','quantity':1,'price':25,'total':25.00,'editType':0,'incomeType':'FIX'});
                    //อื่นๆ
                    deductList.push({'code':'007','name':'อื่นๆ','quantity':1,'price':0,'total':0.00,'editType':0,'incomeType':'FIX'});
  
                    this.checkPointModel.customerList[i].employeeList[j]['deductList'] = deductList;
                  }else{
                    //update ประกันสังคมเก่า
                    for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
                      if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == '001'){
                        /*if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price>0){
                          this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total =
                          this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price;
                        }else{
                          this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = summarySociety;
                        }*/
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price = summarySociety;
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = summarySociety;
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].editType = 1;
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].incomeType = 'MANUAL';
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].name = 'ประกันสังคม('+societyPercentText+')';
                      }
                      if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == '004'){
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].name = 'ประกันความเสียหาย';
                      }
                      //11/06/2022 พี่หลินแจ้งอัพเดทค่าโอนไม่ได้
                      /*
                      if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == '006'){
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price = 25; 
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = 25.00;
                      }
                      */

                      //เบิกล่วงหน้า 005
                      let deductExtendList005 = [];
                      if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == '005'){
                        if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList']){
                          deductExtendList005 = this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'];
                        }
                        if(this.advMoneyList){ 
                          this.advMoneyList.forEach(item => {
                            if(item.employee_id == this.checkPointModel.customerList[i].employeeList[j].employeeId){
                              console.log(this.checkPointModel.customerList[i].employeeList[j])
                              let pickDate = item.pick_date.split(' ');
                              let splitPickDate = pickDate[0].split('-');
                              for(let countAdvItem = 0;countAdvItem<item.item.length;countAdvItem++){
                                let paidPeroid = item.item[countAdvItem].paid_peroid;
                                let splitPaidPeroid = paidPeroid.split('_');
                                console.log(this.searchForm.get('month').value);
                                console.log(this.searchForm.get('year').value);
                                console.log(splitPaidPeroid);
                                if(splitPaidPeroid[0] == this.searchForm.get('month').value
                                && Number(splitPaidPeroid[1]) == Number(this.searchForm.get('year').value)){
                                  console.log('push') 
                                  //filter
                                  let ext005Count = 0;
                                  for(let abc=0;abc<deductExtendList005.length;abc++){
                                    if(deductExtendList005[abc].key){
                                      if(deductExtendList005[abc].key == item.item[countAdvItem].item_id){
                                        ext005Count++;
                                      }
                                    }
                                  }
                                  if(ext005Count==0){
                                    deductExtendList005.push(
                                        {
                                          key:item.item[countAdvItem].item_id,
                                          desc:splitPickDate[2]+'/'+splitPickDate[1]+'',
                                          amount:item.item[countAdvItem].amount
                                        }
                                      )
                                  } 
                                }
                              }
                            }
                          });
                          console.log(deductExtendList005);
                          let tmpDeductExtendList005 = [];
                          for(let abc=0;abc<deductExtendList005.length;abc++){
                            if(deductExtendList005[abc].desc != '2023/04'){
                              tmpDeductExtendList005.push(deductExtendList005[abc]);
                            }
                          }
                          this.calculate();
                        }
                      }
  
                      if(!this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code.includes("A")){
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['editType'] = 0;
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['incomeType'] = 'FIX';
                      } 
                    }
                  }
                  //end deducttion list
  
               }

                let workList = [];
                for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
                  let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                  if(workItem.date >= dateStart && workItem.date <= dateEnd){
                    //console.log(workItem)
                    workList.push(workItem);
                  }
                }
                this.customerSearchId = this.checkPointModel.customerList[i].customerId;
                let obj = {
                  'customerId':this.checkPointModel.customerList[i].customerId,
                  'customerName':this.checkPointModel.customerList[i].customerName,
                  'workList':workList
                }
                customerWorkList.push(obj);
              }//end employee check
            }
          }
          let tmpCustomerWorkList = [];
          let countCurrent = 0;
          let countNext = 0;
          let position = 0;
          if(customerWorkList){
            for(let yy=0;yy<customerWorkList.length;yy++){
              for(let zz=0;zz<customerWorkList[yy].workList.length;zz++){
                if(customerWorkList[yy].workList[zz].status === 'W'){
                  countNext++;
                }
              }
              if(countCurrent < countNext){
                countCurrent = countNext;
                position = yy;
              }
            }
            //tmpCustomerWorkList.push(customerWorkList[position]); 
          }
          this.customerSearchId = customerWorkList[position].customerId;
          this.checkPointRecheck[k]['customerWorkList'] = customerWorkList;
        }
        
        console.log(this.checkPointRecheck);
        this.spinner.hide();
      }else{
        this.spinner.hide();
      }
    });
  }
 

  //customerList;
  getCustomer(){
    this.customerList = [];
    this.customerService.getCustomer().subscribe(res=>{
      this.customerList = res;
    });
  } 
   
  getEmployee(employeeId){
    this.spinner.show();  
    this.employeeService.getEmployeeById(employeeId).subscribe(data => { 
      this.employee = data; 
      console.log(data);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  printMonthSlip(employeeId){
    this.spinner.show();
    console.log('printMonthSlip')
    console.log(employeeId);
    console.log(this.checkPointModel) 
   //search checkpoint
   let splitMonth = this.searchForm.get('month').value.split('-'); 
    this.peroidMonth = splitMonth[0];
    this.peroidType = splitMonth[1];
    let dateStart = 1;
    let dateEnd = 15;
    if(this.peroidType == 1){
      dateStart = 16;
      dateEnd = 31;
    }
    let month = splitMonth[0];
    let checkPointReqSearch = {
      'month':month,
      'year':this.searchForm.get('year').value
    };
    console.log(checkPointReqSearch)
    let checkPointDb = {
      'peroid':'06-01-2022',
      'customerList':[]
    };
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == this.customerSearchId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            let peroid = '';
            /*if(this.peroidType == 0){
              peroid = peroid + '1-15 ';
            }else if(this.peroidType == 1){
              peroid = peroid + '16-30 ';
            }*/
            if(this.peroidMonth == 1){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-31 ';
              }
              peroid = peroid + 'มกราคม ';
            }else if(this.peroidMonth == 2){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-29 ';
              }
              peroid = peroid + 'กุมภาพันธ์ ';
            }else if(this.peroidMonth == 3){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-31 ';
              }
              peroid = peroid + 'มีนาคม ';
            }else if(this.peroidMonth == 4){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-30 ';
              }
              peroid = peroid + 'เมษายน ';
            }else if(this.peroidMonth == 5){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-31 ';
              }
              peroid = peroid + 'พฤษภาคม ';
            }else if(this.peroidMonth == 6){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-30 ';
              }
              peroid = peroid + 'มิถุนายน ';
            }else if(this.peroidMonth == 7){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-31 ';
              }
              peroid = peroid + 'กรกฎาคม ';
            }else if(this.peroidMonth == 8){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-31 ';
              }
              peroid = peroid + 'สิงหาคม ';
            }else if(this.peroidMonth == 9){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-30 ';
              }
              peroid = peroid + 'กันยายน ';
            }else if(this.peroidMonth == 10){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-30 ';
              }
              peroid = peroid + 'ตุลาคม ';
            }else if(this.peroidMonth == 11){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-30 ';
              }
              peroid = peroid + 'พฤศจิกายน ';
            }else if(this.peroidMonth == 12){
              if(this.peroidType == 0){
                peroid = peroid + '1-15 ';
              }else if(this.peroidType == 1){
                peroid = peroid + '16-30 ';
              }
              peroid = peroid + 'ธันวาคม ';
            }
            peroid = peroid + this.searchForm.get('year').value;

            let deductExtendList002 = [];
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == '002'){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList){
                  deductExtendList002 = this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList;
                }
              }
            }

            let deductExtendList003 = [];
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == '003'){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList){
                  deductExtendList003 = this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList;
                }
              }
            }

            let deductExtendList004 = [];
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == '004'){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList){
                  deductExtendList004 = this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList;
                }
              }
            }

            let deductExtendList005 = [];
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == '005'){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList){
                  deductExtendList005 = this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList;
                }
              }
            }

            let workList = [];
            let dateStart = 1;
            let dateEnd = 15;
            if(this.peroidType == 1){
              dateStart = 16;
              dateEnd = 31;
            }
            for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
              let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                if(workItem.date >= dateStart && workItem.date <= dateEnd){
                  //if(workItem.status == 'W' || workItem.status == 'AAD' || workItem.status == 'AAN'){
                    workList.push(workItem);
                  //} 
                }
            }
            //get status HE ช่วย
            let heList = [];
            for(let ii=0;ii<this.checkPointModelCompare.customerList.length;ii++){
              for(let jj=0;jj<this.checkPointModelCompare.customerList[ii].employeeList.length;jj++){
                if(employeeId == this.checkPointModelCompare.customerList[ii].employeeList[jj].employeeId){
                    for(let mm=0;mm<this.checkPointModelCompare.customerList[ii].employeeList[jj].workList.length;mm++){
                      let workItem = this.checkPointModelCompare.customerList[ii].employeeList[jj].workList[mm];
                        if(workItem.date >= dateStart && workItem.date <= dateEnd){
                          if(workItem.status == 'HE'){
                            heList.push(workItem);
                          }
                        }
                    }
                }
              }
            }
            console.log(heList)
            for(let ii=0;ii<workList.length;ii++){
              if(workList[ii].status!='W' || (workList[ii].status=='W' && !workList[ii].day && !workList[ii].nigth)){
                let workMatch = heList.filter(he => he.date == workList[ii].date);
                if(workMatch.length>0){
                  workList[ii] = workMatch[0];
                }
              }
            }
            console.log(workList)
            let currentYear = new Date().getFullYear();
            let request = {
              "customerName":this.checkPointModel.customerList[i].customerName,
              "employeeName":this.checkPointModel.customerList[i].employeeList[j].firstName
              +" "+this.checkPointModel.customerList[i].employeeList[j].lastName,
              "incomeList":this.checkPointModel.customerList[i].employeeList[j].incomeList,
              "deductList":this.checkPointModel.customerList[i].employeeList[j].deductList,
              "totalIncome":this.checkPointModel.customerList[i].employeeList[j].totalIncome,
              "totalDeduct":this.checkPointModel.customerList[i].employeeList[j].totalDeduct,
              "peroid": peroid,
              "deductExtendList002": deductExtendList002,
              "deductExtendList003": deductExtendList003,
              "deductExtendList004": deductExtendList004,
              "deductExtendList005": deductExtendList005,
              "workList": workList,
              "employeeId": this.checkPointModel.customerList[i].employeeList[j].employeeId 
            };
            console.log(request);
            const parentThis = this;
            this.slipService.cashSlipMonthly(request).subscribe(res=>{
              console.log(res)
              console.log(res.data); 
              let printUrl = this.constant.API_ENDPOINT 
              + "/slip/download/monthly/"+this.checkPointModel.customerList[i].employeeList[j].employeeId; 
              parentThis.spinner.hide();
              window.open(res.data);
            });
          }
        }
      }
    }
  }

  calculate(){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){

        /*this.deductionChange(this.checkPointModel.customerList[i].customerId,
          this.checkPointModel.customerList[i].employeeList[j].employeeId,
          '005',
          null
        );*/
        
        let employee = this.checkPointModel.customerList[i].employeeList[j];
        if(!employee.isHH){
          let totalIncome = 0.00;
          let totalDeduct = 0.00;
          //income
          if(employee.incomeList){
            for(let k=0;k<employee.incomeList.length;k++){
              totalIncome = totalIncome + Number(employee.incomeList[k].total);
            }
          }
          //deduct
          if(employee.deductList){
            for(let k=0;k<employee.deductList.length;k++){
              //if(employee.deductList[k].code != '003'){
                totalDeduct = totalDeduct + Number(employee.deductList[k].total);
              //}
            }
          }
          this.checkPointModel.customerList[i].employeeList[j].totalIncome = totalIncome;
          this.checkPointModel.customerList[i].employeeList[j].totalDeduct = totalDeduct;
        }
      }
    }

  }

  showSlipDetail(){
    this.isShowSlip = true;
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
