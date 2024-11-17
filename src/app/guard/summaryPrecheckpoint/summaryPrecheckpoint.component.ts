import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, CustomerService, 
  MasterDataService, PermWorkRecordService, 
  CalendarHolidayService, CheckPointService, PositionService } from '../../shared';
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Bank, BANKS ,Customer, CUST} from '../summaryPrecheckpoint/demo-data';
import { PreCheckPointService } from 'src/app/shared/service/preCheckPoint.service';

@Component({
  selector: 'app-summaryPrecheckpoint',
  templateUrl: './summaryPrecheckpoint.component.html',
  styleUrls: ['./summaryPrecheckpoint.component.css']
})
export class SummaryPreCheckPointComponent implements OnInit{  

  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  searchForm: FormGroup;
  addForm: FormGroup;
  yearList;
  currentYear;
  dayList = [];
  dayObjList = [];
  customerList =  [];
  customerSummaryList =  [];
  employeeList = [];
  optionList=  [];

  customerSearchId = 0;
  cppass = '';
  hidePage = true;
  disabledSave = false;
  isSearch = false;
  searchType = 1;

  startDate;
  startDateStr;

  currMonth;
  currYear;

checkPointModel = {
  'peroid':'06-01-2022',
  'customerList':[]
};

positionAllList = [];

employeeWork = [];

//advance mode
advance = '';

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

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private masterDataService: MasterDataService,
    private permWorkRecordService: PermWorkRecordService,
    private calendarHolidayService: CalendarHolidayService,
    private customerService: CustomerService,
    private checkPointService: CheckPointService,
    private spinner: NgxSpinnerService,
    private positionService: PositionService,
    private preCheckPointService: PreCheckPointService
    ) { 
      this.searchForm = fb.group({
        'month':1,
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
    //this.checkPassword(); 
    this.advance = localStorage.getItem('advance');
    this.hidePage = false;
        this.currentYear = new Date().getFullYear();
        //this.getAllPosition();
        //this.getOptionList();
        this.generateYearList();
        this.getCustomer();
        //this.getGuard();
        this.initDayList();
  }


  summary(value) {
    this.isSearch = true;
    this.spinner.show();
    console.log(value)
    console.log(this.customerSearchId)
    //return;
    this.currMonth = value.month;
    this.currYear = value.year;
    const request = { month: value.month, year: value.year, customerId: this.customerSearchId };
    this.preCheckPointService.searchSummary(request).subscribe(res => {
      this.spinner.hide();
      console.log(res);
      //let countLoop = 0;
      let isNotCompleteWorkInCurrDay = false;
      this.customerSummaryList.forEach(item => {
        item['searchType'] = 1;
        //countLoop++;
        const sumOfQuantities = item.customerCreditLimit.reduce((total, item) => total + item.quantity, 0);
        item['sumOfQuantities'] = sumOfQuantities;
        //if (item.id === 173) {
          let dayList = JSON.parse(JSON.stringify(this.dayObjList));
          item['dayList'] = dayList;
          for (let i = 0; i < item.dayList.length; i++) {
            let countWork = 0;
            let countD = 0;
            let countN = 0;
            //assign day compare1
            let dayCompare1 = value.year + '-' + (((value.month + '').length === 1) ? '0' + value.month : value.month + '') + '-'
              + ((item.dayList[i].day + '').length === 1 ? '0' + item.dayList[i].day : item.dayList[i].day + '');
            for (let j = 0; j < res.data.length; j++) {
              //assign day compare2
              let dayCompare2 = res.data[j].checkin_date.substring(0, 10);
              //console.log('dayCompare1 : ', dayCompare1);
              //console.log('dayCompare2 : ', dayCompare2);
              if (item.id === res.data[j].customer_id && (dayCompare1 == dayCompare2)) {
                countWork++;
                if(res.data[j].day == 1){
                  countD++;
                }
                if(res.data[j].night == 1){
                  countN++;
                }
              }
            }//end pre check in
            item.dayList[i]['countWork'] = countWork;
            item.dayList[i]['countD'] = countD;
            item.dayList[i]['countN'] = countN;
            let compareDateCurr = new Date().getFullYear() + '-' + ((((new Date().getMonth()+1) + '').length === 1) ? '0' + (new Date().getMonth()+1) : (new Date().getMonth()+1) + '') + '-'
            + ((new Date().getDate() + '').length === 1 ? '0' + new Date().getDate() : new Date().getDate() + '');
            if(compareDateCurr === dayCompare1){
              if(countWork < sumOfQuantities){
                isNotCompleteWorkInCurrDay = true;
              }
            }
          }//end day list 

        //}  
      }); // end customer loop

      console.log(this.customerSummaryList);
    });

  }


  summary2(value) {
    this.isSearch = true;
    this.spinner.show();
    console.log(value)
    console.log(this.customerSearchId)
    //return;
    this.currMonth = this.startDateStr.substring(5,7);
    this.currYear = this.startDateStr.substring(0,4);
    const request = { month: this.startDateStr.substring(5,7), year: this.startDateStr.substring(0,4), customerId: this.customerSearchId };
    this.preCheckPointService.searchSummary(request).subscribe(res => {
      this.spinner.hide();
      console.log(res);
      //let countLoop = 0;
      let isNotCompleteWorkInCurrDay = false;
      this.customerSummaryList.forEach(item => {
        item['searchType'] = 2;
        //countLoop++;
        const sumOfQuantities = item.customerCreditLimit.reduce((total, item) => total + item.quantity, 0);
        item['sumOfQuantities'] = sumOfQuantities;
        //if (item.id === 173) {
          let dayList = JSON.parse(JSON.stringify(this.dayObjList));
          item['dayList'] = dayList;
          for (let i = 0; i < item.dayList.length; i++) {
            let countWork = 0;
            let countD = 0;
            let countN = 0;
            //assign day compare1
            let dayCompare1 = this.startDateStr.substring(0,4) + '-' + this.startDateStr.substring(5,7) + '-'
              + ((item.dayList[i].day + '').length === 1 ? '0' + item.dayList[i].day : item.dayList[i].day + '');
            for (let j = 0; j < res.data.length; j++) {
              //assign day compare2
              let dayCompare2 = res.data[j].checkin_date.substring(0, 10);
              //console.log('dayCompare1 : ', dayCompare1);
              //console.log('dayCompare2 : ', dayCompare2);
              if (item.id === res.data[j].customer_id && (dayCompare1 == dayCompare2)) {
                countWork++;
                if(res.data[j].day == 1){
                  countD++;
                }
                if(res.data[j].night == 1){
                  countN++;
                }
              }
            }//end pre check in
            item.dayList[i]['countWork'] = countWork;
            item.dayList[i]['countD'] = countD;
            item.dayList[i]['countN'] = countN;
            let compareDateCurr = this.startDateStr;
            if(compareDateCurr === dayCompare1){
              if(countWork < sumOfQuantities){
                isNotCompleteWorkInCurrDay = true;
              }
            }
          }//end day list 

        //}  
        item['isNotCompleteWorkInCurrDay'] = isNotCompleteWorkInCurrDay;
      }); // end customer loop

      console.log(this.customerSummaryList);
    });

  }

  selectedDate(value: any, datepicker?: any) {
    this.startDate = value.start._d;
    this.startDateStr = this.getDateStr(this.startDate);
    console.log(this.startDateStr);
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  protected setInitialValue() {
    this.filteredCust
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Customer, b: Customer) => a && b && a.id === b.id;
      });
  }

  monthChanged(){ 
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

  getOptionList(){
    let param = {'category':'check_point_option'};
    this.masterDataService.searchMasterData(param).subscribe(data=>{
      this.optionList = data;
      //console.log(this.optionList);
    });
  }

  generateYearList(){
    this.yearList = [];
    let currentYear = new Date().getFullYear();
    //console.log('currentYear : ' + currentYear);
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

  initDayList(){
    this.dayList = [];
    this.dayObjList = [];
    for(let i=1;i<=31;i++){
      this.dayList.push(i);
      this.dayObjList.push({day:i,countWork:0})
    }
    console.log(this.checkPointModel);
  }  

  getCustomer(){
    this.spinner.show();
    $("#check-point-customer").DataTable().clear().destroy();
    this.customerList = [];
    this.customerService.getCustomer2().subscribe(res=>{
      this.customerList = res;
      this.customerSummaryList = JSON.parse(JSON.stringify(this.customerList));
      //console.log(this.customerList);
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

      this.spinner.hide();
      setTimeout(() => {
        $('#check-point-customer').DataTable({
        });
      }, 10);
    });
  }    

  displayEmpWork(data, customerId){
    console.log('displayEmpWork',data)
    let request = {day:data.day, month: this.currMonth, year: this.currYear, customer_id: customerId};
    console.log(request);
    this.preCheckPointService.searchEmployeeWork(request).subscribe(res=>{
      console.log(res);
      this.employeeWork = res.data;
      $('#modal-employee-work').modal('show');
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
