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
  selector: 'app-guardNotWork',
  templateUrl: './guardNotWork.component.html',
  styleUrls: ['./guardNotWork.component.css']
})
export class GuardNotWorkComponent implements OnInit { 

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
  employeeCountWorkList = [];
  currentId;
  currentEmployee;

checkPointModel = {
  'peroid':'06-01-2022',
  'customerList':[]
}; 

checkPointModelCompare = {
  'peroid':'06-01-2022',
  'customerList':[]
}; 

checkModel1 = {
  'peroid':'06-01-2022',
  'customerList':[]
}
checkModel2 = {
  'peroid':'06-01-2022',
  'customerList':[]
}
checkModel3 = {
  'peroid':'06-01-2022',
  'customerList':[]
}

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
    this.getGuard();
    //this.initDayList();
    //this.searchCheckPoint();
    
    //this.seachMonth1();
    //this.seachMonth2();
    //this.seachMonth3();
    this.m1();
    this.m2();
    this.m3();
    this.m4();
    this.m5();
    this.m6();
    this.m7();
    this.m8();
    this.m9();
    this.m10();
    this.m11();
    this.m12();
    this.maa();
    this.mbb();
  }

  //For Fix Update
  md1;
  m1(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md1 = JSON.parse(data.data['json_data']);
        console.log(this.md1);
      }
    });
  }
  md2;
  m2(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md2 = JSON.parse(data.data['json_data']);
        console.log(this.md2);
      }
    });
  }
  md3;
  m3(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md3 = JSON.parse(data.data['json_data']);
        console.log(this.md3);
      }
    });
  }
  md4;
  m4(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md4 = JSON.parse(data.data['json_data']);
        console.log(this.md4);
      }
    });
  }
  md5;
  m5(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md5 = JSON.parse(data.data['json_data']);
        console.log(this.md5);
      }
    });
  }
  md6;
  m6(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md6 = JSON.parse(data.data['json_data']);
        console.log(this.md6);
      }
    });
  }
  md7;
  m7(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md7 = JSON.parse(data.data['json_data']);
        console.log(this.md7);
      }
    });
  }
  md8;
  m8(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md8 = JSON.parse(data.data['json_data']);
        console.log(this.md8);
      }
    });
  }
  md9;
  m9(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md9 = JSON.parse(data.data['json_data']);
        console.log(this.md9);
      }
    });
  }
  md10;
  m10(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md10 = JSON.parse(data.data['json_data']);
        console.log(this.md10);
      }
    });
  }
  md11;
  m11(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md11 = JSON.parse(data.data['json_data']);
        console.log(this.md11);
      }
    });
  }
  md12;
  m12(){
    let checkPoint = {
      'month':1+'',
      'year':2023+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.md12 = JSON.parse(data.data['json_data']);
        console.log(this.md12);
      }
    });
  }

  mdaa;
  maa(){
    let checkPoint = {
      'month':1+'',
      'year':2024+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.mdaa = JSON.parse(data.data['json_data']);
        console.log(this.mdaa);
      }
    });
  }

  mdbb;
  mbb(){
    let checkPoint = {
      'month':2+'',
      'year':2024+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.mdbb = JSON.parse(data.data['json_data']);
        console.log(this.mdbb);
      }
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

  seachMonth1(){
    console.log('seachMonth1');
    let currentMonth = Number(new Date().getMonth())+1;
    let currentYear = new Date().getFullYear();
    console.log(currentMonth);
    console.log(currentYear);
    let checkPoint = {
      'month':currentMonth+'',
      'year':currentYear+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.checkModel1 = JSON.parse(data.data['json_data']);
        console.log(this.checkModel1);
      }
    });
  }

  seachMonth2(){
    console.log('seachMonth2');
    let currentMonth = Number(new Date().getMonth());
    let currentYear = new Date().getFullYear();
    if(currentMonth==0){
      currentMonth=12;
      currentYear = currentYear-1;
    }
    console.log(currentMonth);
    console.log(currentYear);
    let checkPoint = {
      'month':currentMonth+'',
      'year':currentYear+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      if(data.data != null){
        this.checkModel2 = JSON.parse(data.data['json_data']);
        console.log(this.checkModel2);
      }
    });
  }

  seachMonth3(){
    this.spinner.show();
    console.log('seachMonth3');
    let currentMonth = Number(new Date().getMonth())-1;
    let currentYear = new Date().getFullYear();
    if(currentMonth==0){
      currentMonth=12;
      currentYear = currentYear-1;
    }else if(currentMonth<0){
      currentMonth=11;
      currentYear = currentYear-1;
    }
    console.log(currentMonth);
    console.log(currentYear);
    let checkPoint = {
      'month':currentMonth+'',
      'year':currentYear+''
    };
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      //console.log(data);
      this.spinner.hide();
      if(data.data != null){
        this.checkModel3 = JSON.parse(data.data['json_data']);
        console.log(this.checkModel3);
      }
    });
  }

  display(){
    console.log(this.employeeCountWorkList.length);
    //console.log(this.employeeCountWorkList);
    let tmpList = [];
    this.employeeCountWorkList.forEach(item => {
      tmpList.push({code:item.code, name: item.first_name+' '+item.last_name});
    });
    console.log(tmpList);
  }

  search2(){
    this.spinner.show();
    $('#tb-guard-notwork').DataTable().clear().destroy();
    this.employeeCountWorkList = [];
    for(let j=0;j<this.employeeList.length;j++){
      let countWork = 0;
      console.log(this.employeeList[j])
      //เดือน1
      for(let i=0;i<this.md1.customerList.length;i++){ 
        let customerItem = this.md1.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน2
      for(let i=0;i<this.md2.customerList.length;i++){ 
        let customerItem = this.md2.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน3
      for(let i=0;i<this.md3.customerList.length;i++){ 
        let customerItem = this.md3.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน4
      for(let i=0;i<this.md4.customerList.length;i++){ 
        let customerItem = this.md4.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน5
      for(let i=0;i<this.md5.customerList.length;i++){ 
        let customerItem = this.md5.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน6
      for(let i=0;i<this.md6.customerList.length;i++){ 
        let customerItem = this.md6.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน7
      for(let i=0;i<this.md7.customerList.length;i++){ 
        let customerItem = this.md7.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน8
      for(let i=0;i<this.md8.customerList.length;i++){ 
        let customerItem = this.md8.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน9
      for(let i=0;i<this.md9.customerList.length;i++){ 
        let customerItem = this.md9.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน10
      for(let i=0;i<this.md10.customerList.length;i++){ 
        let customerItem = this.md10.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน11
      for(let i=0;i<this.md11.customerList.length;i++){ 
        let customerItem = this.md11.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน12
      for(let i=0;i<this.md12.customerList.length;i++){ 
        let customerItem = this.md12.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน 1 2024
      for(let i=0;i<this.mdaa.customerList.length;i++){ 
        let customerItem = this.mdaa.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน 2 2024
      for(let i=0;i<this.mdbb.customerList.length;i++){ 
        let customerItem = this.mdbb.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      console.log('countWork : ',countWork);
      if(countWork==0){
        this.spinner.hide();
        this.employeeCountWorkList.push(this.employeeList[j]);
      } 
    } 
  }

  search(){
    this.spinner.show();
    $('#tb-guard-notwork').DataTable().clear().destroy();
    this.employeeCountWorkList = [];
    for(let j=0;j<this.employeeList.length;j++){
      let countWork = 0;
      console.log(this.employeeList[j])
      //เดือน1
      for(let i=0;i<this.checkModel1.customerList.length;i++){ 
        let customerItem = this.checkModel1.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน2
      for(let i=0;i<this.checkModel2.customerList.length;i++){ 
        let customerItem = this.checkModel2.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop

      //เดือน3
      for(let i=0;i<this.checkModel3.customerList.length;i++){ 
        let customerItem = this.checkModel3.customerList[i];
        const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
        if(result.length > 0){
          customerItem.employeeList.forEach(item => {
            //console.log(item); 
            if(item.employeeId == this.employeeList[j].id){
              for(let k=0;k<item.workList.length;k++){
                if(item.workList[k]['status'] != ''){
                  countWork++;
                }
              }
            }
          });//end employee loop
        } 
      }//end customer loop
      console.log('countWork : ',countWork);
      if(countWork==0){
        this.spinner.hide();
        this.employeeCountWorkList.push(this.employeeList[j]);
      }
      /*let parentThis = this;
      setTimeout(function() {
        if(countWork==0){
          parentThis.spinner.hide();
          parentThis.employeeCountWorkList.push(this.employeeList[j]);
        }
    }, 1500);*/
    }//end employee check loop 
    setTimeout(() => {
      $('#tb-guard-notwork').DataTable({
      });
    }, 3000);
  }

  searchCheckPoint(){
    return;
    this.employeeCountWorkList = [];
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
    //return;
    this.checkPointService.getCheckPoint(checkPoint).subscribe(data=>{
      console.log(data);
      if(data.data != null){
        this.checkPointModel = JSON.parse(data.data['json_data']);
        this.checkPointModelCompare = this.checkPointModel;

        console.log(this.checkPointModel);
        //add income and deduct list
        for(let j=0;j<this.employeeList.length;j++){
          let countWork = 0;
          for(let i=0;i<this.checkPointModel.customerList.length;i++){ 
            let customerItem = this.checkPointModel.customerList[i];
            //console.log(customerItem);
            const result = customerItem.employeeList.filter(em => em.employeeId == this.employeeList[j].id);
            if(result.length > 0){
              customerItem.employeeList.forEach(item => {
                console.log(item); 
                if(item.employeeId == this.employeeList[j].id){
                  for(let k=0;k<item.workList.length;k++){
                    if(item.workList[k]['status'] != ''){
                      countWork++;
                    }
                  }
                }
              });//end employee loop
            } 
          }//end customer loop
          //this.employeeList[j]['countWork'] = countWork;
          if(countWork==0){
            this.employeeCountWorkList.push(this.employeeList[j]);
          }
        }//end employee check loop 
        console.log(this.employeeCountWorkList)
        this.spinner.hide();
      }else{
        this.spinner.hide();
      }
    });
  } 
 
  monthChanged(){
    this.spinner.show();
    this.searchCheckPoint();
  } 

  getGuard(){
    this.employeeList = [];
    this.permWorkRecordService.getGuard().subscribe(res=>{
      res.forEach(item => {
        if((item.position_id == 1 || item.position_id == 2
          ||item.position_id == 21 || item.position_id == 22) && item.status == 'A' && item.start_work != null){
            let start_work = new Date(item.start_work); 
            if((Number(start_work.getFullYear()) < 2023)
            || ((Number(start_work.getFullYear()) == 2023) && ((start_work.getMonth() + 1) <= 10))){
              //if((Number(start_work.getFullYear()) == 2023)){
                console.log(start_work);
                console.log(start_work.getMonth());
                console.log(start_work.getFullYear());
              //} 
              this.employeeList.push(item);
            } 
          }
      });
      console.log(this.employeeList);
      //this.searchCheckPoint();
    });
  }

  openConfirmLeaveWork(employee){
    this.currentEmployee = employee;
    console.log(this.currentEmployee);
    $('#modal-leave-work').modal('show');
  }

  updateLeaveWork(){
    this.currentEmployee.status = 'O';
    this.currentEmployee.reason = 'ไม่ทำงานต่อเนื่อง';
    this.employeeService.updateEmployeeStatus(this.currentEmployee.id,this.currentEmployee).subscribe(res=>{
      this.successDialog();
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
