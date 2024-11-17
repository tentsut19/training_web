import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, CustomerService, PasttimeWorkRecordService} from '../../../shared';

@Component({
  selector: 'app-pasttimeCheckpoint',
  templateUrl: './pasttimeCheckpoint.component.html',
  styleUrls: ['./pasttimeCheckpoint.component.css']
})
export class PasttimeCheckpointComponent implements OnInit { 

  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  startDate
  startDateStr;
  addForm: FormGroup;
  submitted_add = false;
  guardPasttimeList = [];
  guardPasttimePositionId = 2;
  customerList =  [];
  checkPointList = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private pasttimeWorkRecordService: PasttimeWorkRecordService
    ) { 
       this.addForm = fb.group({
        'checkpoin_date': [''],
        'customer_id': ['', Validators.required],
        'employee_id': ['', Validators.required]
      });
   }

  ngOnInit() {
       this.loadScript();
       this.startDate = new Date();
       this.startDate.setHours(0);
       this.startDate.setMinutes(0);
       this.startDate.setSeconds(0);

       //get guard pastime
       this.getGuardPasttime();
       //get customer
       this.getCustomer();
       //get current date
       this.startDateStr = this.getDateStr(new Date());
  }

  getGuardPasttime(){
      this.guardPasttimeList = [];
      this.employeeService.getEmployeeByPositionId(this.guardPasttimePositionId).subscribe(res=>{
        this.guardPasttimeList = res;
        //console.log(this.guardPasttimeList);
      })
  }

  getCustomer(){
    this.customerList = [];
    this.customerService.getCustomer().subscribe(res=>{
      this.customerList = res;
      //console.log(this.customerList);
    });
  }
  
  addCheckPoint(value){
    //console.log(value);
    this.submitted_add = true;
    if(this.addForm.invalid){
      console.log("addForm invalid");
      return;
    }

    let checkPointType = [];
    checkPointType.push({'type':'D','time':''});
    checkPointType.push({'type':'N','time':''});

    let isDupCustomer = false;
    let isDupEmployee = false;
    this.checkPointList.forEach(data=>{
        if(data['customer']['id'] == value['customer_id']){
          isDupCustomer = true;
          data['customer']['employee'].forEach(element => {
            if(element['id'] == value['employee_id']){
              isDupEmployee = true;
            }
          });
          //case not dup employee
          if(!isDupEmployee){
            let employee = this.filterData('employee',value['employee_id']);
            employee[0]['checkPointType'] = checkPointType;
            employee[0]['workDate'] = this.startDateStr;
            data['customer']['employee'].push(employee[0]);
          }
        }
    });

    if(!isDupCustomer){
      let customer = this.filterData('customer',value['customer_id']);
      let checkPoint = {'customer': customer[0]}
      checkPoint['customer']['employee'] = this.filterData('employee',value['employee_id']);
      
      //add day and night
      //gen check point type 
      checkPoint['customer']['employee'][0]['checkPointType'] = checkPointType;
      checkPoint['customer']['employee'][0]['workDate'] = this.startDateStr;
      this.checkPointList.push(checkPoint);
    }
    console.log(this.checkPointList);

  }

  saveCheckPoint(){
    this.pasttimeWorkRecordService.savePasttimeWorkRecord(this.checkPointList).subscribe(res=>{
        console.log(res.data);
        this.successDialog();
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }


 filterData(type,value) {
   if(type == 'customer'){
    return this.customerList.filter(object => {
      return object['id'] == value;
    });
   }else if(type == 'employee'){
    return this.guardPasttimeList.filter(object => {
      return object['id'] == value;
    });
   }
   return null;
  }

  selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    //console.log(value);
    this.startDate = value.start._d;
    //console.log(this.startDate);
    this.startDateStr = this.getDateStr(this.startDate);
    console.log(this.startDateStr);
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
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

  loadScript(){
     
  }

}
