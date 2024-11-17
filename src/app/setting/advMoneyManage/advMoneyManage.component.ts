import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CompanyService, EmployeeService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';
import { ActivatedRoute } from '@angular/router';
import { AdvMoneyService } from 'src/app/shared/service/advMoney.service';
@Component({
  selector: 'app-advMoneyManage',
  templateUrl: './advMoneyManage.component.html',
  styleUrls: ['./advMoneyManage.component.css']
})
export class AdvMoneyManageComponent implements OnInit { 

  masterDataCategory = [];
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  masterDataList = [];
  yearList;
  employeeId;
  employee;
  advList = [];
  advId;
  advItemList = []; 
  monthTmpList = [
    {code:'1-0',desc:'มกราคม (1-15)'},{code:'1-1',desc:'มกราคม (16-31)'},{code:'2-0',desc:'กุมภาพันธ์ (1-15)'},{code:'2-1',desc:'กุมภาพันธ์ (16-29)'},{code:'3-0',desc:'มีนาคม (1-15)'},
    {code:'3-1',desc:'มีนาคม (16-31)'},{code:'4-0',desc:'เมษายน (1-15)'},{code:'4-1',desc:'เมษายน (16-30)'},{code:'5-0',desc:'พฤษภาคม (1-15)'},{code:'5-1',desc:'พฤษภาคม (16-31)'},
    {code:'6-0',desc:'มิถุนายน (1-15)'},{code:'6-1',desc:'มิถุนายน (16-30)'},{code:'7-0',desc:'กรกฎาคม (1-15)'},{code:'7-1',desc:'กรกฎาคม (16-31)'},{code:'8-0',desc:'สิงหาคม (1-15)'},
    {code:'8-1',desc:'สิงหาคม (16-31)'},{code:'9-0',desc:'กันยายน (1-15)'},{code:'9-1',desc:'กันยายน (16-30)'},{code:'10-0',desc:'ตุลาคม (1-15)'},{code:'10-1',desc:'ตุลาคม (16-31)'},
    {code:'11-0',desc:'พฤศจิกายน (1-15)'},{code:'11-1',desc:'พฤศจิกายน (16-30)'},{code:'12-0',desc:'ธันวาคม (1-15)'},{code:'12-1',desc:'ธันวาคม (16-31)'},
  ];
  monthList = [];

  startDate;
  startDateStr;
  optionSingleDate: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  }; 

  constructor(
    private masterDataService: MasterDataService,
    private activatedRoute: ActivatedRoute,
    private advMoneyService: AdvMoneyService,
    private employeeService: EmployeeService,
    private fb: FormBuilder
    ) { 
      this.searchForm = fb.group({
        'category': ['']
      });
      this.addForm = fb.group({
        'pick_date': [''],
        'pick_total_amount': ['',Validators.required],
        'total_installment': ['',Validators.required],
        'paid_per_installment': ['',Validators.required],
        'remark': [''],
        'month': ['',Validators.required],
        'year': ['',Validators.required],
      });
      this.editForm = fb.group({
        'category': ['', Validators.required],
        'code': ['', Validators.required],
        'data_value': ['', Validators.required],
        'description': [''],
        'id': ['', Validators.required],
      });
   }

  ngOnInit() {
    this.activatedRoute.params.forEach((urlParams) => {
      this.employeeId = urlParams['empId'].replace('#', '');
      console.log("employeeId : "+this.employeeId);
      this.getEmployeeById(this.employeeId);
      this.getAdvByEmployeeId(this.employeeId);
    });
    this.getMasterDataActive();
    this.search(this.searchForm.value);
    this.generateYearList();
    this.generateMonthList();
  }

  getEmployeeById(employeeId){
    console.log(employeeId)
    this.employeeService.getEmployeeByIdV2(employeeId).subscribe(res=>{
      this.employee = res;
      console.log(this.employee);
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
        'enYear':currentYear+i,
        'thYear':(currentYear+i) + 543
      };
      this.yearList.push(year);
    }
  }

  generateMonthList(){
    this.monthList = [];
    let d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    console.log(day);
    console.log(month);
    for(let i=0;i<this.monthTmpList.length;i++){

    }
  }

  getMasterDataActive(){
    this.masterDataService.getMasterDataCategory().subscribe(res=>{
        //console.log(res);
        this.masterDataCategory = res;
    });
  }

  search(param){
    console.log(param);
    $('#master_data_table').DataTable().clear().destroy();
    this.masterDataService.searchMasterData(param).subscribe(res=>{
      //console.log(res);
      this.masterDataList = res;
      setTimeout(() => {
        $('#master_data_table').DataTable({
        });
      }, 100);
    });
  }

  getAdvByEmployeeId(employeeId){
    $('#adv_money_data_table').DataTable().clear().destroy();
    this.advList = [];
    this.advMoneyService.getByEmployeeById(employeeId).subscribe(res=>{
      this.advList = res;
      setTimeout(() => {
        $('#adv_money_data_table').DataTable({
        });
      }, 100);
    });
  }

  addAdvMoney(value){
    console.log(value); 
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    value['employee_id'] = this.employeeId;
    let peroidList = [];
    let splitMonth = value.month.split('-');
    let week = Number(splitMonth[1]);
    let month = Number(splitMonth[0]);
    let year = Number(value.year);
    console.log('week : ' + week);
    console.log('month : ' + month);
    console.log('year : ' + year);

    let d = new Date();
    let currDay = d.getDate();
    let currMonth = d.getMonth() + 1;
    let currYear = d.getFullYear();

    console.log('week : ' + currDay);
    console.log('month : ' + currMonth);
    console.log('year : ' + currYear);
    if((month < currMonth) && (currYear == year)){
      Swal.fire({
        type: 'warning',
        title: 'ไม่สามารถทำรายการได้',
        text: 'รอบบิลที่เริ่มชำระ ต้องไม่น้อยกว่าเดือนปัจจุบัน'
      })
      return;
    } 

    for(let i=0;i<value['total_installment'];i++){
      peroidList.push(month+'-'+week+'_'+year);
      if(week==0){
        week++;
      }else if(week==1){
        week = 0;
        month++;
      }
      if(month>12){
        month=1;
        year++;
      }
    }
    console.log(peroidList);
    value['peroidList'] = peroidList;
    //return;
    if(this.startDate){
      let splitStartDate = this.startDateStr.split('-');
      value['pick_date'] = splitStartDate[2]+'-'+splitStartDate[1]+'-'+splitStartDate[0];
    } 
    console.log(value);
    this.advMoneyService.create(value).subscribe(res=>{
      $('#modal-adv-money-add').modal('hide');
      this.successDialog();
      setTimeout(() => {location.reload();}, 1000);
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  viewAdvItem(advId){
    this.advId = advId;
    console.log(this.advId);
    this.advItemList = [];
    $('#adv_money_view_table').DataTable().clear().destroy(); 
    this.advMoneyService.getItemByAdvId(this.advId).subscribe(res=>{
      this.advItemList = res;
      console.log(this.advItemList);
      for(let i=0;i<this.advItemList.length;i++){
        let peroidDisplay = '';
        let splitYear = this.advItemList[i].paid_peroid.split('_');
        let year = splitYear[1];
        let splitMonth = splitYear[0].split('-');
        peroidDisplay = this.getPeriod(splitMonth[0],splitMonth[1]) + ' ' + year;
        this.advItemList[i]['peroidDisplay'] = peroidDisplay;
      }

      $('#modal-adv-money-view').modal('show');
      setTimeout(() => {
        $('#adv_money_view_table').DataTable({
        });
      }, 100);
    })
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
  getPeriod(peroidMonth,peroidType){
    let peroid = '';
    if(peroidMonth == 1){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-31 ';
      }
      peroid = peroid + 'มกราคม ';
    }else if(peroidMonth == 2){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-29 ';
      }
      peroid = peroid + 'กุมภาพันธ์ ';
    }else if(peroidMonth == 3){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-31 ';
      }
      peroid = peroid + 'มีนาคม ';
    }else if(peroidMonth == 4){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-30 ';
      }
      peroid = peroid + 'เมษายน ';
    }else if(peroidMonth == 5){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-31 ';
      }
      peroid = peroid + 'พฤษภาคม ';
    }else if(peroidMonth == 6){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-30 ';
      }
      peroid = peroid + 'มิถุนายน ';
    }else if(peroidMonth == 7){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-31 ';
      }
      peroid = peroid + 'กรกฎาคม ';
    }else if(peroidMonth == 8){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-31 ';
      }
      peroid = peroid + 'สิงหาคม ';
    }else if(peroidMonth == 9){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-30 ';
      }
      peroid = peroid + 'กันยายน ';
    }else if(peroidMonth == 10){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-30 ';
      }
      peroid = peroid + 'ตุลาคม ';
    }else if(peroidMonth == 11){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-30 ';
      }
      peroid = peroid + 'พฤศจิกายน ';
    }else if(peroidMonth == 12){
      if(peroidType == 0){
        peroid = peroid + '1-15 ';
      }else if(peroidType == 1){
        peroid = peroid + '16-30 ';
      }
      peroid = peroid + 'ธันวาคม ';
    } 
    return peroid;
  }

  currentId;
  deleteAdvItem(id){
    this.currentId = id;
    console.log(this.currentId);
    $('#modal-remove').modal('show');
  }

  deleteProcess(){
    this.advMoneyService.delete(this.currentId).subscribe(res=>{
      $('#modal-remove').modal('hide');
      this.successDialog();
      setTimeout(() => {location.reload();}, 1000);
    })
  }

}
