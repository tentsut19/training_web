import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, ReportService, MasterDataService, SlipService, 
  CommonService, Constant, PermWorkRecordService} from '../../shared';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-reportSlip',
  templateUrl: './reportSlip.component.html',
  styleUrls: ['./reportSlip.component.css']
})
export class ReportSlipComponent implements OnInit { 

  startDate;
  endDate;
  editMode = false;

  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: false
  };

  processForm: FormGroup; 
  employeeList;
  guardPermPositionId = 1;
  submitted_process = false;
  incomeList;
  deductionList;
  workRecordList;
  employee;
  paymentDate;
  totalAmount = 0.00;
  totalIncome = 0.00;
  totalDeduction = 0.00;

  //for calculate day night
  countDay = 0;
  countNight = 0;
  totalAmountDay = 0.00;
  totalAmountNight = 0.00;
  totalSociety = 0.00;
  countHolidayDay = 0;
  countHolidayNight = 0;
  totalAmountHolidayDay = 0.00;
  totalAmountHolidayNight = 0.00;

  peroidDatePay:String = 'DD-MM-YYYY - DD-MM-YYYY';
  slip;
  textError = "";

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private reportService: ReportService,
    private masterDataService: MasterDataService,
    private slipService: SlipService,
    private commonService: CommonService,
    private constant: Constant,
    private permWorkRecordService: PermWorkRecordService,
    ) { 
      this.processForm = fb.group({
        'employee_id': ['', Validators.required],
        'peroid_date':['']
      });
   }


  ngOnInit() {
      this.startDate = new Date();
      this.endDate = new Date();
      this.getAllEmployee();
      this.paymentDate = this.getDateStr(new Date());
      //this.getPeroidDataPay();
  }

  getAllEmployee(){
    this.employeeList = [];
      this.employeeService.getEmployeeByPositionId(this.guardPermPositionId).subscribe(res=>{
        this.employeeList = res;
        console.log(this.employeeList);
      });
  }

  createSlip(){
    this.submitted_process = true;
    if(this.processForm.invalid){
      console.log("processForm invalid");
      return;
    }
    if(this.incomeList.length == 0 || this.deductionList.length == 0){
      return;
    }

    let request = {
      'employee_id':this.employee['id'],
      'peroid_start':this.commonService.convertDateToStrng(this.startDate),
      'peroid_end':this.commonService.convertDateToStrng(this.endDate),
      'payment_date':this.paymentDate,
      'incomeList':this.incomeList,
      'deductionList':this.deductionList
    }
    console.log(request);
    console.log(this.workRecordList);
    this.slipService.saveSlip(request).subscribe(res=>{
      console.log(res);
      this.permWorkRecordService.updatePaidStatusPermWorkRecord(this.workRecordList).subscribe(workRecordResUpdate=>{
        window.open(this.constant.API_ENDPOINT + "/slip/" + res.data.id);
        this.resetValue();
        this.successDialog();
      }, error => {
        console.error(error);
        this.failDialog(error);
      });  
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

processSlip(value){ 
    this.submitted_process = true;
    if(this.processForm.invalid){
      console.log("processForm invalid");
      return;
    }
    //check peroid date 15 day
    this.textError = "";
    let time_difference = this.endDate.getTime() - this.startDate.getTime(); 
    let days_difference = time_difference / (1000 * 60 * 60 * 24);
    console.log("days_difference : " + Math.ceil(days_difference));
    if(Math.ceil(days_difference) != 15){
      this.textError = 'ช่วงเวลาต้อง = 15 วัน';
      return;
    }
    //get employee
    this.employee = null;
    this.employeeService.getEmployeeById(value['employee_id']).subscribe(res=>{
        this.employee = res;
        console.log(this.employee);
    }, error => {
      console.error(error);
      this.failDialog(error);
    }); 

    this.getPeroidDataPay();

    //check old data
    let searchParam = {
      'employee_id':value['employee_id'],
      'peroid_start':this.commonService.convertDateToStrng(this.startDate),
      'peroid_end':this.commonService.convertDateToStrng(this.endDate)
    };
    //console.log(searchParam);
    this.slipService.searchSlip(searchParam).subscribe(res=>{
        this.resetValue();
        //console.log(res);
        this.slip = res;

        if(!Object.keys(res).length){
            this.editMode = false;

            //set income
              this.masterDataService.searchMasterData({'category':'pay_slip_income'}).subscribe(data=>{
                data.forEach(element => {
                  this.incomeList.push({'code':element.code,'name':element.data_value,'amount':0});
                });

                //calculate work recored ค่าแรง
                let param = {
                  'employee_id': value['employee_id'],
                  'peroid_start':this.getDateStr(this.startDate),
                  'peroid_end':this.getDateStr(this.endDate),
                  'day_type':'1'
                }
                this.permWorkRecordService.searchPermWorkPeroid(param).subscribe(data=>{ 
                  console.log(data)
                    data.forEach(element => {
                        //compare holiday 
                        if(element.work_status == 'W'){
                          if(element.work_peroid_type == 'D' && element.wage_holiday == 0){
                            this.countDay++;
                            this.totalAmountDay = this.totalAmountDay + element.wage;
                            this.workRecordList.push(element.id);
                          }else if(element.work_peroid_type == 'N' && element.wage_holiday == 0){
                            this.countNight++;
                            this.totalAmountNight = this.totalAmountNight + element.wage; 
                            this.workRecordList.push(element.id);
                          } 
                        }
                    });  
                });
                //End calculate work recored ค่าแรง

                //่ค่าแรงวันนักขัตฤกษ์
                let paramHoliday = {
                  'employee_id': value['employee_id'],
                  'peroid_start': this.getDateStr(this.startDate),
                  'peroid_end': this.getDateStr(this.endDate),
                  'day_type': '2'
                }
                this.permWorkRecordService.searchPermWorkPeroid(paramHoliday).subscribe(dataHoliday => {
                  console.log(dataHoliday)
                  let countHoliday = 0;
                  if(dataHoliday.length==0){
                      this.updateIncomeList();
                  }
                  dataHoliday.forEach(element => {
                    countHoliday++;  
                    //check holiday
                      let paramCheckHoliday = {
                        'peroid_start': this.getDateStr(this.startDate),
                        'peroid_end': this.getDateStr(this.endDate),
                        'holiday_date': element.work_date
                      };
                      this.slipService.checkPaidHoliday(paramCheckHoliday).subscribe(res => {
                        console.log('check paid holiday');
                        console.log(res);
                        if(res['message']=='P'){
                            if(element.work_peroid_type == 'D' && element.wage_holiday == 1){
                              this.countHolidayDay++;
                              this.totalAmountHolidayDay = this.totalAmountHolidayDay + element.wage;
                              this.workRecordList.push(element.id);
                              console.log(this.totalAmountHolidayDay);
  
                            }else if(element.work_peroid_type == 'N' && element.wage_holiday == 1){
                              this.countHolidayNight++;
                              this.totalAmountHolidayNight = this.totalAmountHolidayNight + element.wage; 
                              this.workRecordList.push(element.id);
                            } 
                        }
                        
                        if(countHoliday==dataHoliday.length){
                          this.updateIncomeList();
                        }
                         
                      });
                  });   
                });
                //่End ค่าแรงวันนักขัตฤกษ์  
            });

            //set deduction
            this.masterDataService.searchMasterData({'category':'pay_slip_deduction'}).subscribe(data=>{
              data.forEach(element => {
                this.deductionList.push({'code':element.code,'name':element.data_value,'amount':0});
              });
      
              //calculate work recored ค่าแรง
              let param = {
                'employee_id': this.employee['id'],
                'peroid_start':this.getDateStr(this.startDate),
                'peroid_end':this.getDateStr(this.endDate),
                'day_type':'1'
              }
              this.permWorkRecordService.searchPermWorkPeroid(param).subscribe(data=>{
                  data.forEach(element => {
                      if(element.work_status == 'W' && element.wage_holiday == 0){
                        //ประกันสังคมกลางวัน
                        this.totalSociety = this.totalSociety + (((element.wage/12))*8*0.05);
                      }
                  });
      
                  this.updateDeductionList();
              });
              //End calculate work recored deduction 
          }); 

        }else{
            this.editMode = true;
            this.paymentDate = res['payment_date'];
            this.totalIncome = res['total_income'];
            this.totalDeduction = res['total_deduction'];
            this.totalAmount = res['total_amount'];

            let slipItem = res['slip_items'];
            slipItem.forEach(element => {
              if(element.item_type == 'I'){
                  this.incomeList.push({'code':element.item_code,'name':element.item_name,'amount':element.amount});
              }else if(element.item_type == 'D'){
                  this.deductionList.push({'code':element.item_code,'name':element.item_name,'amount':element.amount});
              }
            });
        }
    });
 
    console.log(value);
  } 


  updateIncomeList(){
    //update list income
    this.incomeList.forEach(element => {
      //ค่าแรงกลางวัน
      if(element.code == '01'){
        element.name = 'กะกลางวัน ' + this.countDay + ' วัน';
        element.amount = this.totalAmountDay;
      }else if(element.code == '02'){
        element.name = 'กะกลางคืน ' + this.countNight + ' วัน';
        element.amount = this.totalAmountNight;
      }else if(element.code == '03'){
        element.amount = (this.totalAmountHolidayDay + this.totalAmountHolidayNight);
      }
    });
    this.calculate();
  }

  updateDeductionList(){
      //update list deduct
      this.deductionList.forEach(element => {
        //ประกันสังคมกลางวัน
        if(element.code == '02'){
          element.amount = this.totalSociety;
        }  
      });
      this.calculate();
  }
 

  updateBalanceIncome(code,event: any){
    console.log(code);
    console.log(event.target.value);
    this.incomeList.forEach(element => {
      if(element.code == code){
        element.amount = Number(event.target.value);
        this.calculate();
        console.log(element);
      }
    });
  }

  updateBalanceDeduct(code,event: any){
    console.log(code);
    console.log(event.target.value);
    this.deductionList.forEach(element => {
      if(element.code == code){
        element.amount = Number(event.target.value);
        this.calculate();
      }
    });
  } 

  calculate(){
    //sum income
    this.totalIncome = 0.00;
    this.incomeList.forEach(element => {
      this.totalIncome = this.totalIncome + element.amount;
    });
    //sum deduction
    this.totalDeduction = 0.00;
    this.deductionList.forEach(element => {
      this.totalDeduction = this.totalDeduction + element.amount;
    });
    //total amount
    this.totalAmount = this.totalIncome - this.totalDeduction;
  }
  
  printSlip(slipId){
    if(this.employee != null){
      window.open(this.constant.API_ENDPOINT + "/slip/" + slipId);
    } 
  }

  selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    this.startDate = value.start._d;
    console.log(this.startDate);
    this.endDate = value.end._d;
    console.log(this.endDate);
    this.getPeroidDataPay();
  }

  getPeroidDataPay(){
    this.peroidDatePay = this.getDateStr(this.startDate) + ' - ' + this.getDateStr(this.endDate);
  }

  resetValue(){
    //reset value
    this.workRecordList = [];
    this.totalAmount = 0.00;
    this.totalIncome = 0.00;
    this.totalDeduction = 0.00;
    this.totalSociety = 0.00;
    this.totalAmountDay = 0.00;
    this.totalAmountNight = 0.00;
    this.countDay = 0;
    this.countNight = 0;
    this.peroidDatePay = 'DD-MM-YYYY - DD-MM-YYYY';
    this.incomeList = [];
    this.deductionList = []; 
    this.countHolidayDay = 0;
    this.countHolidayNight = 0;
    this.totalAmountHolidayDay = 0.00;
    this.totalAmountHolidayNight = 0.00;
    //end reset value
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
