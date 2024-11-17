import { Component, OnInit, OnChanges, AfterViewInit, ViewChild, ElementRef, NgZone, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import { CustomerService, CustomerCompanyService, CommonService, StockService, ReportService, MasterDataService } from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomerCompany } from '../../shared/model';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Constant } from '../../shared/constant/constant';
import { ProjectService } from 'src/app/shared/service/project.service';
import { SafeUrl } from '@angular/platform-browser';
import { QRCodeElementType } from "angularx-qrcode";
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { MapsAPILoader } from '@agm/core';

declare var jquery: any;
declare var $: any;
declare var Swal: any;
declare const google: any;

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer_add.component.html',
  styleUrls: ['./customer_add.component.css']
})
export class CustomerAddComponent implements OnInit, AfterViewInit {
  public initial_state = {
    allowEmptyString: true,
    alt: "A custom alt attribute",
    ariaLabel: `QR Code image with the following content...`,
    colorDark: "#000000ff",
    colorLight: "#ffffffff",
    cssClass: "center",
    elementType: "canvas" as QRCodeElementType,
    errorCorrectionLevel: "M" as QRCodeErrorCorrectionLevel,
    imageSrc: "./assets/angular-logo.png",
    imageHeight: 75,
    imageWidth: 75,
    margin: 4,
    qrdata: "https://github.com/Cordobo/angularx-qrcode",
    scale: 1,
    version: undefined,
    title: "A custom title attribute",
    width: 300,
  }

  public data_model = {
    ...this.initial_state,
  }

  public allowEmptyString: boolean
  public alt: string
  public ariaLabel: string
  public colorDark: string
  public colorLight: string
  public cssClass: string
  public elementType: QRCodeElementType
  public errorCorrectionLevel: QRCodeErrorCorrectionLevel
  public imageSrc?: string
  public imageHeight?: number
  public imageWidth?: number
  public margin: number
  public qrdata: string
  public scale: number
  public title: string
  public width: number
  
  public showImage: boolean

  addForm: FormGroup;
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
  isCustomerCompany = false;
  isShowCustomerCompany = false;

  //โครงการ
  project: any;
  projectList: any = [];

  //Map
  latitude!: number;
  longitude!: number;
  zoomLevel: number = 18;
  zoom: number = this.zoomLevel;
  address: string;
  private geoCoder;
  pointList: { lat: number; lng: number }[] = [];
  pointDbList: { lat: number; lng: number }[] = [];
  drawingManager: any;
  selectedShape: any;
  selectedArea = 0;
  drawingControlOptions = {
    drawingModes: ['polygon', 'polyline'] // Enable polygon and polyline drawing
  };
  polygon;
  isInit = true;
  mapType = 'roadmap';

  public customerCompanyCtrl: FormControl = new FormControl();
  public customerCompanyFilterCtrl: FormControl = new FormControl();
  public filteredCustomerCompanyList: ReplaySubject<CustomerCompany[]> = new ReplaySubject<CustomerCompany[]>(1);
  protected _onDestroy = new Subject<void>();

  formDataCustomerCompany: FormGroup;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  //public searchElementRef: ElementRef;
  @ViewChild('search', { static: true }) searchElementRef: ElementRef<HTMLInputElement>;

  constructor(
    private constant: Constant,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private stockService: StockService,
    private reportService: ReportService,
    private customerCompanyService: CustomerCompanyService,
    private masterDataService: MasterDataService,
    private httpService: HttpClient,
    private commonService: CommonService,
    private projectService: ProjectService,
    private router: Router,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { 
    this.allowEmptyString = this.data_model.allowEmptyString
    this.alt = this.data_model.alt
    this.ariaLabel = this.data_model.ariaLabel
    this.colorDark = this.data_model.colorDark
    this.colorLight = this.data_model.colorLight
    this.cssClass = this.data_model.cssClass
    this.elementType = this.data_model.elementType
    this.errorCorrectionLevel = this.data_model.errorCorrectionLevel
    this.imageSrc = this.showImage ? this.data_model.imageSrc : undefined
    this.imageHeight = this.showImage ? this.data_model.imageHeight : undefined
    this.imageWidth = this.showImage ? this.data_model.imageWidth : undefined
    this.margin = this.data_model.margin
    this.qrdata = this.customerId
    this.scale = this.data_model.scale
    this.title = this.data_model.title
    this.width = this.data_model.width

    this.addForm = fb.group({
      'name': ['', Validators.required],
      'customer_company_id': [''],
      'customer_company_name': ['', Validators.required],
      'customer_company_mobile': ['', Validators.required],
      'customer_company_email': ['', Validators.required],
      'customer_company_detail': ['', Validators.required],
      'customer_company_province': ['', Validators.required],
      'customer_company_amphur': ['', Validators.required],
      'customer_company_thumbon': ['', Validators.required],
      'customer_company_postcode': ['', Validators.required],
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
      'email': [''],
      'fax': [''],
      'website': [''],
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

      'note': [''],
      'hire_more': [''],
      'hire_extra': [''],
      'flag_check_location': ['']
    });
    
  }

  myAngularxQrCode: string = "";
  qrCodeDownloadLink: SafeUrl = "";
  onChangeURL(url: SafeUrl) {
    console.log(url)
    this.qrCodeDownloadLink = url;
  }

  saveAsImage(parent) {
    let parentElement = null

    if (this.elementType === "canvas") {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement.nativeElement
        .querySelector("canvas")
        .toDataURL("image/png")
    } else if (this.elementType === "img" || this.elementType === "url") {
      // fetches base 64 data from image
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
      parentElement = parent.qrcElement.nativeElement.querySelector("img").src
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.")
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = "angularx-qrcode"
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }

  isView = false
  display;
  customerId;
  customerCompanyList = [];
  ngOnInit() {
    this.activatedRoute.params.forEach((urlParams) => {
      if(urlParams['id'] && urlParams['display']){
        console.log(urlParams);
        this.customerId = urlParams['id'].replace('#', '');
        this.display = urlParams['display'].replace('#', '');
        if(this.display=='view'){
          this.isView = true
          this.addForm.disable();
        }
        console.log("customerId : "+this.customerId);
        this.isCustomerCompany = true
      }
    });

    this.formDataCustomerCompany = new FormGroup({
      valueSelect: new FormControl("")
    });

    if(this.customerCompanyList){
      var workSaleSurvey = {}
      workSaleSurvey["id"] = 0
      workSaleSurvey["name"] = "--- สร้างข้อมูลบริษัท (สำนักงานใหญ่) ---"
      this.customerCompanyList.push(workSaleSurvey)
    }
    
    this.addCustomerCreditLimit()
    this.addBenefit();
    this.getProvinceV2();
    this.getDateDropdownList();
    this.getTimeDropdownList();
    this.getStockList();
    this.getMasterData();
    this.getCustomerProject();
    this.addForm.controls.insurance.disable();

    if(!this.customerId){ 
      //load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation(false);
        this.geoCoder = new google.maps.Geocoder;
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(()=>{
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng(); 
            this.addForm.patchValue({
              latitude: this.latitude,
              longitude: this.longitude,
            });
          });
        }); 
      });
    }

  } 

  ngOnChanges(changes: SimpleChanges) { 
  }

  creditLimitPositionList = []
  getMasterData(){
    var param = {}
    param["category"] = "customer_credit_limit_position";
    $('#master_data_table').DataTable().clear().destroy();
    this.masterDataService.searchMasterData(param).subscribe(res=>{
      console.log(res);
      this.creditLimitPositionList = res;
      setTimeout(() => {
        $('#master_data_table').DataTable({
        });
      }, 100);
    });
  }

  ngAfterViewInit(){
    this.addForm.patchValue({
      start_work: "",
    });

    this.getAllForDropDown()
  }

  protected filterWorkSaleSurveys() {
    if (!this.customerCompanyList) {
      return;
    }
    // get the search keyword
    let search = this.customerCompanyFilterCtrl.value;
    if (!search) {
      this.filteredCustomerCompanyList.next(this.customerCompanyList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCustomerCompanyList.next(
      this.customerCompanyList.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  getAllForDropDown(){
    this.spinner.show();
    this.customerCompanyService.getAllForDropDown().subscribe(datas=>{
      console.log(datas);

      datas.forEach(data => {
        this.customerCompanyList.push(data);
      });

      // load the initial bank list
      this.filteredCustomerCompanyList.next(this.customerCompanyList.slice());

      // listen for search field value changes
      this.customerCompanyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterWorkSaleSurveys();
      });

      setTimeout(() => {
        this.isShowCustomerCompany = true;

        this.formDataCustomerCompany
        .get("valueSelect")
        .setValue(0);

        this.getProvince(undefined);
        this.spinner.hide();
      }, 100);

    }, err => {
      this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  filterMyOptions(data){
    console.log(data);

    var mobile = ""
    var email = ""
    if(data["contact"]){
      mobile = data["contact"]["mobile"]
      email = data["contact"]["email"]
    }

    var detail = ""
    var province = ""
    var amphur = ""
    var thumbon = ""
    var postcode = ""
    if(data["address"]){
      detail = data["address"]["detail"]

      this.getAmphurV2(data["address"]["provinceId"]);
      this.getThumbonV2(data["address"]["districtId"]);

      province = data["address"]["provinceId"]+"|"+data["address"]["province"]
      amphur = data["address"]["districtId"]+"|"+data["address"]["district"]
      thumbon = data["address"]["subdistrictId"]+"|"+data["address"]["subdistrict"]
      postcode = data["address"]["postcode"]
    }

    var customerCompanyName = ""
    if(data["id"] != 0){
      customerCompanyName = data["name"]
    }

    this.addForm.patchValue({
      customer_company_id: data["id"],
      customer_company_name: customerCompanyName,
      customer_company_mobile: mobile,
      customer_company_email: email,
      customer_company_detail: detail,
      
      customer_company_province: province,
      customer_company_amphur: amphur,
      customer_company_thumbon: thumbon,
      customer_company_postcode: postcode,
    })
    this.isCustomerCompany = true
  }

  customerCreditLimitList = []
  addCustomerCreditLimit(){
    var customerCreditLimit = {}
    customerCreditLimit["master_data_id"] = ""
    customerCreditLimit["moment"] = "D"
    customerCreditLimit["quantity"] = ""
    customerCreditLimit["price_per_person"] = ""
    customerCreditLimit["wage"] = 0
    customerCreditLimit["is_free"] = ""
    this.customerCreditLimitList.push(customerCreditLimit)
  }

  removeCustomerCreditLimit(index){
    this.customerCreditLimitList.splice(index,1);
  }

  customerBenefitList = []
  addBenefit(){
    var customerBenefit = {}
    customerBenefit["name"] = ""
    customerBenefit["wage"] = ""
    customerBenefit["unit_name"] = ""
    this.customerBenefitList.push(customerBenefit)
  }

  removeBenefit(index){
    this.customerBenefitList.splice(index,1);
  }

  customerWageList = []
  addWage(){
    var customerWage = {}
    customerWage["details"] = ""
    customerWage["wage"] = ""
    this.customerWageList.push(customerWage)
  }

  removeWage(index){
    this.customerWageList.splice(index,1);
  }

  hireMoreList = []
  addHireMore(){
    var hireMore = {}
    hireMore["details"] = ""
    if(!this.hireMoreList){
      this.hireMoreList = []
    }
    this.hireMoreList.push(hireMore)
  }

  removeHireMore(index){
    this.hireMoreList.splice(index,1);
  }

  hireExtraList = []
  addHireExtra(){
    var hireExtra = {}
    hireExtra["details"] = ""
    if(!this.hireExtraList){
      this.hireExtraList = []
    }
    this.hireExtraList.push(hireExtra)
  }

  removeHireExtra(index){
    this.hireExtraList.splice(index,1);
  }

  customerDaytimeShiftList = []
  addDaytimeShift(){
    var customerDaytimeShift = {}
    customerDaytimeShift["daytime_shift_start_hour_d"] = ""
    customerDaytimeShift["daytime_shift_start_min_d"] = ""
    customerDaytimeShift["daytime_shift_end_hour_d"] = ""
    customerDaytimeShift["daytime_shift_end_min_d"] = ""
    customerDaytimeShift["daytime_shift_start_hour_n"] = ""
    customerDaytimeShift["daytime_shift_start_min_n"] = ""
    customerDaytimeShift["daytime_shift_end_hour_n"] = ""
    customerDaytimeShift["daytime_shift_end_min_n"] = ""
    if(!this.customerDaytimeShiftList){
      this.customerDaytimeShiftList = []
    }
    this.customerDaytimeShiftList.push(customerDaytimeShift)
  }

  removeAddDaytimeShift(index){
    this.customerDaytimeShiftList.splice(index,1);
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

  selectedFirstDayWork(value: any, datepicker?: any) {
    var startWork = this.commonService.convertDateToStrng(value.start._d);
    console.log(startWork);
    this.addForm.patchValue({
      start_work: startWork
    });
  }

  submitted_add = false;
  saveCustomer(data){
    let value = data;
    console.log(value);
    this.submitted_add = true;
    if(this.addForm.invalid){
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

    if(value.customer_company_province){
      value.customerCompanyProvinceId = value.customer_company_province.split("|")[0];
      value.customerCompanyProvince = value.customer_company_province.split("|")[1];
    }
    if(value.customer_company_amphur){
      value.customerCompanyAmphurId = value.customer_company_amphur.split("|")[0];
      value.customerCompanyAmphur = value.customer_company_amphur.split("|")[1];
    }
    if(value.customer_company_thumbon){
      value.customerCompanyThumbonId = value.customer_company_thumbon.split("|")[0];
      value.customerCompanyThumbon = value.customer_company_thumbon.split("|")[1];
    }

    if(this.addForm.controls['start_work_y'].value && this.addForm.controls['start_work_m'].value && this.addForm.controls['start_work_d'].value){
      value['start_work'] = 
      (Number(this.addForm.controls['start_work_y'].value)-543)+'-'+this.addForm.controls['start_work_m'].value+'-'+this.addForm.controls['start_work_d'].value;  
    }

    if(this.addForm.controls['collect_data_y'].value && this.addForm.controls['collect_data_m'].value && this.addForm.controls['collect_data_d'].value){
      value['collect_data_date'] = 
      (Number(this.addForm.controls['collect_data_y'].value)-543)+'-'+this.addForm.controls['collect_data_m'].value+'-'+this.addForm.controls['collect_data_d'].value;
    }

    value['is_insurance'] = this.isInsurance

    value['stockList'] = this.stockList
    value['customerBenefitList'] = this.customerBenefitList
    value['customerWageList'] = this.customerWageList
    value['hireMoreList'] = this.hireMoreList
    value['hireExtraList'] = this.hireExtraList
    value['customerDaytimeShiftList'] = this.customerDaytimeShiftList
    value['customerCreditLimitList'] = this.customerCreditLimitList
    value['point_list'] = JSON.stringify(this.pointList);
    if(value['flag_check_location']){
      value['flag_check_location'] = 1;
    }else{
      value['flag_check_location'] = 0;
    }
    console.log(value);

    if(this.customerId){
      this.spinner.show();
      this.customerService.updateCustomer(this.customerId,value).subscribe(data => {
        this.successDialog();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog('');
      });
    }else{
      this.spinner.show();
      this.customerService.addCustomer(value).subscribe(data => {
        this.successDialog();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog('');
      });
    }
  }

  countryJson;
  getProvince(map) {
    this.countryJson = [];
    this.httpService.get("./assets/json/data.json").subscribe(
      data => {
        this.countryJson = data as string[]; // FILL THE ARRAY WITH DATA.
        // console.log(this.countryJson);
        if(this.customerId){
          this.getCustomer(this.customerId, map);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  amphurJson;
  getAmphur(e) {
    console.log(e)
    this.thumbonJson = [];
    this.amphurJson = [];
    this.addForm.patchValue({
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
    this.addForm.patchValue({
      thumbon: "",
      postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      this.thumbonJson = this.amphurJson[value[0]][1];
      let thumbons = this.thumbonJson[1];
      if(thumbons){
        this.addForm.patchValue({
          postcode: thumbons[1][0]
        });
      }
    }
  }

  postcode;
  getPost(e) {
    let value = e.split("|");
    let thumbons = this.thumbonJson[value[0]][1];
    this.postcode = thumbons[0];
    //console.log(this.postcode)
  }

  countryJsonV2;
  getProvinceV2() {
    this.countryJsonV2 = [];
    this.httpService.get("./assets/json/data.json").subscribe(
      data => {
        this.countryJsonV2 = data as string[]; // FILL THE ARRAY WITH DATA.
        // console.log(this.countryJson);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  amphurJsonV2;
  getAmphurV2(e) {
    this.thumbonJsonV2 = [];
    this.amphurJsonV2 = [];
    this.addForm.patchValue({
      customer_company_amphur: "",
      customer_company_thumbon: "",
      customer_company_postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      this.amphurJsonV2 = this.countryJsonV2[value[0]][1];
    }
  }

  thumbonJsonV2;
  getThumbonV2(e) {
    this.thumbonJsonV2 = [];
    this.addForm.patchValue({
      customer_company_thumbon: "",
      customer_company_postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      this.thumbonJsonV2 = this.amphurJsonV2[value[0]][1];
      let thumbons = this.thumbonJsonV2[1];
      if(thumbons){
        this.addForm.patchValue({
          customer_company_postcode: thumbons[1][0]
        });
      }
    }
  }

  postcodeV2;
  getPostV2(e) {
    let value = e.split("|");
    let thumbons = this.thumbonJsonV2[value[0]][1];
    this.postcodeV2 = thumbons[0];
    //console.log(this.postcode)
  }

  toggleInsurance(){
    this.isInsurance = !this.isInsurance;
    if(this.isInsurance){
      this.addForm.controls.insurance.enable();
    }else{
      this.addForm.controls.insurance.disable();
      this.addForm.controls.insurance.setValue('')
    }
  }

  complaintList
  customerStockList;
  start_work;
  getCustomer(customerId, map){
    this.customerService.getCustomerById(customerId).subscribe(data => { 
      console.log(data);
      this.spinner.hide();
      this.qrdata = data["id"]+"";
      if(data.customerCompany){
        this.filterMyOptions(data.customerCompany)

        // this.formDataCustomerCompany
        // .get("valueSelect")
        // .setValue(data.customerCompany);

      }

      this.complaintList = data.complaintList

      this.getAmphur(data["provinceId"]);
      this.getThumbon(data["districtId"]);
      this.start_work = data["start_work"];

      this.isInsurance = data["is_insurance"];
      if(this.isInsurance){
        this.addForm.controls.insurance.enable();
      }else{
        this.addForm.controls.insurance.disable();
        this.addForm.controls.insurance.setValue('')
      }

      this.customerStockList = data["customerStockList"];
      this.customerBenefitList = data["customerBenefitList"];
      this.customerWageList = data["customerWageList"];
      this.hireMoreList = data["hireMoreList"];
      this.hireExtraList = data["hireExtraList"];
      this.customerDaytimeShiftList = data["customerDaytimeShiftList"];
      this.customerCreditLimitList = data["customerCreditLimitList"];

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
      if(data["POINT_LIST"] != null && data["POINT_LIST"] != ""){
        this.pointDbList  = JSON.parse(data["POINT_LIST"]);
      }
      console.log('pointDbList',this.pointDbList)

      this.addForm.patchValue({
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

        note: data["note"],
        hire_more: data["hire_more"],
        hire_extra: data["hire_extra"],
        flag_check_location: data["flag_check_location"] == 1 ? true : false,
      });

      //load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
        //set latitude, longitude and zoom
        //this.latitude = data["latitude"];
        //this.longitude = data["longitude"]; 
        if(data["latitude"] && data["longitude"]){
          this.latitude = Number(data["latitude"]);
          this.longitude = Number(data["longitude"]); 
          this.setCurrentLocation(true);
        }else{
          this.setCurrentLocation(false);
        }
        this.geoCoder = new google.maps.Geocoder;
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(()=>{
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }  
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng(); 
            this.addForm.patchValue({
              latitude: this.latitude,
              longitude: this.longitude,
            });
          });
        }); 
      });
      //Init map
      this.initDrawingManager(map);
    });
  }

  exportDocument(){
    this.spinner.show();
    const params = this.getRequestParams();
    this.reportService.genReportCustomer(params).subscribe(resp => {
      console.log(resp);
      setTimeout(() => {
        this.spinner.hide();
        var url = this.constant.API_REPORT_ENDPOINT+"/tis/customer/exportDocument";
        console.log(url);
        window.open(url, '_blank');
      }, 100);
    }, err => {
      this.spinner.hide();
      this.failDialog('');
    });
  }


  getRequestParams() {
    let params = {};

    // if (this.workSaleSurveyId) {
    //   params[`workSaleSurveyId`] = this.workSaleSurveyId;
    // }
    
    params[`companyName`] = "บริษัทรักษาความปลอดภัย ทีสการ์ด กรุ๊ป จำกัด";
    var province = ''
    if(this.addForm.controls['province'].value){
      province = this.addForm.controls['province'].value.split("|")[1];
    }

    params[`placeWork`] = "สถานที่ปฏิบัติงาน "+this.addForm.controls['detail'].value + " " + province;
    
    params[`wageGuardsHeadD`] = this.addForm.controls['wage_guards_head_d'].value;
    params[`wageGuardsHeadN`] = this.addForm.controls['wage_guards_head_n'].value;
    params[`wageGuardsHeadAssistantD`] = this.addForm.controls['wage_guards_head_assistant_d'].value;
    params[`wageGuardsHeadAssistantN`] = this.addForm.controls['wage_guards_head_assistant_n'].value;
    params[`wageGuardsManD`] = this.addForm.controls['wage_guards_man_d'].value;
    params[`wageGuardsManN`] = this.addForm.controls['wage_guards_man_n'].value;
    params[`wageGuardsFemaleD`] = this.addForm.controls['wage_guards_female_d'].value;
    params[`wageGuardsFemaleN`] = this.addForm.controls['wage_guards_female_n'].value;
    params[`wageGuardsPartTimeD`] = this.addForm.controls['wage_guards_part_time_d'].value;
    params[`wageGuardsPartTimeN`] = this.addForm.controls['wage_guards_part_time_n'].value;

    console.log(params);
    return params;
  }

  getCustomerProject(){

  }

  getProject(){
    $("#project_list_table").DataTable().clear().destroy();
    this.projectList = [];
    this.projectService.getProject().subscribe(data=>{
      this.projectList = data;
      setTimeout(() => {$('#project_list_table').DataTable({});}, 10);
      $('#modal-project-list').modal('show');
      console.log(this.projectList);
    });
  }

  selectedProject(data){
    console.log(data);
    this.project = data;
    $('#modal-project-list').modal('hide');
  }

  //Map
  latLongChanged(){
    this.latitude = this.addForm.value.latitude;
    this.longitude = this.addForm.value.longitude;
    console.log(this.latitude)
    console.log(this.longitude)
    this.getAddress(this.latitude, this.longitude); 
  }

  private setCurrentLocation(init) { 
    if ('geolocation' in navigator) {
      console.log('have geo location')
      navigator.geolocation.getCurrentPosition((position) => {
        if(!init){
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        } 
        console.log(this.latitude)
        console.log(this.longitude)
        this.zoom = this.zoomLevel;
        //Patch value form
        this.addForm.patchValue({
          latitude: this.latitude,
          longitude: this.longitude,
        });
        this.getAddress(this.latitude, this.longitude); 
      });
    }else{
      console.log('not have geo location')
    }
  }

  onMapReady(map) {
    if(this.customerId){
      this.getProvince(map)
    }else{
      this.initDrawingManager(map);
    }
  }

  initDrawingManager = (map: any) => {
    console.log('initDrawingManager')
    console.log(google)
    const self = this;
    const options =  {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        strokeColor: '#8e44ad',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#8e44ad',
        fillOpacity: 0.35,
        draggable: true,
        editable: true,
      },
      drawingMode: 'polygon'
    };

    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                if (!event.overlay.drag) {
                  self.updatePointList(event.overlay.getPath());
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
          }
          self.updatePointList(event.overlay.getPath());
          this.selectedShape = event.overlay;
          this.selectedShape.type = event.type;
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          self.drawingManager.setDrawingMode(null);
          // To hide:
          self.drawingManager.setOptions({
            drawingControl: false,
          });
        }
      }
    );

    if(this.isInit && this.customerId){
      console.log('pointDbList', this.pointDbList)
      this.pointList = this.pointDbList;
      // Create an array to hold LatLng objects for the polygon vertices
      var polygonPath = [];

      // Convert each coordinate to a LatLng object and add to the polygonPath array
      for (var i = 0; i < this.pointDbList.length; i++) {
        var vertex = this.pointDbList[i];
        var latLng = new google.maps.LatLng(vertex.lat, vertex.lng);
        polygonPath.push(latLng);
      }
      // Create a new polygon using the polygonPath array
      this.polygon = new google.maps.Polygon({
        paths: polygonPath,
        strokeColor: '#8e44ad',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#8e44ad',
        fillOpacity: 0.35
      });
      // Display the polygon on the map
      this.polygon.setMap(map);  // Assuming 'map' is your Google Map instance
      this.isInit = false;
    }
  }

  deleteSelectedShape() {
    console.log(this.pointList);
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
    if(this.polygon){
      this.polygon.setMap(null);
    }
  }

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
    }
    this.selectedArea = google.maps.geometry.spherical.computeArea(
      path
    );
    console.log(this.pointList);
    console.log(this.selectedArea);
  }

  onMapClicked(event: any){
    console.table(event.coords);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    //Set Polygon
    //this.polygonPaths.push({ lat: event.coords.lat, lng: event.coords.lng });
    //Patch value form
    this.addForm.patchValue({
      latitude: this.latitude,
      longitude: this.longitude,
    });
    this.getAddress(this.latitude, this.longitude);
  }
/*
  mapMouseMove(event: any) {
    if (this.polygonPaths.length > 0) {
      const lastIndex = this.polygonPaths.length - 1;
      this.polygonPaths[lastIndex] = { lat: event.coords.lat, lng: event.coords.lng };
    }
  }
*/
  markerDragEnd(marker: any, event: any){
    console.table(event.coords);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    //Patch value form
    this.addForm.patchValue({
      latitude: this.latitude,
      longitude: this.longitude,
    });
    this.getAddress(this.latitude, this.longitude);
    //Test Check Marker
    let isInPolygon = this.isPointInPolygon({lat: event.coords.lat, lng: event.coords.lng}, this.pointList);
    console.log('isInPolygon', isInPolygon);
    if(isInPolygon){
      alert('อยู่ในพื้นที่');
    }
  }

  isPointInPolygon(point, polygonVertices) {
    var lat = point.lat;
    var lng = point.lng;
    var inside = false;
    var x = lng, y = lat;
    for (var i = 0, j = polygonVertices.length - 1; i < polygonVertices.length; j = i++) {
        var xi = polygonVertices[i].lng, yi = polygonVertices[i].lat;
        var xj = polygonVertices[j].lng, yj = polygonVertices[j].lat;

        var intersect = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
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

  changeMapType(type){
    this.mapType = type;
  }

  reload(){
    location.reload()
  }

  successDialog(){
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
    setTimeout(() => {this.router.navigate(['/customer']);}, 1000);
  }

  failDialog(msg){
    Swal.fire({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: msg
    })
  }
}
