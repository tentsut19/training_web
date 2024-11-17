import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, CustomerService, 
  MasterDataService, PermWorkRecordService, 
  CalendarHolidayService, CheckPointService, PositionService } from '../../../shared';
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Bank, BANKS ,Customer, CUST} from '../guardCheckPoint/demo-data';

@Component({
  selector: 'app-guardCheckPoint',
  templateUrl: './guardCheckPoint.component.html',
  styleUrls: ['./guardCheckPoint.component.css']
})
export class GuardCheckPointComponent implements OnInit{  

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
  optionList=  [];

  customerSearchId = 0;
  cppass = '';
  hidePage = true;
  disabledSave = false;

checkPointModel = {
  'peroid':'06-01-2022',
  'customerList':[]
};

positionAllList = [];

//advance mode
advance = '';
tisToken;
changeFlag = true;

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
    private positionService: PositionService
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
    //this.checkPassword(); 
    this.advance = localStorage.getItem('advance');
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
    console.log('tisToken : ',this.tisToken);
    this.hidePage = false;
        this.currentYear = new Date().getFullYear();
        this.getAllPosition();
        this.getOptionList();
        this.generateYearList();
        this.getCustomer();
        this.getGuard();
        this.initDayList();
  }

  checkPassword(){
    if(!localStorage.getItem("cppass")){
      localStorage.setItem("cppass","");
    }
    this.checkPointService.getPassword().subscribe(res=>{
      //console.log(res.data);
      if(res.data.password != localStorage.getItem("cppass")){
        this.hidePage = true;
        $('#modal-checkpoint-password').modal('show');
      }else{
        this.hidePage = false;
        this.currentYear = new Date().getFullYear();
        this.getOptionList();
        this.generateYearList();
        this.getCustomer();
        this.getGuard();
        this.initDayList();
      }
    });
  }

  verifyPass(){
    this.checkPointService.getPassword().subscribe(res=>{
      if(res.data.password == this.cppass){
        localStorage.setItem("cppass",res.data.password);
        setTimeout(() => {location.reload();}, 1);
      }else{
        localStorage.setItem("cppass","");
        setTimeout(() => {location.reload();}, 1);
      }
    });
  }

  protected setInitialValue() {
    this.filteredCust
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Customer, b: Customer) => a && b && a.id === b.id;
      });
  }

  monthChanged(){
    this.searchCheckPoint();
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
    //this.changeFlag = false;
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

  filterestCustomerChaned($event){
    if(!this.changeFlag){
      //this.warningDialog();
    }
    this.changeFlag = false;
     
    /*console.log($event.value.id); 
    if(!this.changeFlag){
      this.warningDialog();
    }else{
      this.customerSearchId = $event.value.id;
    }*/
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
    
    for(let i=1;i<=31;i++){
      this.dayList.push(i);
    }
    //console.log(this.checkPointModel);
  }

  saveMode = 1;
  preSaveCheckPoint(value,saveMode){
    this.saveMode = saveMode;
    this.saveCheckPoint(value);
  }

  saveCheckPoint(value){
    //this.changeFlag = true;
    this.disabledSave = true;
    //this.spinner.show();
    let checkPointDb = {
      'peroid':'06-01-2022',
      'customerList':[]
    };
    //this.customerSearchId = this.searchForm.get('customerId').value;
    //console.log(this.customerSearchId);
    console.log(this.checkPointModel)
    let objCompare = null;
    let custsCompare = this.checkPointModel.customerList.filter(cus => cus.id == this.customerSearchId);
       console.log(custsCompare);
      if(custsCompare.length>0){
        objCompare = JSON.parse(JSON.stringify(custsCompare[0]));
      }

    let checkPointSearch = {
      'month':this.searchForm.get('month').value,
      'year':this.searchForm.get('year').value
    };
    console.log(checkPointSearch)
    let dupOldCustomer = false;
    this.checkPointService.getCheckPoint(checkPointSearch).subscribe(data=>{
      console.log(data);
      if(data.data != null){
        checkPointDb = JSON.parse(data.data['json_data']); 
        if(checkPointDb.customerList.length > 0){
          let countCust = 0;
          for(let i=0;i<checkPointDb.customerList.length;i++){
            //console.log('yyyyyyyy');
            countCust++;
            //dupOldCustomer = false;
            let custs = this.customerList.filter(cus => cus.id == checkPointDb.customerList[i].customerId);
            if(custs.length>0){
              let tmpEmployeeList = checkPointDb.customerList[i].employeeList;
              let tmpSummaryList = checkPointDb.customerList[i].summaryList;
              checkPointDb.customerList[i] = custs[0];
              console.log(custs[0])
              checkPointDb.customerList[i].customerId = checkPointDb.customerList[i].id;
              checkPointDb.customerList[i].customerName = checkPointDb.customerList[i].name;
              checkPointDb.customerList[i].employeeList = tmpEmployeeList;
              checkPointDb.customerList[i].summaryList = tmpSummaryList;
              //group position
              let positionGroupList = [];
              for(let j=0;j<custs[0].customerCreditLimit.length;j++){
                let positons = positionGroupList.filter(position => position.code == custs[0].customerCreditLimit[j].code);
                if(positons.length==0){
                  positionGroupList.push(custs[0].customerCreditLimit[j]);
                }
              }
              checkPointDb.customerList[i].positionGroupList = positionGroupList;
              if(this.customerSearchId == checkPointDb.customerList[i].id){
                if(objCompare!=null){
                  dupOldCustomer = true;
                  checkPointDb.customerList[i] = objCompare;
                }
              }
              console.log(checkPointDb)
            }
            if(checkPointDb.customerList.length === countCust){
              //console.log('xxxxxxxx')
              if(!dupOldCustomer){
                if(objCompare!=null){
                  checkPointDb.customerList.push(objCompare);
                }
              }
  
              let checkPoint = {
              };
              if(this.saveMode == 2){
                checkPoint = {
                  'month':this.searchForm.get('month').value,
                  'year':this.searchForm.get('year').value,
                  'json_data':JSON.stringify(this.checkPointModel),
                };
              }else{
                checkPoint = {
                  'month':this.searchForm.get('month').value,
                  'year':this.searchForm.get('year').value,
                  //'json_data':JSON.stringify(this.checkPointModel),
                  'json_data':JSON.stringify(checkPointDb),
                };
              } 
               
              console.log(checkPoint);
              this.spinner.show();
              this.checkPointService.createUpdateCheckPoint(checkPoint).subscribe(data => {
                this.disabledSave = false;
                //this.changeFlag = false;
                console.log(data)
                this.spinner.hide();
                //this.successDialog();
                this.searchCheckPoint();
              }, error => {
                this.spinner.hide();
                console.error(error);
                this.failDialog(error);
              });
  
            }//end asynch
          }//end loop 
        }else{
          let checkPoint = {
            'month':this.searchForm.get('month').value,
            'year':this.searchForm.get('year').value,
            'json_data':JSON.stringify(this.checkPointModel),
          };
          console.log(checkPoint);
              this.spinner.show();
              this.checkPointService.createUpdateCheckPoint(checkPoint).subscribe(data => {
                this.disabledSave = false;
                //this.changeFlag = false;
                console.log(data)
                this.spinner.hide();
                //this.successDialog();
                this.searchCheckPoint();
              }, error => {
                this.spinner.hide();
                console.error(error);
                this.failDialog(error);
              });
        }
      }else{
        //this.spinner.hide();
      }
    }); 
  }

  searchCheckPoint(){
    this.spinner.show();
    this.checkPointModel = {
      'peroid':'06-01-2022',
      'customerList':[]
    };
    //this.customerSearchId = this.searchForm.get('customerId').value;
    //console.log(this.customerSearchId);
    let checkPoint = {
      'month':this.searchForm.get('month').value,
      'year':this.searchForm.get('year').value
    };
    console.log(checkPoint)
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      console.log(data);
      if(data.data != null){
        this.checkPointModel = JSON.parse(data.data['json_data']);
        for(let i=0;i<this.checkPointModel.customerList.length;i++){
          let custs = this.customerList.filter(cus => cus.id == this.checkPointModel.customerList[i].customerId);
          if(custs.length>0){
            let tmpEmployeeList = this.checkPointModel.customerList[i].employeeList;
            let tmpSummaryList = this.checkPointModel.customerList[i].summaryList;
            this.checkPointModel.customerList[i] = custs[0];
            //console.log(custs[0])
            this.checkPointModel.customerList[i].customerId = this.checkPointModel.customerList[i].id;
            this.checkPointModel.customerList[i].customerName = this.checkPointModel.customerList[i].name;
            this.checkPointModel.customerList[i].employeeList = tmpEmployeeList;
            this.checkPointModel.customerList[i].summaryList = tmpSummaryList;
            //group position
            let positionGroupList = [];
            for(let j=0;j<custs[0].customerCreditLimit.length;j++){
              let positons = positionGroupList.filter(position => position.code == custs[0].customerCreditLimit[j].code);
              if(positons.length==0){
                positionGroupList.push(custs[0].customerCreditLimit[j]);
              }
            }
            this.checkPointModel.customerList[i].positionGroupList = positionGroupList;
            //console.log(this.checkPointModel)
          }
        }
        this.spinner.hide();
      }else{
        this.spinner.hide();
      }
    });
  }

  getCustomer(){
    this.spinner.show();
    $("#check-point-customer").DataTable().clear().destroy();
    this.customerList = [];
    this.customerService.getCustomer2().subscribe(res=>{
      this.customerList = res;
      //console.log(this.customerList);
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

      this.spinner.hide();
      setTimeout(() => {
        $('#check-point-customer').DataTable({
        });
      }, 10);
    });
  }
  

  getGuard(){
    $("#check-point-employee").DataTable().clear().destroy();
    this.employeeList = [];
    this.permWorkRecordService.getGuard().subscribe(res=>{
      this.employeeList = res;
      //console.log(this.employeeList);
      setTimeout(() => {
        $('#check-point-employee').DataTable({
        });
      }, 10);
    });
  }

  addCustomerToCheckPoint(customerId){
    let customerList = this.customerList.filter(cus => cus.id == customerId);
    /*let customer = {
      'customerId':customerList[0].id,
      'customerName':customerList[0].name,
      'employeeList':[]
      };*/
      if(customerList.length>0){
        let customer = customerList[0];
        customer['employeeList']=[];
        customer['summaryList']=[];
        customer['positionGroupList']=[];
        customer['customerId'] = customer['id'];
        customer['customerName'] = customer['name'];
        //group position
        let positionGroupList = [];
        for(let j=0;j<customer.customerCreditLimit.length;j++){
          let positons = positionGroupList.filter(position => position.code == customer.customerCreditLimit[j].code);
          if(positons.length==0){
            positionGroupList.push(customer.customerCreditLimit[j]);
          }
        }
        customer.positionGroupList = positionGroupList;
        console.log(customer);
        //check dup customer
        let isDupCustomer = false;
        for(let i=0;i<this.checkPointModel.customerList.length;i++){
          if(this.checkPointModel.customerList[i].customerId==customerId){
            isDupCustomer = true;
          }
        }
        console.log(isDupCustomer)
        if(!isDupCustomer){
          for(let ii=1;ii<=31;ii++){
            customer.summaryList.push({
              'date':ii,
              'status':'',
              'countD':0,
              'countN':0,
              'countTotal':0.00,
              'totalWageD':0.00,
              'totalWageN':0.00,
              'ref1':'',
              'ref2':'',
              'ref3':'',
              'ref4':''
            })
          }
          this.checkPointModel.customerList.push(customer);
        }
      }

    $('#modal-checkpoint-customer').modal('hide');
  }

  dialogSelectCustomer(){
    $('#modal-checkpoint-customer').modal('show');
  }
  selectCustomerId;
  dialogSelectEmployee(customerId){
    this.selectCustomerId = customerId;
    console.log(this.selectCustomerId);
    $('#modal-checkpoint-employee').modal('show');
  }

  addEmployeeToCheckPoint(employeeId){
    let empList = this.employeeList.filter(emp => emp.id == employeeId);
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
        if(this.checkPointModel.customerList[i].customerId == this.selectCustomerId){
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
            employee.workList.push({
              'date':ii,
              'status':'', //W=ทำงานปกติ,L=ลา,M=ขาด
              'day':false,
              'nigth':false,
              'waged':550,
              'wagen':550,
              'total':0.00,
              'paidStatus':'',
              'paidDate':null,
              'ref1':'',
              'ref2':'',
              'ref3':''
            })
          }
          this.checkPointModel.customerList[i].employeeList.push(employee);
        }
    }
    $('#modal-checkpoint-employee').modal('hide');
  }

  removeEmployee(employeeId,customerId){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            this.checkPointModel.customerList[i].employeeList.splice(j,1);
            break;
          }
        }
      }
    }
  }

  statusChanged(status,workPosition,employeeId,customerId){
    console.log(status)
    console.log(workPosition)
    console.log(employeeId)
    console.log(customerId)
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']=status;
            if(status != '' && status != 'A' && status != 'AA'){
              console.log(status)
              this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['day'] = false;
              this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['nigth'] = false;
            }
            console.log(this.checkPointModel)
          }
        }
      }
    }

    this.calculateTotalGuard(employeeId,customerId);
  }

  positionChanged(positionId,workPosition,employeeId,customerId){
    let customerList = this.customerList.filter(cus => cus.id == customerId);
    let waged = 550;
    let wagen = 550;
    if(customerList.length>0){
      let customer = customerList[0];
      for(let i=0;i<customer.customerCreditLimit.length;i++){
        if(customer.customerCreditLimit[i].code == positionId && customer.customerCreditLimit[i].moment == 'D'){
          waged = customer.customerCreditLimit[i].wage;
        }
        if(customer.customerCreditLimit[i].code == positionId && customer.customerCreditLimit[i].moment == 'N'){
          wagen = customer.customerCreditLimit[i].wage;
        }
      }

      for(let i=0;i<this.checkPointModel.customerList.length;i++){
        if(this.checkPointModel.customerList[i].customerId == customerId){
          for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
            if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
              for(let k=0;k<this.checkPointModel.customerList[i].employeeList[j].workList.length;k++){
                this.checkPointModel.customerList[i].employeeList[j].workList[k].waged = waged;
                this.checkPointModel.customerList[i].employeeList[j].workList[k].wagen = wagen;
              }
            }
          }
        }
      }

    }
    this.calculateTotalGuard(employeeId,customerId);
  }

  trigCheckBoxWorkAll(peroid,type,status,employeeId,customerId,$event){
    console.log(type)
    console.log(status)
    console.log(employeeId)
    console.log(customerId)
    console.log($event.target.checked)

    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){

            console.log(this.checkPointModel.customerList[i].employeeList[j].workList);

            for(let k=0;k<this.checkPointModel.customerList[i].employeeList[j].workList.length;k++){
              if((peroid==15 && k<=14) || (peroid==30 && k>14)){
                if($event.target.checked){
                  this.checkPointModel.customerList[i].employeeList[j].workList[k].status=status;
                  if(type == 'D'){
                    this.checkPointModel.customerList[i].employeeList[j].workList[k].day=true;
                  }
                  if(type == 'N'){
                    this.checkPointModel.customerList[i].employeeList[j].workList[k].nigth=true;
                  }
              }else{
                this.checkPointModel.customerList[i].employeeList[j].workList[k].status='';
                  if(type == 'D'){
                    this.checkPointModel.customerList[i].employeeList[j].workList[k].day=false;
                  }
                  if(type == 'N'){
                    this.checkPointModel.customerList[i].employeeList[j].workList[k].nigth=false;
                  }
              }
              }
            }


          }
        }
      }
    }
  }

  trigCheckBoxWork(type,workPosition,employeeId,customerId){
    console.log(workPosition)
    console.log(employeeId)
    console.log(customerId)
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){

            //set day and night
            if(type=='D'){
              this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['day']
              = !this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['day'];
            }else if(type=='N'){
              this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['nigth']
              = !this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['nigth'];
            }

            //check before status
            if(this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='AL'
            &&this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='ALW'
            &&this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='S'
            &&this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='H'
            &&this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='PA'
            &&this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='SL'
            &&this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='OFP'){
              
              if(this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='A'
              && this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='AA'
              && this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='HE'
              && this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='AAD'
              && this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='AAN'
              && this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']!='AADN'){

                this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']='W';

              }else if(this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']=='HE'){

                this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']='HE';

              }else if(this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']=='AAD'
              || this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']=='AAN'
              || this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']=='AADN'){

                this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status']
                =this.checkPointModel.customerList[i].employeeList[j].workList[workPosition]['status'];

              }
              
            } //End check before status
            //console.log(this.checkPointModel)
          }
        }
      }
    }
    this.calculateTotalGuard(employeeId,customerId);
  }

  addOption(employeeId,customerId){
    console.log(employeeId);
    console.log(customerId);
    let list = [];
    for(let i=1;i<=31;i++){
      let item = {'wage':0.00,'day':i};
      list.push(item);
    }
    let option = {'code':'001','name':'','wage':0.00,'list':list};
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            this.checkPointModel.customerList[i].employeeList[j].optionList.push(option);
          }
        }
      }
    }
    this.calculateTotalGuard(employeeId,customerId);
  }

  setWageOptionChanged(position,employeeId,customerId){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
              for(let k=0;k<this.checkPointModel.customerList[i].employeeList[j].optionList[position].list.length;k++){
                this.checkPointModel.customerList[i].employeeList[j].optionList[position].list[k].wage 
                = this.checkPointModel.customerList[i].employeeList[j].optionList[position].wage;
              }
          }
        }
      }
    }
    this.calculateTotalGuard(employeeId,customerId);
  }

  removeOption(position,employeeId,customerId){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            this.checkPointModel.customerList[i].employeeList[j].optionList.splice(position,1);
          }
        }
      }
    }
    this.calculateTotalGuard(employeeId,customerId);
  }

  calculateTotalGuard(employeeId,customerId){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
      if(this.checkPointModel.customerList[i].customerId == customerId){
        for(let j=0;j<this.checkPointModel.customerList[i].employeeList.length;j++){
          if(this.checkPointModel.customerList[i].employeeList[j].employeeId == employeeId){
            for(let ii=0;ii<this.checkPointModel.customerList[i].employeeList[j].workList.length;ii++){
                  //summary total general work
                  this.checkPointModel.customerList[i].employeeList[j].workList[ii].total = 0.00;
                  let checkPoint = this.checkPointModel.customerList[i].employeeList[j].workList[ii];
                  if(checkPoint.status != 'OF' && checkPoint.status != 'M' && checkPoint.status != ''){
                    if(checkPoint.day){
                      this.checkPointModel.customerList[i].employeeList[j].workList[ii].total=
                      Number(this.checkPointModel.customerList[i].employeeList[j].workList[ii].total)+
                      Number(this.checkPointModel.customerList[i].employeeList[j].workList[ii].waged);
                    }
                    if(checkPoint.nigth){
                      this.checkPointModel.customerList[i].employeeList[j].workList[ii].total=
                      Number(this.checkPointModel.customerList[i].employeeList[j].workList[ii].total)+
                      Number(this.checkPointModel.customerList[i].employeeList[j].workList[ii].wagen);
                    }
                    //summary option
                    for(let jj=0;jj<this.checkPointModel.customerList[i].employeeList[j].optionList.length;jj++){
                      this.checkPointModel.customerList[i].employeeList[j].workList[ii].total=
                      Number(this.checkPointModel.customerList[i].employeeList[j].workList[ii].total)+
                      Number(this.checkPointModel.customerList[i].employeeList[j].optionList[jj].list[ii].wage);
                    }
                  }
                  //End summary total general work
            }
          }
        }
      }
    }
    this.summaryCustomerTotal(customerId);
  }

  summaryCustomerTotal(customerId){
    for(let i=0;i<this.checkPointModel.customerList.length;i++){
        if(this.checkPointModel.customerList[i].customerId == customerId){
          for(let j=0;j<this.checkPointModel.customerList[i].summaryList.length;j++){
              let status='';
              let countD=0;
              let countN=0;
              let countTotal=0;
              //calculate checkpoint
              let empList = this.checkPointModel.customerList[i].employeeList;
              for(let ii=0;ii<empList.length;ii++){
                for(let jj=0;jj<empList[ii].workList.length;jj++){
                  if(this.checkPointModel.customerList[i].summaryList[j].date == empList[ii].workList[jj].date){
                    if(empList[ii].workList[jj].status != 'M'
                    && empList[ii].workList[jj].status != 'OF'
                    && empList[ii].workList[jj].status != 'L'
                    && empList[ii].workList[jj].status != 'AL'
                    && empList[ii].workList[jj].status != 'SL'
                    && empList[ii].workList[jj].status != ''){
                      //count day
                      if(empList[ii].workList[jj].day){
                        countD++;
                      }
                      //count nigth
                      if(empList[ii].workList[jj].nigth){
                        countN++;
                      }
                    }
                    countTotal = countD+countN;
                  }
                }
              }
              //End calculate checkpoint

              //update customer summary
              this.checkPointModel.customerList[i].summaryList[j].countD = countD;
              this.checkPointModel.customerList[i].summaryList[j].countN = countN;
              this.checkPointModel.customerList[i].summaryList[j].countTotal = countTotal;

              //update status
              this.checkPointModel.customerList[i].summaryList[j].status = 'W';
              let custCountD = 0;
              let custCountN = 0;
              console.log(this.checkPointModel.customerList[i].customerCreditLimit)
              for(let k = 0;k < this.checkPointModel.customerList[i].customerCreditLimit.length;k++){
                if(this.checkPointModel.customerList[i].customerCreditLimit[k].moment == 'D'){
                  custCountD = custCountD 
                  + this.checkPointModel.customerList[i].customerCreditLimit[k].quantity;
                }
                if(this.checkPointModel.customerList[i].customerCreditLimit[k].moment == 'N'){
                  custCountN = custCountN 
                  + this.checkPointModel.customerList[i].customerCreditLimit[k].quantity;
                }
              }
              if(this.checkPointModel.customerList[i].summaryList[j].countD == custCountD &&
                this.checkPointModel.customerList[i].summaryList[j].countN == custCountN){
                  this.checkPointModel.customerList[i].summaryList[j].status = 'S';
                }
          }//end loop customer summary
        }//end customer loop
    }
  }

  removeCust(index){
    console.log(index);
    this.checkPointModel.customerList.splice(index,1);
  }

  getPositionNameByEmployee(employeeId){
    let emps = this.employeeList.filter(emp => emp.id == employeeId);
    if(emps.length > 0){
      if(this.positionAllList && this.positionAllList.length > 0){
        //console.log(emps[0])
        let positions = this.positionAllList.filter(pos => pos.id == emps[0].position_id);
        if(positions.length > 0){
          return positions[0].name;
        } 
      }
    } 
    return "";
  }

  getAllPosition(){
    this.positionAllList = [];
    this.positionService.getPosition().subscribe(res=>{
      //console.log(res);
      this.positionAllList = res;
    })
  }

  successDialog(){
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
    setTimeout(() => {location.reload();}, 1000);
  }

  warningDialog(){
    Swal.fire("แจ้งเตือน!", "กรุณาบันทึกข้อมูลก่อนเปลี่ยนหน่วยงาน", "warning");
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
