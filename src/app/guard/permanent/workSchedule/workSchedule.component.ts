import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, CustomerService, 
  MasterDataService, PermWorkRecordService, 
  CalendarHolidayService, CheckPointService ,SlipService,Constant} from '../../../shared';
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Bank, BANKS ,Customer, CUST} from '../../../guard/permanent/guardCheckPoint/demo-data';

@Component({
  selector: 'app-workSchedule',
  templateUrl: './workSchedule.component.html',
  styleUrls: ['./workSchedule.component.css']
})
export class WorkScheduleComponent implements OnInit {  

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

  scheduleModel = {
    customer_id:0,
    position: []
  };

  customerSearchId = 0;
  schedule = {
    'customerName':'',
    'list':[]
  };

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
    this.currentYear = new Date().getFullYear();
    this.generateYearList();
    this.getCustomer();
    //this.getGuard();
    this.generateYearList();
    this.initDayList();
    //this.searchCheckPoint();
    //this.initialData();
  }

  initDayList(){
    this.dayList = [];
    
    for(let i=1;i<=31;i++){
      this.dayList.push({value:i,status:'W'});
    }
    //console.log(this.checkPointModel);
  } 

  initialData(){
    for(let i=0;i<31;i++){
      this.dayList.push(i);
    }

    let position = {'positionName':'หัวหน้าชุด','workList':[]};
    for(let i=0;i<31;i++){
      let work = {'off':i%4==0?1:0};
      position.workList.push(work);
    }
    this.schedule.list.push(position);

    let position1 = {'positionName':'รปภ. ชาย','workList':[]};
    for(let i=0;i<31;i++){
      let work = {'off':i%2==0?1:0};
      position1.workList.push(work);
    }
    this.schedule.list.push(position1);

    let position2 = {'positionName':'รปภ. หญิง','workList':[]};
    for(let i=0;i<31;i++){
      let work = {'off':i%3==0?1:0};
      position2.workList.push(work);
    }
    this.schedule.list.push(position2);

    let position3 = {'positionName':'รปภ. หญิง','workList':[]};
    for(let i=0;i<31;i++){
      let work = {'off':i%6==0?1:0};
      position3.workList.push(work);
    }
    this.schedule.list.push(position3);
    console.log(this.schedule)
  }

  search(){
    this.spinner.show();
    console.log('search schedule')
    this.scheduleModel = {
      customer_id:0,
      position: []
    };
    let request = {
      'month':this.searchForm.get('month').value,
      'year':this.searchForm.get('year').value,
      'customer_id':this.customerSearchId
    };
    console.log(request);
    this.customerService.searchSchedule(request).subscribe(res=>{
      console.log(res);
      if(res.data!=null){
        this.scheduleModel = JSON.parse(res.data.json_data);
      }
      console.log(this.scheduleModel)
      this.spinner.hide();
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

  getCustomer(){
    this.spinner.show();
    $("#check-point-customer").DataTable().clear().destroy();
    this.customerList = [];
    this.customerService.getCustomer2().subscribe(res=>{
      this.spinner.hide();
      this.customerList = res;
      console.log(this.customerList);
      //this.searchCheckPoint();

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
    this.mockData();
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

  mockData(){
    //mock data
    this.schedule.list = [];
    let position = {'positionName':'หัวหน้าชุด','workList':[]};
    for(let i=0;i<31;i++){
      let work = {'off':i%2==0?1:0};
      position.workList.push(work);
    }
    this.schedule.list.push(position);

    let position1 = {'positionName':'รปภ. ชาย','workList':[]};
    for(let i=0;i<31;i++){
      let work = {'off':i%4==0?1:0};
      position1.workList.push(work);
    }
    this.schedule.list.push(position1);

    let position2 = {'positionName':'รปภ. หญิง','workList':[]};
    for(let i=0;i<31;i++){
      let work = {'off':i%5==0?1:0};
      position2.workList.push(work);
    }
    this.schedule.list.push(position2);

    let position3 = {'positionName':'รปภ. หญิง','workList':[]};
    for(let i=0;i<31;i++){
      let work = {'off':i%3==0?1:0};
      position3.workList.push(work);
    }
    this.schedule.list.push(position3);
    console.log(this.schedule)
    //end mock data
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
