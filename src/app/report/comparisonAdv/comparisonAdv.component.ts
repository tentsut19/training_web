import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, CustomerService, 
  MasterDataService, PermWorkRecordService, 
  CalendarHolidayService, CheckPointService ,SlipService,Constant} from '../../shared';
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Bank, BANKS ,Customer, CUST} from '../../guard/permanent/guardCheckPoint/demo-data';
import { AdvMoneyService } from 'src/app/shared/service/advMoney.service';
import { SlipHistoryService } from 'src/app/shared/service/slipHistory.service';

@Component({
  selector: 'app-comparison-adv',
  templateUrl: './comparisonAdv.component.html',
  styleUrls: ['./comparisonAdv.component.css']
})
export class ComparisonAdvComponent implements OnInit {  

  startDate;
  startDateStr;
  endDate;
  endDateStr;
  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: false
  };

  searchForm: FormGroup;
  addForm: FormGroup;
  yearList;
  currentYear;
  dayList = [];
  customerList =  [];
  customerAudit = [];
  employeeList = [];
  peroidType = 0;
  peroidText = '';
  peroidMonth = 0;

  customerSearchId = 0;

checkPointModel = {
  'peroid':'06-01-2022',
  'customerList':[]
};
checkPointModel1 = {
  'peroid':'06-01-2022',
  'customerList':[]
};
checkPointModel2 = {
  'peroid':'06-01-2022',
  'customerList':[]
};

periodDisplay = '';

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

checkPointModelCompare = {
  'peroid':'06-01-2022',
  'customerList':[]
}; 
advMoneyList = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private masterDataService: MasterDataService,
    private permWorkRecordService: PermWorkRecordService,
    private calendarHolidayService: CalendarHolidayService,
    private customerService: CustomerService,
    private checkPointService: CheckPointService,
    private spinner: NgxSpinnerService,
    private slipService: SlipService,
    private constant: Constant,
    private advMoneyService: AdvMoneyService,
    private slipHistoryService: SlipHistoryService
    ) { 
      this.searchForm = fb.group({
        'month':'1-0',
        'year': [new Date().getFullYear()],
        'customerId': [''],
      });
       this.addForm = fb.group({
      'work_date': [''],
      'customer_id': ['', Validators.required],
      'employee_id': ['', Validators.required]
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

    this.currentYear = new Date().getFullYear();
    this.getDeductExtend005();
    this.generateYearList();
    this.getCustomer();
    this.getGuard();
    //this.initDayList();
    //this.searchCheckPoint();
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

  xxxxxxxx(){
    this.spinner.show();
    let splitStartDate = this.startDateStr.split('-');
    let splitEndDate = this.endDateStr.split('-');
    console.log(this.startDateStr);
    console.log(this.endDateStr);
    if(splitStartDate[1] !== splitEndDate[1]){
      //------------------- Model 1 ------------------- //
      this.checkPointModel1 =  {
        'peroid':'06-01-2022',
        'customerList':[]
      };
      let dateStart1 = 1;
      let dateEnd1 = 31;
      dateStart1 = Number(splitStartDate[0]);
      console.log('dateStart1',dateStart1);
      console.log('dateEnd1',dateEnd1);
      let month1 = Number(splitStartDate[1]);
      let year1 = splitStartDate[2];
      let checkPoint1 = {
        'month':month1,
        'year':year1
      };
      console.log(checkPoint1);
      this.checkPointService.getCheckPoint(checkPoint1).subscribe(data=>{
        console.log(data);
        if(data.data != null){
          this.checkPointModel1 = JSON.parse(data.data['json_data']);
        }

        // ------------------- Model 2 ------------------- //
        this.checkPointModel2 =  {
          'peroid':'06-01-2022',
          'customerList':[]
        };
        let dateStart2 = 1;
        let dateEnd2 = 31;
        dateEnd2 = Number(splitEndDate[0]);
        console.log('dateStart2',dateStart2);
        console.log('dateEnd2',dateEnd2);
        let month2 = Number(splitEndDate[1]);
        let year2 = splitEndDate[2];
        let checkPoint2 = {
          'month':month2,
          'year':year2
        };
        console.log(checkPoint2);
        this.periodDisplay = dateStart1+'/'+month1+'/'+year1+' - '+dateEnd2+'/'+month2+'/'+year2;
        this.checkPointService.getCheckPoint(checkPoint2).subscribe(data=>{
          this.spinner.hide();
          console.log(data);
          if(data.data != null){
            this.checkPointModel2 = JSON.parse(data.data['json_data']);
            //Assign to view model
            this.checkPointModel = this.checkPointModel1;

            for(let i=0;i<this.checkPointModel.customerList.length;i++){ 
              //if(this.checkPointModel.customerList[i].id!=58){continue;}
              console.log(this.checkPointModel.customerList[i])
              console.log(this.advMoneyList);
                for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
                  let sumSociety = 0.00;
                  let employee = this.checkPointModel.customerList[i].employeeList[j];

                  // ----------------- Model 2 ----------------- // 
                  let emp2;
                  for(let ii=0;ii<this.checkPointModel2.customerList.length;ii++){ 
                      for(let jj=0;jj<this.checkPointModel2.customerList[ii].employeeList.length;jj++){
                        if(employee.employeeId == this.checkPointModel2.customerList[ii].employeeList[jj].employeeId){
                          emp2 = this.checkPointModel2.customerList[ii].employeeList[jj];
                        }
                      }
                  }
                  // ----------------- End Model 2 ----------------- // 
                  let emps = this.employeeList.filter(emp => emp.id == employee.employeeId);
                  let customerAuditConfig = null;
                  if(emps.length>0){
                    if(emps[0].customerAuditConfig && emps[0].customerAuditConfig.length>0){
                      customerAuditConfig = emps[0].customerAuditConfig[0];
                    } 
                  }
                  console.log('customerAuditConfig')
                  console.log(customerAuditConfig)
    
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
                      if(workItem.date >= dateStart1 && workItem.date <= dateEnd1){
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
                            if(workItem.date >= dateStart1 && workItem.date <= dateEnd1){
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

                        // ----------------- Model 2 ----------------- // 
                        if(emp2){
                          for(let mm=0;mm<emp2.workList.length;mm++){
                            let workItem = emp2.workList[mm];
                              if(workItem.date >= dateStart2 && workItem.date <= dateEnd2){
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
                        } 
                        // ----------------- End Model 2 ----------------- //

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
                                    if(workItem.date >= dateStart1 && workItem.date <= dateEnd1){
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
                            if(item.day >= dateStart1 && item.day <= dateEnd1){
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
                                          if(item.day >= dateStart1 && item.day <= dateEnd1){
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
                      if(Number(month1) >= 10 && this.searchForm.get('year').value == 2022){
                        societyPercent = 0.03;
                        societyPercentText = '3%';
                      }
                      let sumDay = 
                      incomeList[0].quantity+incomeList[1].quantity+incomeList[2].quantity+incomeList[3].quantity;
                      console.log('sumDay : ' + sumDay)
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
                      //new society
                      let sumNewSociety = totalDay+totalNigth+totalDayHh+totalNigthHh;
                      if(sumNewSociety>=15000){
                        summarySociety = 750;
                      }else{
                        summarySociety = Math.ceil((sumNewSociety) * (societyPercent));
                      }
                      console.log('summarySociety:' + summarySociety)
      
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
                                      key:item.item[countAdvItem].id,
                                      desc:splitPickDate[2]+'/'+splitPickDate[1]+'',
                                      amount:item.item[countAdvItem].amount
                                    }
                                    )
                                }
                              }
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
                            this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = summarySociety;
                            this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price = summarySociety;
                            /*if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price>0){
                              this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total =
                              this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price;
                            }else{
                              this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = summarySociety;
                            } */
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
                                          if(deductExtendList005[abc].key == item.item[countAdvItem].id){
                                            ext005Count++;
                                          }
                                        }
                                      }
                                      if(ext005Count==0){
                                        deductExtendList005.push(
                                            {
                                              key:item.item[countAdvItem].id,
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
                              this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'] = tmpDeductExtendList005;
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
      
                }
              //}); 
            }

          }
          this.calculate();
        });
        // ------------------- End Model 2  ------------------- //
      });
      // ------------------- End Model 1  ------------------- //

    }else{
      this.searchCheckPoint();
    }
  }

  searchCheckPoint(){
    this.spinner.show();
    this.checkPointModel = {
      'peroid':'06-01-2022',
      'customerList':[]
    };

    console.log(this.startDateStr);
    console.log(this.endDateStr);
    let splitStartDate = this.startDateStr.split('-');
    let splitEndDate = this.endDateStr.split('-');
    let dateStart = 1;
    let dateEnd = 31;
    dateStart = Number(splitStartDate[0]);
    dateEnd = Number(splitEndDate[0]);
    console.log('dateStart',dateStart);
    console.log('dateEnd',dateEnd);
    //let month = splitMonth[0];
    let month = Number(splitStartDate[1]);
    let year = splitStartDate[2];
    let checkPoint = {
      'month':month,
      'year':year
    };
    this.periodDisplay = dateStart+'/'+month+'/'+year+' - '+dateEnd+'/'+month+'/'+year;
    console.log(checkPoint);
    //return;
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      console.log(data);
      this.spinner.hide();
      if(data.data != null){
        this.checkPointModel = JSON.parse(data.data['json_data']);
        this.checkPointModelCompare = this.checkPointModel;

        console.log(this.checkPointModel);
        //add income and deduct list
        for(let i=0;i<this.checkPointModel.customerList.length;i++){ 
          //if(this.checkPointModel.customerList[i].id!=353){continue;}
          console.log(this.checkPointModel.customerList[i])
          console.log(this.advMoneyList);
            //console.log(customerAuditConfig); 
            for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
              //if(this.checkPointModel.customerList[i].employeeList[j].employeeId!=3549){continue;}
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
              console.log('customerAuditConfig')
              console.log(customerAuditConfig)

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
                  let sumDay = 
                  incomeList[0].quantity+incomeList[1].quantity+incomeList[2].quantity+incomeList[3].quantity;
                  console.log('sumDay : ' + sumDay)
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

                  //new society
                  /*let sumNewSociety = totalDay+totalNigth+totalDayHh+totalNigthHh;
                  if(sumNewSociety>=15000){
                    summarySociety = 750;
                  }else{
                    summarySociety = Math.ceil((sumNewSociety) * (societyPercent));
                  }*/

                  //น้องหมวยให้แก้ คำนวณเหมือนราย Week
                  if(sumSociety>=15000){
                    summarySociety = 750;
                  }
                  console.log('summarySociety:' + summarySociety)
                  console.log(employee.deductList);

                  /*if(employee.deductList){
                    for(let zx=0;zx<employee.deductList.length;zx++){
                      if(employee.deductList[zx].code === '005'){
                        let tmpExtendList = [];
                        if(employee.deductList[zx].deductExtendList){
                          employee.deductList[zx].deductExtendList.forEach(item => {
                            if(item.key){
                              tmpExtendList.push(item);
                            }
                          });
                        }
                        employee.deductList[zx].deductExtendList = JSON.parse(JSON.stringify(tmpExtendList));
                      }
                    }
                  }*/

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
                            console.log(month);
                            console.log(year);
                            console.log(splitPaidPeroid);
                            console.log(splitPaidPeroid[0].split('-')[0]);
                            let splitPaidMonth = splitPaidPeroid[0].split('-')[0];
                            if(splitPaidMonth == month
                            && Number(splitPaidPeroid[1]) == year){
                              console.log('push1') 
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
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = summarySociety;
                        this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price = summarySociety;
                        /*if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price>0){
                          this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total =
                          this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price;
                        }else{
                          this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = summarySociety;
                        } */
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
                        console.log(deductExtendList005);
                        if(this.advMoneyList){ 
                          this.advMoneyList.forEach(item => {
                            if(item.employee_id == this.checkPointModel.customerList[i].employeeList[j].employeeId){
                              //console.log(this.checkPointModel.customerList[i].employeeList[j])
                              let pickDate = item.pick_date.split(' ');
                              let splitPickDate = pickDate[0].split('-');
                              for(let countAdvItem = 0;countAdvItem<item.item.length;countAdvItem++){
                                let paidPeroid = item.item[countAdvItem].paid_peroid;
                                let splitPaidPeroid = paidPeroid.split('_'); 
                                console.log(splitPaidPeroid[0].split('-')[0]);
                                let splitPaidMonth = splitPaidPeroid[0].split('-')[0];
                                if(splitPaidMonth == month
                                && Number(splitPaidPeroid[1]) == year){
                                  console.log(month);
                                  console.log(year);
                                  console.log(splitPaidPeroid);
                                  console.log(splitPaidPeroid[0].charAt(0));
                                  console.log('push2') 
                                  console.log(deductExtendList005)
                                  console.log(item)
                                  //filter
                                  let ext005Count = 0;
                                  for(let abc=0;abc<deductExtendList005.length;abc++){
                                    if(deductExtendList005[abc].key){
                                      if(deductExtendList005[abc].key == item.item[countAdvItem].item_id){
                                        ext005Count++;
                                      }
                                    }else{
                                      ext005Count++;
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
                          this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'] = tmpDeductExtendList005;
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
  
            }
          //}); 
        }
        this.calculate();
        this.spinner.hide();
      }else{
        this.spinner.hide();
      }
    });
  }

  //income 
  incomeChange(customerId,employeeId,incomeCode,total){
    console.log(customerId);
    console.log(employeeId);
    console.log(incomeCode);
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            if(!this.checkPointModel.customerList[i].employeeList[j].isHH){
                for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['incomeList'].length;x++){
                  if(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][x].code == incomeCode){
                    this.checkPointModel.customerList[i].employeeList[j]['incomeList'][x].total 
                    = Number(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][x].price
                     * this.checkPointModel.customerList[i].employeeList[j]['incomeList'][x].quantity);
                  }
                }
            }
          }
        }
      }
    }
    this.calculate();
  }

  addIncome(customerId,employeeId){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            if(!this.checkPointModel.customerList[i].employeeList[j].isHH){
              this.checkPointModel.customerList[i].employeeList[j]['incomeList'].push({
                'code':'A'+(this.checkPointModel.customerList[i].employeeList[j]['incomeList'].length),
                'name':'','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'MANUAL'
              })
            }
          }
        }
      }
    }
  }


  addDeduct(customerId,employeeId){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            if(!this.checkPointModel.customerList[i].employeeList[j].isHH){
              this.checkPointModel.customerList[i].employeeList[j]['deductList'].push({
                'code':'A'+(this.checkPointModel.customerList[i].employeeList[j]['deductList'].length),
                'name':'','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'MANUAL'
              })
            }
          }
        }
      }
    }
  }

  deductionChange(customerId,employeeId,deductCode,total){
    console.log(customerId);
    console.log(employeeId);
    console.log(deductCode);
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            if(!this.checkPointModel.customerList[i].employeeList[j].isHH){
                for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
                  if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == deductCode){
                    this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total 
                    = Number(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].price 
                    * Number(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].quantity));
                  }
                }
            }
          }
        }
      }
    }
    this.calculate();
  }

  addDeductExtendList005(customerId,employeeId,code){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == code){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].deductExtendList){
                  this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'].push(
                    {'desc':'','amount':0.00}
                  );
                }else{
                  this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'] = [];
                  this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'].push(
                    {'desc':'','amount':0.00}
                  );
                }
              }
            }
          }
        }
      }
    }

  }

  removeDeductExtendList005(customerId,employeeId,countExtend005,code){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == code){
                
                this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'].splice(countExtend005, 1);
                let sum005 = 0.00;
                for(let ii=0;ii<this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'].length;ii++){
                  let item = this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'][ii];
                  sum005 = sum005 + item.amount;
                }
                this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = sum005;
                this.calculate();
              }
            }
          }
        }
      }
    }
  }

  calculateDeduct005(customerId,employeeId,code){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == code){
                
                let sum005 = 0.00;
                for(let ii=0;ii<this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'].length;ii++){
                  let item = this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'][ii];
                  sum005 = sum005 + item.amount;
                }
                this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].total = sum005;
                this.calculate();
              }
            }
          }
        }
      }
    }
  }

  calculate(){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
        
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
              let sum005 = 0.00;
              if(employee.deductList[k].code === '005'){
                if(employee.deductList[k].deductExtendList){
                  employee.deductList[k].deductExtendList.forEach(item => {
                    sum005 = sum005 + Number(item.amount);
                  });
                }
                employee.deductList[k].total = sum005;
              }
            }
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

  updateCheckPoint(){
    this.spinner.show();
    let objCompare = null;
    let custsCompare = this.checkPointModel.customerList.filter(cus => cus.id == this.customerSearchId);
      console.log(custsCompare);
      if(custsCompare.length>0){
        objCompare = JSON.parse(JSON.stringify(custsCompare[0]));
      }
      //search checkpoint
    /*let splitMonth = this.searchForm.get('month').value.split('-');
    this.peroidMonth = splitMonth[0];
    this.peroidType = splitMonth[1];
    let dateStart = 1;
    let dateEnd = 15;
    if(this.peroidType == 1){
      dateStart = 16;
      dateEnd = 31;
    }
    let month = splitMonth[0];
    */
    let splitStartDate = this.startDateStr.split('-');
    let splitEndDate = this.endDateStr.split('-');
    let dateStart = 1;
    let dateEnd = 31;
    dateStart = Number(splitStartDate[0]);
    dateEnd = Number(splitEndDate[0]);
    console.log('dateStart',dateStart);
    console.log('dateEnd',dateEnd);

    let month = Number(splitStartDate[1]);
    let year = splitStartDate[2];
    let checkPointReqSearch = {
      'month':month,
      'year':year
    };

    console.log(checkPointReqSearch)
    let checkPointDb = {
      'peroid':'06-01-2022',
      'customerList':[]
    };

    this.checkPointService.getCheckPoint(checkPointReqSearch).subscribe(data=>{
      console.log(data);
      if(data.data != null){
        checkPointDb = JSON.parse(data.data['json_data']);
        for(let i=0;i<checkPointDb.customerList.length;i++){
          let custs = this.customerList.filter(cus => cus.id == checkPointDb.customerList[i].customerId);
          if(custs.length>0){
            if(this.customerSearchId == checkPointDb.customerList[i].customerId){
              if(objCompare!=null){
                checkPointDb.customerList[i] = objCompare;
              }
            }
            console.log(checkPointDb)
          }
        }

        let checkPoint = {
          'month':month,
          'year':year,
          //'month':this.peroidMonth,
          //'year':this.searchForm.get('year').value,
          //'json_data':JSON.stringify(this.checkPointModel),
          'json_data':JSON.stringify(checkPointDb),
        };
        console.log(checkPoint); 
        this.checkPointService.createUpdateCheckPoint(checkPoint).subscribe(data => {
          console.log(data)
          this.spinner.hide();
          this.searchCheckPoint();
          //this.successDialog();
        }, error => {
          this.spinner.hide();
          console.error(error);
          this.failDialog(error);
        });

      }//end check null
    }); 
  }


  monthChanged(){
    this.spinner.show();
    this.searchCheckPoint();
  }

  getCustomer(){
    this.spinner.show();
    $("#check-point-customer").DataTable().clear().destroy();
    this.customerList = [];
    this.customerService.getCustomer2().subscribe(res=>{
      this.customerList = res;
      console.log(this.customerList);
      this.searchCheckPoint();
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

      setTimeout(() => {
        $('#check-point-customer').DataTable({
        });
      }, 10);
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

  getGuard(){
    this.employeeList = [];
    this.permWorkRecordService.getGuard().subscribe(res=>{
      this.employeeList = res;
      console.log(this.employeeList);
    });
  }
 
  printMonthSlip(employeeId,customerId){
    this.spinner.show();
    console.log(this.checkPointModel)
    let objCompare = null;
    let custsCompare = this.checkPointModel.customerList.filter(cus => cus.id == this.customerSearchId);
       console.log(custsCompare);
      if(custsCompare.length>0){
        objCompare = JSON.parse(JSON.stringify(custsCompare[0]));
      }
   //search checkpoint
    /*let splitMonth = this.searchForm.get('month').value.split('-');
    this.peroidMonth = splitMonth[0];
    this.peroidType = splitMonth[1];
    let dateStart = 1;
    let dateEnd = 15;
    if(this.peroidType == 1){
      dateStart = 16;
      dateEnd = 31;
    }
    let month = splitMonth[0];
    */
    let splitStartDate = this.startDateStr.split('-');
    let splitEndDate = this.endDateStr.split('-');
    let dateStart = 1;
    let dateEnd = 31;
    dateStart = Number(splitStartDate[0]);
    dateEnd = Number(splitEndDate[0]);
    console.log('dateStart',dateStart);
    console.log('dateEnd',dateEnd);
    let month = Number(splitStartDate[1]);
    let year = splitStartDate[2];
    let checkPointReqSearch = {
      'month':month,
      'year':year
    };
    console.log(checkPointReqSearch)
    let checkPointDb = {
      'peroid':'06-01-2022',
      'customerList':[]
    };
    let dupOldCustomer = false;
    this.checkPointService.getCheckPoint(checkPointReqSearch).subscribe(data=>{
      console.log(data);
      if(data.data != null){
        checkPointDb = JSON.parse(data.data['json_data']);
        for(let i=0;i<checkPointDb.customerList.length;i++){
          let custs = this.customerList.filter(cus => cus.id == checkPointDb.customerList[i].customerId);
          if(custs.length>0){
            if(this.customerSearchId == checkPointDb.customerList[i].customerId){
              if(objCompare!=null){
                checkPointDb.customerList[i] = objCompare;
              }
            }
            console.log(checkPointDb)
          }
        }
        //create update
        let checkPoint = {
          'month':month,
          'year':year,
          //'json_data':JSON.stringify(this.checkPointModel),
          'json_data':JSON.stringify(checkPointDb),
        };
        this.checkPointService.createUpdateCheckPoint(checkPoint).subscribe(data => {
          //this.spinner.hide();
          console.log(data);
        }, error => {
          this.spinner.hide();
          console.error(error);
          this.failDialog(error);
        });
    
        for(let i=0;i<this.checkPointModel.customerList.length;i++){
          if(this.checkPointModel.customerList[i].customerId == customerId){
            for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
              if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
                let peroid1 = '';
                if(Number(splitStartDate[1]) == 1){
                  peroid1 = peroid1 + 'มกราคม ';
                }else if(Number(splitStartDate[1]) == 2){
                  peroid1 = peroid1 + 'กุมภาพันธ์ ';
                }else if(Number(splitStartDate[1]) == 3){
                  peroid1 = peroid1 + 'มีนาคม ';
                }else if(Number(splitStartDate[1]) == 4){
                  peroid1 = peroid1 + 'เมษายน ';
                }else if(Number(splitStartDate[1]) == 5){
                  peroid1 = peroid1 + 'พฤษภาคม ';
                }else if(Number(splitStartDate[1]) == 6){
                  peroid1 = peroid1 + 'มิถุนายน ';
                }else if(Number(splitStartDate[1]) == 7){
                  peroid1 = peroid1 + 'กรกฎาคม ';
                }else if(Number(splitStartDate[1]) == 8){
                  peroid1 = peroid1 + 'สิงหาคม ';
                }else if(Number(splitStartDate[1]) == 9){
                  peroid1 = peroid1 + 'กันยายน ';
                }else if(Number(splitStartDate[1]) == 10){
                  peroid1 = peroid1 + 'ตุลาคม ';
                }else if(Number(splitStartDate[1]) == 11){
                  peroid1 = peroid1 + 'พฤศจิกายน ';
                }else if(Number(splitStartDate[1]) == 12){
                  peroid1 = peroid1 + 'ธันวาคม ';
                }
                peroid1 = Number(splitStartDate[0]) + ' ' + peroid1 + ' ' + splitStartDate[2];

                let peroid2 = '';
                if(Number(splitEndDate[1]) == 1){
                  peroid2 = peroid2 + 'มกราคม ';
                }else if(Number(splitEndDate[1]) == 2){
                  peroid2 = peroid2 + 'กุมภาพันธ์ ';
                }else if(Number(splitEndDate[1]) == 3){
                  peroid2 = peroid2 + 'มีนาคม ';
                }else if(Number(splitEndDate[1]) == 4){
                  peroid2 = peroid2 + 'เมษายน ';
                }else if(Number(splitEndDate[1]) == 5){
                  peroid2 = peroid2 + 'พฤษภาคม ';
                }else if(Number(splitEndDate[1]) == 6){
                  peroid2 = peroid2 + 'มิถุนายน ';
                }else if(Number(splitEndDate[1]) == 7){
                  peroid2 = peroid2 + 'กรกฎาคม ';
                }else if(Number(splitEndDate[1]) == 8){
                  peroid2 = peroid2 + 'สิงหาคม ';
                }else if(Number(splitEndDate[1]) == 9){
                  peroid2 = peroid2 + 'กันยายน ';
                }else if(Number(splitEndDate[1]) == 10){
                  peroid2 = peroid2 + 'ตุลาคม ';
                }else if(Number(splitEndDate[1]) == 11){
                  peroid2 = peroid2 + 'พฤศจิกายน ';
                }else if(Number(splitEndDate[1]) == 12){
                  peroid2 = peroid2 + 'ธันวาคม ';
                }
                peroid2 = Number(splitEndDate[0]) + ' ' + peroid2 + ' ' + splitEndDate[2];
                let peroid = peroid1+ ' - ' +peroid2;
    
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
                /*
                let dateStart = 1;
                let dateEnd = 15;
                if(this.peroidType == 1){
                  dateStart = 16;
                  dateEnd = 31;
                }*/
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
                  "tag": month + '-' + year,
                  "deductExtendList002": deductExtendList002,
                  "deductExtendList003": deductExtendList003,
                  "deductExtendList004": deductExtendList004,
                  "deductExtendList005": deductExtendList005,
                  "workList": workList,
                  "employeeId": this.checkPointModel.customerList[i].employeeList[j].employeeId
                  //"employeeId": this.checkPointModel.customerList[i].employeeList[j].employeeId
                  //+"_"+this.peroidType+"_"+this.peroidMonth+"_"+currentYear
                };
                console.log(request);
                const parentThis = this;
                this.slipService.cashSlipMonthly2(request).subscribe(res=>{
                  console.log(res)
                  console.log(res.data);
                  /*let printUrl = this.constant.API_ENDPOINT 
                  + "/slip/download/monthly/"+this.checkPointModel.customerList[i].employeeList[j].employeeId
                  +"_"+this.peroidType+"_"+this.peroidMonth+"_"+currentYear;*/
                  let printUrl = this.constant.API_ENDPOINT 
                  + "/slip/download/monthly/"+this.checkPointModel.customerList[i].employeeList[j].employeeId;
                  // setTimeout(function() { 
                  //   parentThis.spinner.hide();
                  //   window.open(printUrl);
                  // }, 30000); 
                  parentThis.spinner.hide();
                  window.open(res.data);
                  this.saveHistory(this.checkPointModel.customerList[i].employeeList[j].employeeId,
                    res.data,
                    'Y',
                    month + '-' + year);
                });
              }
            }
          }
        }

      }// end check null
    });
  }

  saveHistory(employee_id,url,tag,tag_detail){
    let req = {employee_id:employee_id, url: url, tag: tag, tag_detail: tag_detail};
    this.slipHistoryService.createOrUpdate(req).subscribe(res=>{
      console.log(res);
    });
  }

  selectedDate(value: any, datepicker?: any) {
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
    return dd + '-' + mm + '-' + yyyy;
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

  dialog(title,msg){
    Swal.fire({
      type: 'error',
      title: title,
      text: msg
    })
  }

}
