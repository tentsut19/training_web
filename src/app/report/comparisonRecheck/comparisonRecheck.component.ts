import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, CustomerService, 
  MasterDataService, PermWorkRecordService, 
  CalendarHolidayService, CheckPointService ,SlipService,Constant} from '../../shared';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-comparisonRecheck',
  templateUrl: './comparisonRecheck.component.html',
  styleUrls: ['./comparisonRecheck.component.css']
})
export class ComparisonRecheckComponent implements OnInit {  

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

checkPointModel = {
  'peroid':'06-01-2022',
  'customerList':[]
};

checkPointModelCompare = {
  'peroid':'06-01-2022',
  'customerList':[]
};

checkPointRecheck = [];

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
   }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.generateYearList();
    //this.getCustomer();
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
            if(emps.length>0){
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
