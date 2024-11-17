import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, ReportService, MasterDataService, SlipService, 
  CommonService, Constant, PermWorkRecordService} from '../../shared';
import * as fileSaver from 'file-saver';
import { AdvMoneyService } from 'src/app/shared/service/advMoney.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-advTransferPay',
  templateUrl: './advTransferPay.component.html',
  styleUrls: ['./advTransferPay.component.css']
})
export class AdvTransferPayComponent implements OnInit { 

  endDate;
  editMode = false;

  startDate;
  startDateStr;
  optionSingleDate: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
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
  bankCode = '';
  bankList = [];
  advList = [];
  advExportList = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private reportService: ReportService,
    private masterDataService: MasterDataService,
    private slipService: SlipService,
    private commonService: CommonService,
    private constant: Constant,
    private advMoneyService: AdvMoneyService,
    private spinner: NgxSpinnerService,
    ) { 
      this.processForm = fb.group({
        'employee_id': ['', Validators.required],
        'peroid_date':['']
      });
   }


  ngOnInit() {
      this.startDate = new Date();
      this.startDateStr = this.getDateStr(this.startDate);
      this.initBank();
  }

  initBank(){
    this.bankList.push(
      {'code':'','name':'ทั้งหมด'},
      {'code':'กรุงไทย','name':'กรุงไทย'},
      {'code':'all','name':'ทุกธนาคาร (ยกเว้นกรุงไทย)'},
      {'code':'กสิกร','name':'กสิกร'},
      {'code':'ไทยพาณิชย์','name':'ไทยพาณิชย์'},
      {'code':'UOB','name':'UOB'},
      {'code':'ออมสิน','name':'ออมสิน'},
      {'code':'TTB','name':'TTB'},
      {'code':'กรุงเทพ','name':'กรุงเทพ'},
      {'code':'กรุงศรีฯ','name':'กรุงศรีฯ'}
      )
  }

  search(){
    this.spinner.show();
    this.advList = [];
    this.advExportList = [];
    let criteria = {paidDate:''};
    if(this.startDate){
      console.log(this.startDateStr);
      let splitDate = this.startDateStr.split('-');
      criteria.paidDate = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0];
    }
    console.log(criteria);
    this.advMoneyService.searchByCriteria(criteria).subscribe(res=>{
      this.spinner.hide();
      console.log(res);
      this.advList = res.data;
      this.advList.forEach(item => {
          let isPush = false;
          let bankDetail = item.bank_account_no;
          if(this.bankCode != ''){
            let splitBankDetail = bankDetail.split(' ');
            if(splitBankDetail.length==2){
              if(this.bankCode == 'all'){
                if(splitBankDetail[1].trim() == 'กรุงไทย'){
                  isPush = false;
                }else{
                  isPush = true;
                }
              }else{
                if(this.bankCode == splitBankDetail[1].trim()){
                  isPush = true;
                }
              } 
            }
            if(bankDetail == '-'){
              isPush = false;
            }
          }else{
            isPush = true;
          }
          if(isPush){
            this.advExportList.push(item);
          } 
      });
    });
  }

  async exportFileBank(){
    this.spinner.show();
    console.log('exportFileBank'); 
    let dataList = [];
    this.advExportList.forEach(item => {
      let bankAcc: any = '';
      let splitBankDetail = item.bank_account_no.trim().split(' ');
      console.log(splitBankDetail)
      if(splitBankDetail.length >= 2){
        bankAcc = splitBankDetail[0].trim();
      }
      bankAcc = bankAcc.replaceAll('-','');
      dataList.push({
        bankCode: '006',
        recAcc: bankAcc,
        recName: item.first_name+' '+item.last_name,
        transferAmount: item.pick_total_amount,
        taxId: '',
        ddaRef1: '',
        ddaRef2: '',
        email: '',
        mobileNo: '',
      })
    });
    let request = {'tisExcelBankTransferItemList': dataList};
    this.reportService.getExcelBankFile(request).subscribe(res=>{
      this.spinner.hide();
      var url = this.constant.API_REPORT_ENDPOINT+"/report/tis/excel/bankFile/get";
      console.log(url);
      window.open(url, '_blank');
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
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
