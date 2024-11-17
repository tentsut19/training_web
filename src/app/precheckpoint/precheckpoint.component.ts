import { Component, OnInit ,ViewChild, ElementRef, NgZone} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { EmployeeService, CustomerService, 
  PasttimeWorkRecordService, CheckPointService,PermWorkRecordService, SlipService,Constant, ReportService,
  CommonService} from '../shared';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomerSeqService } from '../shared/service/customerSeq.service';
import { PreCheckPointService } from '../shared/service/preCheckPoint.service';
import { ReplaySubject, Subject } from 'rxjs';
import { Customer } from '../guard/summaryPrecheckpoint/demo-data';
import { MatSelect } from '@angular/material';
import { take, takeUntil } from 'rxjs/operators';
interface President {
  Name: string;
  Index: number;
}

@Component({
  selector: 'app-precheckpoint',
  templateUrl: './precheckpoint.component.html',
  styleUrls: ['./precheckpoint.component.css']
})
export class PreCheckPointComponent implements OnInit { 

  searchForm: FormGroup;
  startDate;
  startDateStr;
  endDate;
  endDateStr;
  currentDate;
  currentDateStr;
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
  datas = [];
  title: string = 'AGM project';
  latitude!: number;
  longitude!: number;
  zoomLevel: number = 10;
  zoom: number = this.zoomLevel;
  address: string;
  private geoCoder;

  checkPointModel = {
    'peroid':'06-01-2022',
    'customerList':[]
  };
  customerId;

  @ViewChild('search',{ static: true })
  public searchElementRef!: ElementRef;

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
    private mapsAPILoader: MapsAPILoader,
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
    private preCheckPointService: PreCheckPointService,
    private commonService: CommonService
    ) { 
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
       this.startDateStr = this.commonService.convertDateToStrng(new Date());

       this.endDate = new Date();
       this.endDate.setHours(0);
       this.endDate.setMinutes(0);
       this.endDate.setSeconds(0);
       this.endDateStr = this.commonService.convertDateToStrng(new Date());

       this.currentDate = new Date();
       this.currentDate.setHours(0);
       this.currentDate.setMinutes(0);
       this.currentDate.setSeconds(0);
       this.currentDateStr = this.commonService.convertDateToStrng(new Date());

       //get customer
       this.getCustomer();
       this.getGuard();
       //get current date
       //auto search
       this.search(this.searchForm.value);
       //this.getAllCustomerSeq();
       //this.initBank();
       this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder;
      });
      this.searchCheckPoint();
  }

  protected setInitialValue() {
    this.filteredCust
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Customer, b: Customer) => a && b && a.id === b.id;
      });
  }

  protected filterCust() {
    if (!this.customerList) {
      return;
    }
    if(this.custCtrl.value == null){return;}
    // get the search keyword
    console.log(this.custCtrl.value)
    this.customerId = this.custCtrl.value['id'];
    let search = this.custFilterCtrl.value;
    console.log(this.customerId)
    //this.changeFlag = false;
    if (!search) {
      this.filteredCust.next(this.customerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCust.next(
      this.customerList.filter(cust => cust.name.toLowerCase().indexOf(search) > -1)
    );
  }

  filterestCustomerChaned($event){ 
  }
 
  search(f){
    $("#checkpoint_table").DataTable().clear().destroy();
    this.datas = [];
    this.spinner.show(); 
    let criteria = {
      customerId: this.customerId,
      startDate: this.startDateStr,
      endDate: this.endDateStr
    };
    console.log(criteria);
    this.preCheckPointService.search(criteria).subscribe(res=>{
      this.spinner.hide(); 
      console.log(res);
      this.datas = res.data;
      this.datas.forEach(item => {
         item['process_status_display'] = this.getDisplayProcessStatus(item);
      });
      setTimeout(() => {
        $('#checkpoint_table').DataTable({
          "bSort" : false
        });
      }, 10);
    });
  }
 
  getDisplayProcessStatus(value){
    if(value.process_status == 'W'){
      return 'รอระบบอัพเดทข้อมูล';
    }else if(value.process_status == 'P'){
      return 'อยู่ระหว่างอัพเดทข้อมูล';
    }else if(value.process_status == 'S'){
      return 'อัพเดทข้อมูลเรียบร้อย';
    }
  }

  openDetail(value){
    console.log(value);
    this.latitude = value.lat;
    this.longitude = value.lon;
    this.getAddress(this.latitude,this.longitude);
    $('#modal-checkpoint-inout-view').modal('show');
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }
 
  private setCurrentLocation() { 
    if ('geolocation' in navigator) {
      console.log('have geo location')
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(this.latitude)
        console.log(this.longitude)
        this.zoom = this.zoomLevel;
        this.getAddress(this.latitude, this.longitude); 
      });
    }else{
      console.log('not have geo location')
    }
  }

  onMapClicked(event: any){
    console.table(event.coords);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      } 
    });
  }

  getCustomer(){
    this.customerList = [{id:'', name: 'ทั้งหมด'}];
    this.customerService.getCustomer().subscribe(res=>{
      console.log(res); 
      this.customerList.push(...res);
      //console.log(this.customerList);
      //this.spinner.hide();

      // set initial selection
    this.custCtrl.setValue(this.customerList[0]);

    // load the initial bank list
    this.filteredCust.next(this.customerList.slice());

    // listen for search field value changes
    this.custFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCust();
      });
    });
  }

  getGuard(){
    this.employeeList = [];
    this.preCheckPointService.getAllEmployee().subscribe(res=>{
      this.employeeList = res;
      console.log(this.employeeList);
      //this.spinner.hide();
    });
  }

  searchCheckPoint(){
    this.spinner.show();
    this.checkPointModel = {
      'peroid':'06-01-2022',
      'customerList':[]
    };
    let splitCurrDate = this.currentDateStr.split('-');
    let checkPoint = {
      'month':Number(splitCurrDate[1]),
      'year':2022
      //'year':Number(splitCurrDate[0])
    };
    console.log(checkPoint);
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      this.spinner.hide();
      //console.log(data);
      if(data.data != null){
        this.checkPointModel = JSON.parse(data.data['json_data']);
        console.log(this.checkPointModel);
      }
    });
  }

  wStatusChanged(i, $event){
    //console.log(i,$event.target.checked);
    if($event.target.checked){
      this.datas[i].w_status = 'W';
    }else{
      this.datas[i].w_status = 'HE';
    }
    console.log(this.datas[i])
  }

  checkAll($event){
    console.log('checkAll');
    this.datas.forEach(item => {
      item.w_status = $event.target.checked ? 'W' : 'HE';
    });
  }

  updateFinance(){
    this.loopProcess();
    this.processCreateUpdateCheckPoint();
  }

  async loopProcess(){
    /*if(this.customerList.length==0){
      this.spinner.show();
      this.getCustomer();
    }
    if(this.employeeList.length==0){
      this.spinner.show();
      this.getGuard();
    }*/

      console.log('updateFinance');
      console.log(this.checkPointModel);
      console.log(this.datas);
      let list = [];
      //return;
      await this.datas.forEach(item => {
        console.log(item);
        if(item.process_status === 'W' && item.checkin_date && item.checkout_date){
          let splitCheckIn = item.checkin_date.split(' ');
          let splitDateCheckIn = splitCheckIn[0].split('-');
          let splitTimeCheckIn = splitCheckIn[1].split(':');
          let isDay = item.day == 1 ? true : false;
          let isNight = item.night == 1 ? true : false;
          let in_late = item.in_late;
          let out_late = item.out_late;
          let checkin_date = item.checkin_date;
          let checkout_date = item.checkout_date;
          console.log(splitDateCheckIn);
          console.log(splitTimeCheckIn);
          console.log(this.checkPointModel);
          if(item.position_id === 2 || item.position_id === 22){
            item.w_status = 'PA';
          }
          //return;
          for(let i=0;i<this.checkPointModel.customerList.length;i++){
            let countHasEmp = 0;
            if(item.customer_id == this.checkPointModel.customerList[i].customerId){
              for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
                let emp = this.checkPointModel.customerList[i].employeeList[j];
                if(emp.employeeId == item.employee_id){
                  console.log(emp.workList)
                  countHasEmp++;
                }
              }//end loop employee
              console.log('countHasEmp : ', countHasEmp);
              //return;
              //add new employee 
              if(countHasEmp==0){
                let empList = this.employeeList.filter(emp => emp.id == item.employee_id);
                let employee = {
                  'employeeId':empList[0].id,
                  'firstName':empList[0].first_name,
                  'lastName':empList[0].last_name,
                  'tel':empList[0].mobile,
                  'position':0,
                  'workList':[],
                  'optionList':[]
                }; 
                for(let ii=1;ii<=31;ii++){ 
                  let date = Number(splitDateCheckIn[2]); 
                  employee.workList.push({
                    'date':ii,
                    'status':date==ii?item.w_status:'', //W=ทำงานปกติ,L=ลา,M=ขาด
                    'day':((date==ii)&&isDay)?true:false,
                    'nigth':((date==ii)&&isNight)?true:false,
                    'waged':550,
                    'wagen':550,
                    'total':0.00,
                    'paidStatus':'',
                    'paidDate':null,
                    'ref1':'',
                    'ref2':'',
                    'ref3':'',
                    'in_late': date==ii?in_late:0,
                    'out_late': date==ii?out_late:0,
                    'checkin_date': date==ii?checkin_date:'',
                    'checkout_date': date==ii?checkout_date:''
                  });
                }
                console.log(employee);
                this.checkPointModel.customerList[i].employeeList.push(employee);
              }else if(countHasEmp>0){
                //update checkpoin employee
                for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
                  let emp = this.checkPointModel.customerList[i].employeeList[j];
                  if(emp.employeeId == item.employee_id){
                    console.log(this.checkPointModel.customerList[i].employeeList[j].workList);
                    for(let k=0;k<this.checkPointModel.customerList[i].employeeList[j].workList.length;k++){
                      if(this.checkPointModel.customerList[i].employeeList[j].workList[k].date == Number(splitDateCheckIn[2])){
                        this.checkPointModel.customerList[i].employeeList[j].workList[k].status = item.w_status;
                        this.checkPointModel.customerList[i].employeeList[j].workList[k].day = isDay?true:false;
                        this.checkPointModel.customerList[i].employeeList[j].workList[k].nigth = isNight?true:false;
                        this.checkPointModel.customerList[i].employeeList[j].workList[k]['in_late'] = in_late;
                        this.checkPointModel.customerList[i].employeeList[j].workList[k]['out_late'] = out_late;
                        this.checkPointModel.customerList[i].employeeList[j].workList[k]['checkin_date'] = checkin_date;
                        this.checkPointModel.customerList[i].employeeList[j].workList[k]['checkout_date'] = checkout_date;
                        console.log(this.checkPointModel.customerList[i].employeeList[j].workList[k])
                      }
                    }
                  }
                }//end loop employee
              } 
            }
          }//end loop customer
          list.push(item);
          //update precheckin status
          /*this.preCheckPointService.updateSystemProcess(item).subscribe(res=>{
            console.log(res);
          });*/
        }
      });//end for each pre checkin

      this.preCheckPointService.updateSystemProcessList({list:list}).subscribe(res=>{
        console.log(res);
      });
  }

  processCreateUpdateCheckPoint(){
    this.spinner.show();
    console.log(this.checkPointModel);
    //return;
    let splitCurrDate = this.currentDateStr.split('-');
    let checkPoint = {
      'month': Number(splitCurrDate[1]),
      //'year':Number(splitCurrDate[0]),
      'year': 2022,
      'json_data': JSON.stringify(this.checkPointModel)
    };
    //console.log(JSON.stringify(this.checkPointModel));
    //return;
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

  export(){
    console.log('export'); 
    //this.spinner.show(); 
    let criteria = {
      customerId: this.customerId,
      startDate: this.startDateStr,
      endDate: this.endDateStr
    };
    console.log(criteria);
    const parentThis = this;
    this.preCheckPointService.export(criteria).subscribe(res=>{
      console.log(res);
      parentThis.spinner.hide();
      window.open(res.data);
    });
  }

  selectedDate($event, daterange){
    this.startDateStr  = this.commonService.convertDateToStrng($event.start._d);
    this.endDateStr  = this.commonService.convertDateToStrng($event.end._d);
    console.log('startDateStr : ',this.startDateStr, 'endDateStr : ', this.endDateStr);
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

}
