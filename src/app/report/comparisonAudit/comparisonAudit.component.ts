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

@Component({
  selector: 'app-comparisonAudit',
  templateUrl: './comparisonAudit.component.html',
  styleUrls: ['./comparisonAudit.component.css']
})
export class ComparisonAuditComponent implements OnInit {  

  options: any = {
    locale: { format: 'MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  searchForm: FormGroup;
  addForm: FormGroup;
  yearList;
  currentYear;
  dayList = [];
  customerList =  [];
  employeeList = [];
  peroidType = 0;
  peroidText = '';
  peroidMonth = 0;

  customerSearchId = 0;

checkPointModel = {
  'peroid':'06-01-2022',
  'customerList':[]
};

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
    this.currentYear = new Date().getFullYear();
    this.generateYearList();
    this.getCustomer();
    this.getGuard();
    //this.initDayList();
    //this.searchCheckPoint();
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

  searchCheckPoint(){
    //this.spinner.show();
    this.checkPointModel = {
      'peroid':'06-01-2022',
      'customerList':[]
    };

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
        //add income and deduct list
        for(let i=0;i<this.checkPointModel.customerList.length;i++){
          //customer audit
          //this.customerService.getCustomerAuditConfigByCustomerId(this.checkPointModel.customerList[i].id).subscribe(res=>{
            /*let customerAuditConfig = res;
            if(Object.keys(customerAuditConfig).length === 0){
              customerAuditConfig = null;
            }*/
            //console.log(customerAuditConfig);

            let custs = this.customerList.filter(cus => cus.id == this.checkPointModel.customerList[i].id); 
            let customerAuditConfig = null;
              if(custs.length>0){
                if(custs[0].customerAuditConfig && custs[0].customerAuditConfig.length>0){
                  customerAuditConfig = custs[0].customerAuditConfig[0];
                } 
              }
              console.log('customerAuditConfig')
              console.log(customerAuditConfig)
            if(customerAuditConfig!=null){
            for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
              let employee = this.checkPointModel.customerList[i].employeeList[j];
              let emps = this.employeeList.filter(emp => emp.id == employee.employeeId); 

              this.checkPointModel.customerList[i].employeeList[j]['bankDetail']=emps.length>0?emps[0].bank_account_no:'-';
              if(!employee.totalIncomeAudit){
                this.checkPointModel.customerList[i].employeeList[j]['totalIncomeAudit'] = 0.00;
              }
              if(!employee.totalDeductAudit){
                this.checkPointModel.customerList[i].employeeList[j]['totalDeductAudit'] = 0.00;
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
  
              let countDay = 0;
              let oldCountDay = 0;
              let priceDay = 0.00;
              let totalDay = 0.00;
              let countNigth = 0;
              let oldCountNight = 0;
              let priceNigth = 0.00;
              let totalNigth = 0.00;
              let countHoliday = 0;

               if(!isHH){
                  //income list
                  //if(!employee.incomeList){
                    let incomeList = [];
                    if(employee.incomeListAudit){
                      incomeList = employee.incomeListAudit;
                    }
                    /*let countDay = 0;
                    let priceDay = 0.00;
                    let totalDay = 0.00;
                    let countNigth = 0;
                    let priceNigth = 0.00;
                    let totalNigth = 0.00;
                    */

                    for(let m=0;m<this.checkPointModel.customerList[i].employeeList[j].workList.length;m++){
                      let workItem = this.checkPointModel.customerList[i].employeeList[j].workList[m];
                        if(workItem.date >= dateStart && workItem.date <= dateEnd){
                          if(workItem.status == 'W'){
                            if(workItem.day){
                              countDay++;
                              oldCountDay++;
                              if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                                priceDay = Number(customerAuditConfig.wage);
                              }else{
                                priceDay = Number(workItem.waged);
                              }
                              totalDay = totalDay + priceDay;
                            }
                            if(workItem.nigth){
                              countNigth++;
                              oldCountNight++;
                              if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                                priceNigth = Number(customerAuditConfig.wage);
                              }else{
                                priceNigth = Number(workItem.wagen);
                              }
                              totalNigth = totalNigth + priceNigth;
                            }
                          }
                          if(workItem.status == 'AAD'){
                            if(workItem.nigth){
                              countNigth++;
                              if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                                priceNigth = Number(customerAuditConfig.wage);
                              }else{
                                priceNigth = Number(workItem.wagen);
                              }
                              totalNigth = totalNigth + priceNigth;
                            }
                          }
                          if(workItem.status == 'AAN'){
                            if(workItem.day){
                              countDay++;
                              if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                                priceDay = Number(customerAuditConfig.wage);
                              }else{
                                priceDay = Number(workItem.waged);
                              }
                              totalDay = totalDay + priceDay;
                            }
                          }
                          if(workItem.status == 'H'){
                            if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                              priceDay = Number(customerAuditConfig.wage);
                              priceNigth = Number(customerAuditConfig.wage);
                            }else{
                              priceDay = Number(workItem.waged);
                              priceNigth = Number(workItem.wagen);
                            }
                            countHoliday++;
                            if(workItem.nigth){
                              countNigth++; 
                              totalNigth = totalNigth + priceNigth;
                            }
                            if(workItem.day){
                              countDay++;
                              totalDay = totalDay + priceDay;
                            }
                          }
  
                        }
                    }
                    let isOld = false;
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '001'){
                        if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                          incomeList[countInloop] = {'code':'001','name':'ค่าแรง(D)','quantity':countDay,'price':customerAuditConfig.wage,'total':totalDay,'editType':0,'incomeType':'FIX'};
                        }else{
                          incomeList[countInloop] = {'code':'001','name':'ค่าแรง(D)','quantity':countDay,'price':priceDay,'total':totalDay,'editType':0,'incomeType':'FIX'};
                        }
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                        incomeList.push({'code':'001','name':'ค่าแรง(D)','quantity':countDay,'price':customerAuditConfig.wage,'total':totalDay,'editType':0,'incomeType':'FIX'});
                      }else{
                        incomeList.push({'code':'001','name':'ค่าแรง(D)','quantity':countDay,'price':priceDay,'total':totalDay,'editType':0,'incomeType':'FIX'});
                      } 
                    }
                    

                    //case ot
                    let otPrice = 0.00;
                    let isOtOld = false; 
                    if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                      otPrice = Number((Math.ceil(customerAuditConfig.wage/8)*1.5*2).toFixed(2));
                      for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                        if(incomeList[countInloop].code == '0001'){
                          if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                            incomeList[countInloop] = {'code':'0001','name':'ล่วงเวลา(D)','quantity':countDay,'price':Number(otPrice),'total':Number((otPrice*countDay).toFixed(2)),'editType':0,'incomeType':'FIX'};
                          }
                          isOtOld = true;
                        }
                      }
                      if(!isOtOld){
                        incomeList.push({'code':'0001','name':'ล่วงเวลา(D)','quantity':countDay,'price':Number(otPrice),'total':Number((otPrice*countDay).toFixed(2)),'editType':0,'incomeType':'FIX'});
                      }
                    }

                    isOld = false;
  
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '002'){
                        if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                          incomeList[countInloop] = {'code':'002','name':'ค่าแรง(N)','quantity':countNigth,'price':customerAuditConfig.wage,'total':totalNigth,'editType':0,'incomeType':'FIX'};
                        }else{
                          incomeList[countInloop] = {'code':'002','name':'ค่าแรง(N)','quantity':countNigth,'price':priceNigth,'total':totalNigth,'editType':0,'incomeType':'FIX'};
                        } 
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                        incomeList.push({'code':'002','name':'ค่าแรง(N)','quantity':countNigth,'price':customerAuditConfig.wage,'total':totalNigth,'editType':0,'incomeType':'FIX'});
                      }else{
                        incomeList.push({'code':'002','name':'ค่าแรง(N)','quantity':countNigth,'price':priceNigth,'total':totalNigth,'editType':0,'incomeType':'FIX'});
                      } 
                    }
                    isOld = false;
                    
                    isOtOld = false;
                    if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                      otPrice = Number((Math.ceil(customerAuditConfig.wage/8)*1.5*2).toFixed(2));
                      for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                        if(incomeList[countInloop].code == '0002'){
                          if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                            incomeList[countInloop] = {'code':'0002','name':'ล่วงเวลา(N)','quantity':oldCountNight,'price':Number(otPrice),'total':Number((otPrice*oldCountNight).toFixed(2)),'editType':0,'incomeType':'FIX'};
                          }
                          isOtOld = true;
                        }
                      }
                      if(!isOtOld){
                        incomeList.push({'code':'0002','name':'ล่วงเวลา(N)','quantity':oldCountNight,'price':Number(otPrice),'total':Number((otPrice*oldCountNight).toFixed(2)),'editType':0,'incomeType':'FIX'});
                      }
                    }
                    incomeList.sort((a,b) => a.code - b.code);

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
                                    }
                                    if(workItem.nigth){
                                      countNigthHh++;
                                      priceNigthHh = Number(workItem.wagen);
                                      totalNigthHh = totalNigthHh + priceNigthHh;
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
                    if(!isOld && this.checkPointModel.customerList[i].employeeList[j]['incomeList']){
                      for(let aa=0;aa<this.checkPointModel.customerList[i].employeeList[j]['incomeList'].length;aa++){
                        if(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa].code == '005'){
                          let obj = JSON.stringify(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa]);
                          incomeList.push(JSON.parse(obj));
                        }
                      }
                    }else if(!isOld && !this.checkPointModel.customerList[i].employeeList[j]['incomeList']){
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
                    if(!isOld && this.checkPointModel.customerList[i].employeeList[j]['incomeList']){
                      for(let aa=0;aa<this.checkPointModel.customerList[i].employeeList[j]['incomeList'].length;aa++){
                        if(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa].code == '006'){
                          let obj = JSON.stringify(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa]);
                          incomeList.push(JSON.parse(obj));
                        }
                      }
                      //incomeList.push({'code':'006','name':'หุ้นลอย','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }else if(!isOld && !this.checkPointModel.customerList[i].employeeList[j]['incomeList']){
                      incomeList.push({'code':'006','name':'หุ้นลอย','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false; 
  
                    //007 ลาพักร้อน
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '007'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        //incomeList[countInloop]['quantity'] = 0;
                        incomeList[countInloop]['price'] = customerAuditConfig.wage;
                        incomeList[countInloop]['total'] = incomeList[countInloop]['price']*incomeList[countInloop]['quantity'];
                        isOld = true;
                      }
                    }
                    if(!isOld && this.checkPointModel.customerList[i].employeeList[j]['incomeList']){
                      for(let aa=0;aa<this.checkPointModel.customerList[i].employeeList[j]['incomeList'].length;aa++){
                        if(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa].code == '007'){
                          this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa].name = 'ลากิจ';
                          let obj = JSON.stringify(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa]);
                          incomeList.push(JSON.parse(obj));
                        }
                      }
                      //incomeList.push({'code':'007','name':'ลาพักร้อน','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }else if(!isOld && !this.checkPointModel.customerList[i].employeeList[j]['incomeList']){
                      incomeList.push({'code':'007','name':'ลากิจ','quantity':0,'price':customerAuditConfig.wage,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false;
  
                    //008 วันหยุดนักขัตฤกษ์
                    let oldHolidayPosition = 0;
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '008'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        isOld = true;
                        oldHolidayPosition = countInloop;
                      }
                    }
                    if(isOld){
                      incomeList[oldHolidayPosition] = {'code':'008','name':'นักขัตฤกษ์','quantity':countHoliday,'price':customerAuditConfig.wage,'total':((customerAuditConfig.wage*countHoliday)),'editType':1,'incomeType':'FIX'};
                    }else{
                      incomeList.push({'code':'008','name':'นักขัตฤกษ์','quantity':countHoliday,'price':customerAuditConfig.wage,'total':((customerAuditConfig.wage*countHoliday)),'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false; 


                    //0008 ot นักขัตฤกษ์
                    let countOtHoliday = 0;
                    if(oldCountDay<countDay || oldCountNight<countNigth){
                      countOtHoliday = countHoliday;
                    }
                    let otHolidayPrice = Number((Math.ceil(customerAuditConfig.wage/8)*3*2).toFixed(2));
                    oldHolidayPosition = 0;
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '0008'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        isOld = true;
                        oldHolidayPosition = countInloop;
                      }
                    }
                    if(isOld){
                      incomeList[oldHolidayPosition] = {'code':'0008','name':'ล่วงเวลานักขัตฤกษ์','quantity':countOtHoliday,'price':otHolidayPrice,'total':(otHolidayPrice*countOtHoliday),'editType':1,'incomeType':'FIX'};
                    }else{
                      incomeList.push({'code':'0008','name':'ล่วงเวลานักขัตฤกษ์','quantity':countOtHoliday,'price':otHolidayPrice,'total':(otHolidayPrice*countOtHoliday),'editType':1,'incomeType':'FIX'});
                    } 
                    isOld = false;
  
                    //009 ลาป่วย
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '009'){
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        //incomeList[countInloop]['quantity'] = 0;
                        incomeList[countInloop]['price'] = customerAuditConfig.wage;
                        incomeList[countInloop]['total'] = incomeList[countInloop]['price']*incomeList[countInloop]['quantity'];
                        isOld = true;
                      }
                    }
                    if(!isOld && this.checkPointModel.customerList[i].employeeList[j]['incomeList']){
                      for(let aa=0;aa<this.checkPointModel.customerList[i].employeeList[j]['incomeList'].length;aa++){
                        if(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa].code == '009'){
                          let obj = JSON.stringify(this.checkPointModel.customerList[i].employeeList[j]['incomeList'][aa]);
                          incomeList.push(JSON.parse(obj));
                        }
                      }
                      //incomeList.push({'code':'009','name':'ลาป่วย','quantity':1,'price':0.00,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }else if(!isOld && !this.checkPointModel.customerList[i].employeeList[j]['incomeList']){
                      incomeList.push({'code':'009','name':'ลาป่วย','quantity':0,'price':customerAuditConfig.wage,'total':0.00,'editType':1,'incomeType':'FIX'});
                    }
                    isOld = false; 
                    
                    //010 อื่นๆ
                    //หาส่วนต่าง audit กับ กฎหมาย
                    let wageAudit = 0.00;
                    if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                      wageAudit = customerAuditConfig.wage;
                    }
                    let diffFinance = 550 - (331 + (Math.ceil(331/8)*4));
                    let diffAudit = (331 + (Math.ceil(331/8)*4)) - (wageAudit + otPrice);
                    console.log(diffFinance)
                    console.log(diffAudit)
                    let diff = diffFinance + diffAudit;
                    let countDayNight010 = countDay+countNigth;
                    console.log(diff);
                    for(let countInloop=0;countInloop<incomeList.length;countInloop++){
                      if(incomeList[countInloop].code == '010'){
                        incomeList[countInloop]['quantity'] = countDayNight010;
                        incomeList[countInloop]['name'] = 'เงินเกษียณสะสม';
                        incomeList[countInloop]['price'] = diff;
                        incomeList[countInloop]['total'] = Number(countDayNight010*diff);
                        incomeList[countInloop]['editType'] = 1;
                        incomeList[countInloop]['incomeType'] = 'FIX';
                        isOld = true;
                      }
                    }
                    if(!isOld){
                      incomeList.push({'code':'010','name':'เงินเกษียณสะสม','quantity':countDayNight010,'price':diff,'total':Number(countDayNight010*diff),'editType':1,'incomeType':'FIX'});
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
                        if(incomeList[countInloop].code == '00'+(12+m) && incomeList[countInloop].name == name){
                          incomeList[countInloop] = {
                            'code':'00'+(12+m),
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
                          'code':'00'+(12+m),
                          'name':name,
                          'quantity':quantityItem,
                          'price':(totalItem/quantityItem),
                          'total':totalItem,
                          'editType':0, //0=มาจากการเช็กจุด ,1=ฝ่ายการเงินบัญชีแก้ไขหน้าใบยาวได้
                          'incomeType':'FIX'
                        });
                      } 
                    }
                    /*for(let q=0;q<incomeList.length;q++){
                      if(incomeList[q].code=='007' || incomeList[q].code == '008'){
                        incomeList[q].quantity = 0;
                      }
                    }*/
                    this.checkPointModel.customerList[i].employeeList[j]['incomeListAudit'] = incomeList;
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
                  let sumDay = 
                  incomeList[0].quantity+incomeList[1].quantity+incomeList[2].quantity+incomeList[3].quantity;
                  console.log('sumDay : ' + sumDay)
                  if(customerAuditConfig!=null && (customerAuditConfig.is_audit==1)){
                    this.checkPointModel.customerList[i]['isAudit']=true;
                    console.log(customerAuditConfig)
                    let sumDayAudit = 0;
                    let sumAddAudit = 0.00;
                    for(let a=0;a<incomeList.length;a++){
                      if(incomeList[a].code != '0008' && incomeList[a].code != '0001' && incomeList[a].code != '0002'){
                          if(incomeList[a].code=='001'){
                            sumDayAudit = sumDayAudit+incomeList[a].quantity;
                          }else if(incomeList[a].code=='002'){
                            sumDayAudit = sumDayAudit+incomeList[a].quantity;
                          }else{
                            sumAddAudit = sumAddAudit + incomeList[a].total;
                          }
                      }
                    }
                    summarySociety = Math.ceil(((sumDayAudit*(Number(customerAuditConfig.wage)))+sumAddAudit) * (societyPercent));
                  }else if(customerAuditConfig==null){
                    this.checkPointModel.customerList[i]['isAudit']=false;
                    summarySociety = Math.ceil((sumDay*manDay) * (societyPercent));
                  } 
                  console.log('summarySociety:' + summarySociety)
  
                  if(!employee.deductListAudit){
                    let deductExtendList = [];
                    let deductExtendList002 = [];
                    let deductExtendList003 = [];
                    let deductExtendList004 = [];
                    let deductList = [];
                    deductList.push({'code':'001','name':'ประกันสังคม(5%)','quantity':1,'price':0,'total':summarySociety,'editType':0,'incomeType':'FIX'});
                    //ค่าบ้าน
                    //deductList.push({'code':'002','name':'ค่าบ้าน','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList002,'editType':0,'incomeType':'FIX'});
                    //อุปกรณ์
                    //deductList.push({'code':'003','name':'อุปกรณ์','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList003,'editType':0,'incomeType':'FIX'});
                    //ประกันความเสียหาย
                    //deductList.push({'code':'004','name':'ประกันความเสียหาย','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList004,'editType':0,'incomeType':'FIX'});
                    //เบิกล่วงหน้า
                    //deductList.push({'code':'005','name':'เบิกล่วงหน้า','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList,'editType':0,'incomeType':'FIX'});
                    //ค่าโอน
                    //deductList.push({'code':'006','name':'ค่าโอน','quantity':1,'price':25,'total':25.00,'editType':0,'incomeType':'FIX'});
                    //อื่นๆ
                    //deductList.push({'code':'007','name':'อื่นๆ','quantity':1,'price':0,'total':0.00,'editType':0,'incomeType':'FIX'});
  
                    //this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'] = deductList;
                    
                    if(this.checkPointModel.customerList[i].employeeList[j]['deductList']){
                      let sumDeduction = 0.00;
                      for(let aa=0;aa<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;aa++){
                        if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][aa].code != '001'){
                          sumDeduction 
                          = sumDeduction + this.checkPointModel.customerList[i].employeeList[j]['deductList'][aa].total;
                        }
                      }

                      for(let aa=0;aa<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;aa++){
                        if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][aa].code == '005'){
                        //&&this.checkPointModel.customerList[i].employeeList[j]['deductList'][aa].code == '005'){
                          this.checkPointModel.customerList[i].employeeList[j]['deductList'][aa].total = sumDeduction;
                          let obj = JSON.stringify(this.checkPointModel.customerList[i].employeeList[j]['deductList'][aa]);
                          deductList.push(JSON.parse(obj));
                        }
                      }
                    }else{
                      //ค่าบ้าน
                      //deductList.push({'code':'002','name':'ค่าบ้าน','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList002,'editType':0,'incomeType':'FIX'});
                      //อุปกรณ์
                      //deductList.push({'code':'003','name':'อุปกรณ์','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList003,'editType':0,'incomeType':'FIX'});
                      //ประกันความเสียหาย
                      //deductList.push({'code':'004','name':'ประกันความเสียหาย','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList004,'editType':0,'incomeType':'FIX'});
                      //เบิกล่วงหน้า
                      deductList.push({'code':'005','name':'เบิกล่วงหน้า','quantity':1,'price':0,'total':0.00,'deductExtendList':deductExtendList,'editType':0,'incomeType':'FIX'});
                      //ค่าโอน
                      //deductList.push({'code':'006','name':'ค่าโอน','quantity':1,'price':25,'total':25.00,'editType':0,'incomeType':'FIX'});
                      //อื่นๆ
                      //deductList.push({'code':'007','name':'อื่นๆ','quantity':1,'price':0,'total':0.00,'editType':0,'incomeType':'FIX'});
                    }
                    this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'] = deductList;

                    //this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'] 
                    //= this.checkPointModel.customerList[i].employeeList[j]['deductList'];
                  }else{
                    //update ประกันสังคมเก่า
                    let sumDeduction = 0.00;
                    for(let aa=0;aa<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;aa++){
                      if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][aa].code != '001'){
                        sumDeduction 
                        = sumDeduction + this.checkPointModel.customerList[i].employeeList[j]['deductList'][aa].total;
                      }
                    }

                    let tmpDeductionAudit = [];
                    for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
                      if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '001'
                      ||this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '005'){

                        if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '001'){
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].total = summarySociety;
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].name = 'ประกันสังคม(5%)';
                        }
                        if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '004'){
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].name = 'ประกันความเสียหาย';
                        }
                        /*if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '007'){
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].quantity = 0;
                        }*/
    
                        //11/06/2022 พี่หลินแจ้งอัพเดทค่าโอนไม่ได้
                        
                        if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '006'){
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].price = 0; 
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].total = 0.00;
                        }
                        
                        if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '005'){
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].price = 0; 
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].total = sumDeduction;
                        }

                        if(!this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code.includes("A")){
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['editType'] = 0;
                          this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['incomeType'] = 'FIX';
                        } 
                        tmpDeductionAudit.push(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]);
                      } 
                    }
                    this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'] = tmpDeductionAudit;
                  }
                  //end deducttion list
  
               }
               this.calculate();
            }
          //}); 
        }
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
                for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['incomeListAudit'].length;x++){
                  if(this.checkPointModel.customerList[i].employeeList[j]['incomeListAudit'][x].code == incomeCode){
                    this.checkPointModel.customerList[i].employeeList[j]['incomeListAudit'][x].total 
                    = Number(this.checkPointModel.customerList[i].employeeList[j]['incomeListAudit'][x].price
                     * this.checkPointModel.customerList[i].employeeList[j]['incomeListAudit'][x].quantity);
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
              this.checkPointModel.customerList[i].employeeList[j]['incomeListAudit'].push({
                'code':'A'+(this.checkPointModel.customerList[i].employeeList[j]['incomeListAudit'].length),
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
              this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].push({
                'code':'A'+(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length),
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
                for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
                  if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == deductCode){
                    this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].total 
                    = Number(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].price 
                    * Number(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].quantity));
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
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == code){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList){
                  this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['deductExtendList'].push(
                    {'desc':'','amount':0.00}
                  );
                }else{
                  this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['deductExtendList'] = [];
                  this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['deductExtendList'].push(
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
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == code){
                
                this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['deductExtendList'].splice(countExtend005, 1);
                let sum005 = 0.00;
                for(let ii=0;ii<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['deductExtendList'].length;ii++){
                  let item = this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['deductExtendList'][ii];
                  sum005 = sum005 + item.amount;
                }
                this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].total = sum005;
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
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == code){
                
                let sum005 = 0.00;
                for(let ii=0;ii<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['deductExtendList'].length;ii++){
                  let item = this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x]['deductExtendList'][ii];
                  sum005 = sum005 + item.amount;
                }
                this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].total = sum005;
                this.calculate();
              }
            }
          }
        }
      }
    }
  }

  calculate(){
    console.log('calculate')
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
        
        let employee = this.checkPointModel.customerList[i].employeeList[j];
        if(!employee.isHH){
          let totalIncome = 0.00;
          let totalDeduct = 0.00;
          //income
          if(employee.incomeListAudit){
            for(let k=0;k<employee.incomeListAudit.length;k++){
              totalIncome = totalIncome + Number(employee.incomeListAudit[k].total);
            }
          }
          //deduct
          if(employee.deductListAudit){
            for(let k=0;k<employee.deductListAudit.length;k++){
              //if(employee.deductList[k].code != '003'){
                totalDeduct = totalDeduct + Number(employee.deductListAudit[k].total);
              //}
            }
          }
          this.checkPointModel.customerList[i].employeeList[j].totalIncomeAudit = totalIncome;
          this.checkPointModel.customerList[i].employeeList[j].totalDeductAudit = totalDeduct;
        }
      }
    }

  }

  updateCheckPoint(){
    let checkPoint = {
      'month':this.peroidMonth,
      'year':this.searchForm.get('year').value,
      'json_data':JSON.stringify(this.checkPointModel),
    };
    console.log(checkPoint);
    this.spinner.show();
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
  }


  monthChanged(){
    this.spinner.show();
    this.searchCheckPoint();
  }

  getCustomer(){
    this.spinner.show();
    console.log('getCustomer');
    $("#check-point-customer").DataTable().clear().destroy();
    this.customerList = [];
    this.customerService.getCustomerAuditList().subscribe(res=>{
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
    let checkPoint = {
      'month':this.peroidMonth,
      'year':this.searchForm.get('year').value,
      'json_data':JSON.stringify(this.checkPointModel),
    };
    this.checkPointService.createUpdateCheckPoint(checkPoint).subscribe(data => {
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
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '002'){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList){
                  deductExtendList002 = this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList;
                }
              }
            }

            let deductExtendList003 = [];
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '003'){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList){
                  deductExtendList003 = this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList;
                }
              }
            }

            let deductExtendList004 = [];
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '004'){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList){
                  deductExtendList004 = this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList;
                }
              }
            }

            let deductExtendList005 = [];
            for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'].length;x++){
              if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].code == '005'){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList){
                  deductExtendList005 = this.checkPointModel.customerList[i].employeeList[j]['deductListAudit'][x].deductExtendList;
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
            let request = {
              "customerName":this.checkPointModel.customerList[i].customerName,
              "employeeName":this.checkPointModel.customerList[i].employeeList[j].firstName
              +" "+this.checkPointModel.customerList[i].employeeList[j].lastName,
              "incomeList":this.checkPointModel.customerList[i].employeeList[j].incomeListAudit,
              "deductList":this.checkPointModel.customerList[i].employeeList[j].deductListAudit,
              "totalIncome":this.checkPointModel.customerList[i].employeeList[j].totalIncomeAudit,
              "totalDeduct":this.checkPointModel.customerList[i].employeeList[j].totalDeductAudit,
              "peroid": peroid,
              "deductExtendList002": deductExtendList002,
              "deductExtendList003": deductExtendList003,
              "deductExtendList004": deductExtendList004,
              "deductExtendList005": deductExtendList005,
              "workList": workList
            };
            console.log(request);
            this.slipService.cashSlipAuditMonthly(request).subscribe(res=>{
              console.log(res)
              console.log(res.data);
              window.open(this.constant.API_ENDPOINT + "/slip/download/audit/monthly");
            });
          }
        }
      }
    }
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
