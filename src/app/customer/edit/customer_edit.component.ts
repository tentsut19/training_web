import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CustomerService, MasterDataService, CommonService, StockService } from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer_edit.component.html',
  styleUrls: ['./customer_edit.component.css']
})
export class CustomerEditComponent implements OnInit {
  customerId;
  editForm: FormGroup;
  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true,
  };
  dayList;
  monthList;
  yearList;
  hourList;
  minList;

  isInsurance = false

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private stockService: StockService,
    private masterDataService: MasterDataService,
    private httpService: HttpClient,
    private commonService: CommonService,
    private fb: FormBuilder
  ) { 
    this.editForm = fb.group({
      'name': ['', Validators.required],
      'nearby_places': [''],
      'detail': ['', Validators.required],
      'province': ['', Validators.required],
      'amphur': ['', Validators.required],
      'thumbon': ['', Validators.required],
      'postcode': ['', Validators.required],
      'start_work': [''],
      'start_work_d': [''],
      'start_work_m': [''],
      'start_work_y': [''],
      'collect_data_date': [''],
      'collect_data_d': [''],
      'collect_data_m': [''],
      'collect_data_y': [''],
      'collect_data_hour': [''],
      'collect_data_min': [''],
      'personnel_collect_data': [''],
      'mobile': ['', Validators.required],
      'fax': [''],
      'website': [''],
      'email': ['', Validators.required],
      'contact_name_1': ['', Validators.required],
      'contact_position_1': ['', Validators.required],
      'contact_phone_number_1': ['', Validators.required],
      'contact_email_1': ['', Validators.required],
      'contact_name_2': [''],
      'contact_position_2': [''],
      'contact_phone_number_2': [''],
      'contact_email_2': [''],
      'contact_name_3': [''],
      'contact_position_3': [''],
      'contact_phone_number_3': [''],
      'contact_email_3': [''],
      'scan_customer_reports': [''],
      'scan_other_documents': [''],
      'scan_contract_record': [''],
      'scan_documents_in': [''],
      'scan_documents_out': [''],

      'number_security_guards_head_d': [''],
      'number_security_guards_head_d_pay': [''],
      'number_security_guards_head_n': [''],
      'number_security_guards_head_n_pay': [''],

      'number_security_guards_man_d': [''],
      'number_security_guards_man_d_pay': [''],
      'number_security_guards_man_n': [''],
      'number_security_guards_man_n_pay': [''],

      'number_security_guards_female_d': [''],
      'number_security_guards_female_d_pay': [''],
      'number_security_guards_female_n': [''],
      'number_security_guards_female_n_pay': [''],

      'number_security_guards_more_d': [''],
      'number_security_guards_more_d_pay': [''],
      'number_security_guards_more_n': [''],
      'number_security_guards_more_n_pay': [''],

      'wage_guards_head_d': [''],
      'wage_guards_head_n': [''],
      'wage_guards_head_assistant_d': [''],
      'wage_guards_head_assistant_n': [''],
      'wage_guards_man_d': [''],
      'wage_guards_man_n': [''],
      'wage_guards_female_d': [''],
      'wage_guards_female_n': [''],
      'wage_guards_part_time_d': [''],
      'wage_guards_part_time_n': [''],

      'insurance': [''],
      'is_insurance': [''],
      
      'daytime_shift_start_hour_d': [''],
      'daytime_shift_start_min_d': [''],
      'daytime_shift_end_hour_d': [''],
      'daytime_shift_end_min_d': [''],

      'daytime_shift_start_hour_n': [''],
      'daytime_shift_start_min_n': [''],
      'daytime_shift_end_hour_n': [''],
      'daytime_shift_end_min_n': [''],

      'latitude': [''],
      'longitude': [''],
    });
  }

  ngOnInit() {
    this.getProvince();
    this.getStockList();
    this.getDateDropdownList();
    this.getTimeDropdownList();
    this.activatedRoute.params.forEach((urlParams) => {
      this.customerId = urlParams['id'].replace('#', '');
      console.log("customerId : "+this.customerId);
    });
  } 

  ngAfterViewInit(){

  }

  customerBenefitList = []
  addBenefit(){
    var customerWage = {}
    customerWage["name"] = ""
    customerWage["wage"] = ""
    customerWage["unit_name"] = ""
    this.customerBenefitList.push(customerWage)
  }

  removeBenefit(index){
    this.customerBenefitList.splice(index,1);
  }

  stockList = [];
  getStockList(){
    this.stockList = [];
    this.stockService.get().subscribe(data => {
      console.log(data);
      this.stockList = data
      this.stockList.forEach(stock => {
        stock['quantity'] = 0
      })
    }, error => {
      console.error(error);
      this.failDialog('');
    });
  }

  getDateDropdownList(){
    //day list
    this.dayList = this.commonService.getDayList();
    //month list
    this.monthList = this.commonService.getMonthList();
    //year list
    this.yearList = this.commonService.getYearAdList();
  }

  getTimeDropdownList(){
    this.hourList = this.commonService.getHourList();
    this.minList = this.commonService.getMinList();
  }

  customerStockList;
  start_work;
  getCustomer(customerId){
    this.customerService.getCustomerById(customerId).subscribe(data => {
      console.log(data);
      this.getAmphur(data["provinceId"]);
      this.getThumbon(data["districtId"]);
      this.start_work = data["start_work"];

      this.isInsurance = data["is_insurance"];
      if(this.isInsurance){
        this.editForm.controls.insurance.enable();
      }else{
        this.editForm.controls.insurance.disable();
        this.editForm.controls.insurance.setValue('')
      }

      this.customerStockList = data["customerStockList"];
      this.customerBenefitList = data["customerBenefitList"];
      

      this.stockList.forEach(stock => {
        this.customerStockList.forEach(customerStock => {
            if(stock["id"] == customerStock["stockId"]){
              stock['quantity'] = customerStock["quantity"]
            }
        })
      })

      var startWorkD = ""
      var startWorkM = ""
      var startWorkY = 0
      if(data["start_work"] != null && data["start_work"] != ""){
        let startWork = data["start_work"].split("-")
        startWorkD = startWork[0]
        startWorkM = startWork[1]
        startWorkY = (Number(startWork[2])+543)
      }

      var collectDataD = ""
      var collectDataM = ""
      var collectDataY = 0
      if(data["collect_data_date"] != null && data["collect_data_date"] != ""){
        let collectDataDate = data["collect_data_date"].split("-")
        collectDataD = collectDataDate[0]
        collectDataM = collectDataDate[1]
        collectDataY = (Number(collectDataDate[2])+543)
      }

      this.editForm.patchValue({
        name: data["name"],
        nearby_places: data["nearby_places"],
        detail: data["detail"],
        start_work: data["start_work"],

        start_work_d: startWorkD,
        start_work_m: startWorkM,
        start_work_y: startWorkY,
        
        mobile: data["mobile"],
        fax: data["fax"],
        website: data["website"],
        email: data["email"],
        contact_name_1: data["contact_name_1"],
        contact_position_1: data["contact_position_1"],
        contact_phone_number_1: data["contact_phone_number_1"],
        contact_email_1: data["contact_email_1"],
        contact_name_2: data["contact_name_2"],
        contact_position_2: data["contact_position_2"],
        contact_phone_number_2: data["contact_phone_number_2"],
        contact_email_2: data["contact_email_2"],
        contact_name_3: data["contact_name_3"],
        contact_position_3: data["contact_position_3"],
        contact_phone_number_3: data["contact_phone_number_3"],
        contact_email_3: data["contact_email_3"],
        province: data["provinceId"]+"|"+data["province"],
        amphur: data["districtId"]+"|"+data["district"],
        thumbon: data["subdistrictId"]+"|"+data["subdistrict"],
        postcode: data["postcode"],
        scan_customer_reports: data["scan_customer_reports"],
        scan_other_documents: data["scan_other_documents"],
        scan_contract_record: data["scan_contract_record"],
        scan_documents_in: data["scan_documents_in"],
        scan_documents_out: data["scan_documents_out"],

        insurance: data["insurance"],
        is_insurance: data["is_insurance"],

        number_security_guards_head_d: data["number_security_guards_head_d"],
        number_security_guards_head_d_pay: data["number_security_guards_head_d_pay"],
        number_security_guards_head_n: data["number_security_guards_head_n"],
        number_security_guards_head_n_pay: data["number_security_guards_head_n_pay"],
        number_security_guards_man_d: data["number_security_guards_man_d"],
        number_security_guards_man_d_pay: data["number_security_guards_man_d_pay"],
        number_security_guards_man_n: data["number_security_guards_man_n"],
        number_security_guards_man_n_pay: data["number_security_guards_man_n_pay"],
        number_security_guards_female_d: data["number_security_guards_female_d"],
        number_security_guards_female_d_pay: data["number_security_guards_female_d_pay"],
        number_security_guards_female_n: data["number_security_guards_female_n"],
        number_security_guards_female_n_pay: data["number_security_guards_female_n_pay"],
        number_security_guards_more_d: data["number_security_guards_more_d"],
        number_security_guards_more_d_pay: data["number_security_guards_more_d_pay"],
        number_security_guards_more_n: data["number_security_guards_more_n"],
        number_security_guards_more_n_pay: data["number_security_guards_more_n_pay"],
        
        daytime_shift_start_hour_d: data["daytime_shift_start_hour_d"],
        daytime_shift_start_min_d: data["daytime_shift_start_min_d"],
        daytime_shift_end_hour_d: data["daytime_shift_end_hour_d"],
        daytime_shift_end_min_d: data["daytime_shift_end_min_d"],
        daytime_shift_start_hour_n: data["daytime_shift_start_hour_n"],
        daytime_shift_start_min_n: data["daytime_shift_start_min_n"],
        daytime_shift_end_hour_n: data["daytime_shift_end_hour_n"],
        daytime_shift_end_min_n: data["daytime_shift_end_min_n"],
        
        wage_guards_head_d: data["wage_guards_head_d"],
        wage_guards_head_n: data["wage_guards_head_n"],
        wage_guards_head_assistant_d: data["wage_guards_head_assistant_d"],
        wage_guards_head_assistant_n: data["wage_guards_head_assistant_n"],
        wage_guards_man_d: data["wage_guards_man_d"],
        wage_guards_man_n: data["wage_guards_man_n"],
        wage_guards_female_d: data["wage_guards_female_d"],
        wage_guards_female_n: data["wage_guards_female_n"],
        wage_guards_part_time_d: data["wage_guards_part_time_d"],
        wage_guards_part_time_n: data["wage_guards_part_time_n"],

        personnel_collect_data: data["personnel_collect_data"],

        collect_data_d: collectDataD,
        collect_data_m: collectDataM,
        collect_data_y: collectDataY,

        collect_data_hour: data["collect_data_hour"],
        collect_data_min: data["collect_data_min"],

        latitude: data["latitude"],
        longitude: data["longitude"],
        id: data["id"],
      });
    });
  }

  selectedFirstDayWork(value: any, datepicker?: any) {
    var startWork = this.commonService.convertDateToStrng(value.start._d);
    console.log(startWork);
    this.editForm.patchValue({
      start_work: startWork
    });
  }

  submitted_add = false;
  saveCustomer(data){
    let value = data;
    console.log(value);
    this.submitted_add = true;
    if(this.editForm.invalid){
      return;
    }

    if(value.province){
      value.provinceId = value.province.split("|")[0];
      value.province = value.province.split("|")[1];
    }
    if(value.amphur){
      value.amphurId = value.amphur.split("|")[0];
      value.amphur = value.amphur.split("|")[1];
    }
    if(value.thumbon){
      value.thumbonId = value.thumbon.split("|")[0];
      value.thumbon = value.thumbon.split("|")[1];
    }


    if(this.editForm.controls['start_work_y'].value && this.editForm.controls['start_work_m'].value && this.editForm.controls['start_work_d'].value){
      value['start_work'] = 
      (Number(this.editForm.controls['start_work_y'].value)-543)+'-'+this.editForm.controls['start_work_m'].value+'-'+this.editForm.controls['start_work_d'].value;  
    }

    if(this.editForm.controls['collect_data_y'].value && this.editForm.controls['collect_data_m'].value && this.editForm.controls['collect_data_d'].value){
      value['collect_data_date'] = 
      (Number(this.editForm.controls['collect_data_y'].value)-543)+'-'+this.editForm.controls['collect_data_m'].value+'-'+this.editForm.controls['collect_data_d'].value;
    }

    value['is_insurance'] = this.isInsurance

    value['stockList'] = this.stockList
    value['customerBenefitList'] = this.customerBenefitList

    console.log(value);

    this.customerService.updateCustomer(this.customerId,value).subscribe(data => {
      this.successDialog();
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  countryJson;
  getProvince() {
    this.countryJson = [];
    this.httpService.get("./assets/json/data.json").subscribe(
      data => {
        this.countryJson = data as string[]; // FILL THE ARRAY WITH DATA.
        // console.log(this.countryJson);
        this.getCustomer(this.customerId);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  amphurJson;
  getAmphur(e) {
    this.thumbonJson = [];
    this.amphurJson = [];
    this.editForm.patchValue({
      amphur: "",
      thumbon: "",
      postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      this.amphurJson = this.countryJson[value[0]][1];
    }
  }

  thumbonJson;
  getThumbon(e) {
    this.thumbonJson = [];
    this.editForm.patchValue({
      thumbon: "",
      postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      this.thumbonJson = this.amphurJson[value[0]][1];
      let thumbons = this.thumbonJson[1];
      this.editForm.patchValue({
        postcode: thumbons[1][0]
      });
    }
  }

  postcode;
  getPost(e) {
    let value = e.split("|");
    let thumbons = this.thumbonJson[value[0]][1];
    this.postcode = thumbons[0];
    //console.log(this.postcode)
  }

  toggleInsurance(){
    this.isInsurance = !this.isInsurance;
    if(this.isInsurance){
      this.editForm.controls.insurance.enable();
    }else{
      this.editForm.controls.insurance.disable();
      this.editForm.controls.insurance.setValue('')
    }
  }
  
  reload(){
    location.reload()
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
