import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, CustomerService, 
  MasterDataService, PermWorkRecordService, 
  CalendarHolidayService, CheckPointService ,SlipService,Constant, CommonService} from '../../shared';
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Bank, BANKS ,Customer, CUST} from '../../guard/permanent/guardCheckPoint/demo-data';
import { AdvMoneyService } from 'src/app/shared/service/advMoney.service';
import { SlipHistoryService } from 'src/app/shared/service/slipHistory.service';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {  

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
    private commonService: CommonService,
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
    this.yearList = this.commonService.generateBackWardYearList();
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
          //if(this.checkPointModel.customerList[i].id!=77){continue;}
          console.log(this.checkPointModel.customerList[i])
          console.log(this.advMoneyList);
          //customer audit
          //this.customerService.getCustomerAuditConfigByCustomerId(this.checkPointModel.customerList[i].id).subscribe(res=>{
            //let customerAuditConfig = res;
            //if(Object.keys(customerAuditConfig).length === 0){
              //customerAuditConfig = null;
            //}
            //console.log(customerAuditConfig); 
            for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
              //if(this.checkPointModel.customerList[i].employeeList[j].employeeId!=1595){continue;}
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
                  console.log(employee.deductList)
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
                                  amount:item.item[countAdvItem].amount,
                                  paidPeroid:splitPaidPeroid[0]
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
                      let splitMonth = this.searchForm.get('month').value.split('-');
                      let m = this.searchForm.get('month').value;
                          deductExtendList005.forEach(item => {
                            if(item.key && item.key != '' && item.key != null){
                              let splitDesc = item.desc.split('/');
                              console.log(splitDesc);
                              if(splitDesc.length === 2){
                                //if(splitMonth[1] == 0){
                                  if(m == item['paidPeroid']){
                                    item['dp'] = true;
                                  }else{
                                    item['dp'] = false;
                                  }
                              }else{
                                item['dp'] = true;
                              }
                            }else{
                              item['dp'] = true;
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
                        console.log(deductExtendList005);
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
                                  console.log('push2') 
                                  console.log(item.item);
                                  //filter
                                  let ext005Count = 0;
                                  for(let abc=0;abc<deductExtendList005.length;abc++){
                                    if(deductExtendList005[abc].key){
                                      if(deductExtendList005[abc].key == item.item[countAdvItem].item_id){
                                        deductExtendList005[abc]['paidPeroid'] = splitPaidPeroid[0];
                                        ext005Count++;
                                      }
                                    }else{
                                      //ext005Count++;
                                    }
                                  }
                                  console.log('ext005Count', ext005Count)
                                  console.log(deductExtendList005)
                                  if(ext005Count==0){ 
                                    deductExtendList005.push(
                                        {
                                          key:item.item[countAdvItem].item_id,
                                          desc:splitPickDate[2]+'/'+splitPickDate[1]+'',
                                          amount:item.item[countAdvItem].amount,
                                          paidPeroid:splitPaidPeroid[0]
                                        }
                                      )
                                  } 
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
                          let tmpDeductExtendList005 = [];
                          for(let abc=0;abc<deductExtendList005.length;abc++){
                            if(deductExtendList005[abc].desc != '2023/04'){
                              tmpDeductExtendList005.push(deductExtendList005[abc]);
                            }
                          }
                          /*this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'] = tmpDeductExtendList005;
                          this.deductionChange(this.checkPointModel.customerList[i].customerId,
                            this.checkPointModel.customerList[i].employeeList[j].employeeId,
                            '005',
                            null
                          );*/
                          let splitMonth = this.searchForm.get('month').value.split('-');
                          let m = this.searchForm.get('month').value;
                          deductExtendList005.forEach(item => {
                            if(item.key && item.key != '' && item.key != null){
                              let splitDesc = item.desc.split('/');
                              console.log(splitDesc);
                              if(splitDesc.length === 2){
                                //if(splitMonth[1] == 0){
                                if(m == item['paidPeroid']){
                                  item['dp'] = true;
                                }else{
                                  item['dp'] = false;
                                }
                              }else{
                                item['dp'] = true;
                              }
                            }else{
                              item['dp'] = true;
                            }
                          });
                          console.log(deductExtendList005);
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
               if(this.checkPointModel.customerList[i].employeeList[j]['deductList']){
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
                    {'desc':'','amount':0.00,'dp':true}
                  );
                }else{
                  this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'] = [];
                  this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'].push(
                    {'desc':'','amount':0.00,'dp':true}
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
            if(this.checkPointModel.customerList[i].employeeList[j]['deductList']){
              for(let x=0;x<this.checkPointModel.customerList[i].employeeList[j]['deductList'].length;x++){
                if(this.checkPointModel.customerList[i].employeeList[j]['deductList'][x].code == code){
                  
                  let sum005 = 0.00;
                  for(let ii=0;ii<this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'].length;ii++){
                    let item = this.checkPointModel.customerList[i].employeeList[j]['deductList'][x]['deductExtendList'][ii];
                    if(item.dp){
                      sum005 = sum005 + item.amount;
                    } 
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
              let sum005 = 0.00;
              if(employee.deductList[k].code === '005'){
                if(employee.deductList[k].deductExtendList){
                  employee.deductList[k].deductExtendList.forEach(item => {
                    if(item.dp){
                      sum005 = sum005 + Number(item.amount);
                    } 
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
          'month':this.peroidMonth,
          'year':this.searchForm.get('year').value,
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

    if(this.customerSearchId){
      for (let i = 0; i < this.checkPointModel.customerList.length; i++) {
        if (this.customerSearchId == this.checkPointModel.customerList[i].customerId) {
          for (let j = 0; j < this.checkPointModel.customerList[i].employeeList.length; j++) {
            this.calculateDeduct005(this.checkPointModel.customerList[i].customerId,
              this.checkPointModel.customerList[i].employeeList[j].employeeId,
              '005'
            );
          }
        }
      }
    } 

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
          'month':this.peroidMonth,
          'year':this.searchForm.get('year').value,
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
                  "tag": this.searchForm.get('year').value + '_' + this.searchForm.get('month').value,
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
                this.slipService.cashSlipMonthly(request).subscribe(res=>{
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
                    'W',
                    this.searchForm.get('year').value + '_' + this.searchForm.get('month').value);
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
