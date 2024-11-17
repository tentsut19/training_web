import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { EmployeeService, MasterDataService, UploadFilesService, CommonService, CompanyService, 
  DepartmentService, PositionService, FileManagerService, BadHistoryService, ReasonLeaveWorkService ,
  RemarkEmployeeService, RecommenderService, CostEquipmentService } from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee_edit.component.html',
  styleUrls: ['./employee_edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  employeeId;
  employee;
  editForm: FormGroup;
  remarkList = [];
  remarkDetail = "";
  shareId = 0;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private masterDataService: MasterDataService,
    private uploadService: UploadFilesService,
    private commonService: CommonService,
    private fileManagerService: FileManagerService,
    private badHistoryService: BadHistoryService,
    private reasonLeaveWorkService: ReasonLeaveWorkService,
    private remarkEmployeeService: RemarkEmployeeService,
    private recommenderService: RecommenderService,
    private costEquipmentService: CostEquipmentService,
    private spinner: NgxSpinnerService,
    private httpService: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.editForm = fb.group({
      'gender': [''],
      'prefix': [''],
      'password': [''],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'first_name_en': [''],
      'last_name_en': [''],
      'nick_name': [''],
      'identity_no': ['', Validators.required],
      'expired_card': ['',],
      'expired_card_d': ['',],
      'expired_card_m': ['',],
      'expired_card_y': ['',],
      'mobile': [''],
      'email': [''],
      'bank_account_no': [''],
      'date_of_birth': [''],
      'date_of_birth_d': ['', Validators.required],
      'date_of_birth_m': ['', Validators.required],
      'date_of_birth_y': ['', Validators.required],
      'ethnicity': [''],
      'nationality': [''],
      'religion': [''],
      'weight': [''],
      'height': [''], 
      'military_condition': [''],
      'marital_status': [''],
      'education_level': [''],
      'hospital1': [''],
      'end_agency': [''],
      'start_work': [''],
      'start_work_d': [''],
      'start_work_m': [''],
      'start_work_y': [''],
      'leave_work': [''],
      'leave_work_d': [''],
      'leave_work_m': [''],
      'leave_work_y': [''],
      'company_id': ['', Validators.required],
      'department_id': ['', Validators.required],
      'position_id': ['', Validators.required],
      'address_detail': ['', Validators.required],
      'address_type': [''],
      'provinceMain': ['', Validators.required],
      'amphurMain': ['', Validators.required],
      'thumbonMain': ['', Validators.required],
      'postcode': ['', Validators.required],
      'id': ['', Validators.required],
      'personnel_ref': [''],
      'registration_amount': [''],
      'registration_ins_paid': [''],
      'registration_per_paid': [''],
      'registration_start_paid_date': [''],
      'share_type': [''],
      'permit_card_no': [''],
      'permit_card_start_date': [''],
      'permit_card_start_date_d': [''],
      'permit_card_start_date_m': [''],
      'permit_card_start_date_y': [''],
      'permit_card_end_date': [''],
      'permit_card_end_date_d': [''],
      'permit_card_end_date_m': [''],
      'permit_card_end_date_y': [''],
    });
  }

  badHistoryDescription = '';
  progressInfoProfiles = [];
  progressInfos = [];
  progressInfosImportantDocument = [];
  selectedFilesImportantDocument: FileList;
  selectedFiles: FileList;
  message = '';
  nameFile = '';
  nameFileImportantDocument = '';
  fileInfoMainMap = new Map();
  fileInfoMap = new Map();
  fileImportantMap = new Map();
  fileInfoLeaveWorkMap = new Map();
  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true,
  };
  urlProfile;
  status;
  dayList;
  monthList;
  yearList;
  yearExpiredList;
  personnel;
  isHr = false;

  ngOnInit() {
    this.personnel = JSON.parse(localStorage.getItem('tisToken'));
    if(this.personnel.position.id != 8 && this.personnel.position.id != 20 && this.personnel.position.id != 3){
      
    }
    if(this.personnel.position.id == 8){
      this.isHr = true
    }
    this.spinner.show();
    this.activatedRoute.params.forEach((urlParams) => {
      this.employeeId = urlParams['id'].replace('#', '');
      console.log("employeeId : "+this.employeeId);
      if(this.employeeId){
        var res = this.employeeId.split("-");
        if(res.length > 0){
          this.employeeId = res[0];
          this.status = res[1];
        }
      }
      console.log("employeeId : "+this.employeeId);
      console.log("status : "+this.status);
      if(this.status == 'A'){
        //this.editForm.get('leave_work').setValidators([Validators.required]);
        //this.editForm.get('leave_work').updateValueAndValidity();
        // this.editForm.leave_work.update('', Validators.required);
      }else if(this.status == 'O' || this.status == 'P'){
        console.log("update Validators");
        //this.editForm.get('start_work').setValidators([Validators.required]);
        //this.editForm.get('start_work').updateValueAndValidity();
        // this.editForm.start_work.update('', Validators.required);
      }
    });
    this.getProvince();
    this.getMasterDataActive();
    this.getAllCompany();
    this.getNationalityList();
    this.getEthnicityList();
    this.getReligionList();
    this.getEducationLevelList();
    this.getPrefixList();
    this.urlProfile = "../../assets/images/users/4.jpg";
    this.getDateDropdownList();
    this.getDateDropdownExpiredList();
  } 

  ngAfterViewInit(){
    
  }

  getDateDropdownList(){
    //day list
    this.dayList = this.commonService.getDayDetailList();
    //month list
    this.monthList = this.commonService.getMonthList();
    //year list
    this.yearList = this.commonService.getYearDetailList();
  }

  getDateDropdownExpiredList(){
    this.yearExpiredList = this.commonService.getYearDetailExpredList();
  }

  asIsOrder(a, b) {
    return 1;
  }

  descOrder = (a, b) => {
    console.log(a.key + " < " + b.key);
    if (a.key < b.key) return b.key;
  }
 
  isUpdateShare = true
  date_of_birth;
  expired_card;
  start_work;
  leave_work;
  reasonLeaveWorkList = [];
  getEmployee(employeeId){
    console.log("getEmployee employeeId : "+employeeId);
    this.costEquipmentService.getByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      if(data.length > 0){
        this.costEquipmentList = data;
      }else{
        this.addCostEquipmentList()
      }
    }, error => {
      // this.addCostEquipmentList()
      console.error(error);
    });
    this.fileManagerService.getByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      var i = 0
      data.forEach((val) => {
        this.fileInfoMap.set(val.id,val);
        // if((data.length-1) == i){
        //   console.log(this.fileInfoMap);
        //   this.fileInfoMap = new Map([...this.fileInfoMap.entries()].reverse());
        //   console.log(this.fileInfoMap);
        // }
        i++
      });

    }, error => {
      console.error(error);
      this.failDialog(error);
    });
    this.fileManagerService.getImportantDocumentByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      data.forEach((val) => {
        this.fileImportantMap.set(val.id,val);
      });
    }, error => {
      console.error(error);
    });
    this.badHistoryService.getByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var fileInfoMap = new Map();
        // console.log(data[i]);
        // console.log(data[i].fileInfoMap.length);
        for (var key in data[i].fileInfoMap) {
          var val = data[i].fileInfoMap[key];
          console.log(val);
          fileInfoMap.set(val.id,val);
        }
        data[i].fileInfoMap = fileInfoMap;
      }
      this.badHistoryList = data;
      console.log(this.badHistoryList);
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
    this.reasonLeaveWorkService.getByEmployeeId(employeeId).subscribe(data => {
      console.log(data);
      this.reasonLeaveWorkList = data;
      if(this.reasonLeaveWorkList){
        if(this.reasonLeaveWorkList[0]['leave_work']){
          this.isUpdateShare = false
        }
      }else{
        this.reasonLeaveWorkList = [];
      }
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
    this.remarkEmployeeService.getRemarkByEmplyeeId(employeeId).subscribe(data =>{
      console.log('remark list ');
      console.log(data);
      this.remarkList = data;
      //convert to thai date
      try{
        this.remarkList.forEach(value => {
          value['isDeleted'] = false;
        });
      }catch(ex){
        this.remarkList = [];
      } 
    }, error => {
      console.error(error);
      this.failDialog(error);
    });

    this.employeeService.getEmployeeById(employeeId).subscribe(data => {
      console.log(data);

      if(data.recommender){
        this.recommender = data.recommender
        this.shareId = data.recommender.share_id

        if(data["share_start_date"] != null && data["share_start_date"] != ""){
          let shareStartDate = data["share_start_date"].split("-")
          this.shareStartDateD = shareStartDate[0]
          this.shareStartDateM = shareStartDate[1]
          this.shareStartDateY = (Number(shareStartDate[2])+543)
        }
      }
      this.recommenderType = data["recommenderType"]

      this.getAmphur(data["provinceId"]);
      this.getThumbon(data["districtId"]);
      this.getDepartmentByCompanyId(data["company_id"]);
      this.getPositionByDepartmentId(data["department_id"]);
      this.date_of_birth = data["date_of_birth"];
      this.expired_card = data["expired_card"];
      this.start_work = data["start_work"];
      this.leave_work = data["leave_work"];
      this.urlProfile = data["url"];
      this.file_manager_id = data["file_manager_id"];

      var share_type = "";
      if(data["share_type"]){
        share_type = data["share_type"];
      }
      this.editForm.patchValue({
        share_type: share_type,
        gender: data["gender"],
        password: data["password"],
        prefix: data["prefix"],
        first_name: data["first_name"],
        last_name: data["last_name"],
        first_name_en: data["first_name_en"],
        last_name_en: data["last_name_en"],
        nick_name: data["nick_name"],
        identity_no: data["identity_no"],
        expired_card: data["expired_card"],
        mobile: data["mobile"],
        email: data["email"],
        bank_account_no: data["bank_account_no"],
        date_of_birth: data["date_of_birth"],
        ethnicity: data["ethnicity"],
        nationality: data["nationality"],
        religion: data["religion"],
        weight: data["weight"],
        height: data["height"],
        military_condition: data["military_condition"],
        marital_status: data["marital_status"],
        education_level: data["education_level"],
        hospital1: data["hospital1"],
        end_agency: data["end_agency"],
        start_work: data["start_work"],
        leave_work: data["leave_work"],
        permit_card_no: data["permit_card_no"],
        permit_card_start_date: data["permit_card_start_date"],
        permit_card_end_date: data["permit_card_end_date"],
        company_id: data["company_id"],
        department_id: data["department_id"],
        position_id: data["position_id"],
        address_detail: data["detail"],
        address_type: data["address_type"],
        provinceMain: data["provinceId"]+"|"+data["province"],
        amphurMain: data["districtId"]+"|"+data["district"],
        thumbonMain: data["subdistrictId"]+"|"+data["subdistrict"],
        postcode: data["postcode"],
        id: data["id"],
        personnel_ref: data["personnel_ref"],
        registration_amount: data["registration_amount"],
        registration_ins_paid: data["registration_ins_paid"],
        registration_per_paid: data["registration_per_paid"],
        registration_start_paid_date: data["registration_start_paid_date"],
      });

      //split date
      if(data["date_of_birth"] != null && data["date_of_birth"] != ""){
        let birthDate = data["date_of_birth"].split("-");
        this.editForm.patchValue({
          date_of_birth_d: birthDate[0],
          date_of_birth_m: birthDate[1],
          date_of_birth_y: (Number(birthDate[2])+543)
        });
      }  

      if(data["expired_card"] != null && data["expired_card"] != ""){
        let expiredCardDate = data["expired_card"].split("-");
        this.editForm.patchValue({
          expired_card_d: expiredCardDate[0],
          expired_card_m: expiredCardDate[1],
          expired_card_y: (Number(expiredCardDate[2])+543)
        });
      }

      if(data["start_work"] != null && data["start_work"] != ""){
        let startWorkDate = data["start_work"].split("-");
        this.editForm.patchValue({
          start_work_d: startWorkDate[0],
          start_work_m: startWorkDate[1],
          start_work_y: (Number(startWorkDate[2])+543)
        });
      }

      if(data["leave_work"] != null && data["leave_work"] != ""){
        let leaveWorkDate = data["leave_work"].split("-");
        this.editForm.patchValue({
          leave_work_d: leaveWorkDate[0],
          leave_work_m: leaveWorkDate[1],
          leave_work_y: (Number(leaveWorkDate[2])+543)
        });
      } 

      if(data["permit_card_start_date"] != null && data["permit_card_start_date"] != ""){
        let permitCardStartDate = data["permit_card_start_date"].split("-");
        this.editForm.patchValue({
          permit_card_start_date_d: permitCardStartDate[0],
          permit_card_start_date_m: permitCardStartDate[1],
          permit_card_start_date_y: (Number(permitCardStartDate[2])+543)
        });
      }

      if(data["permit_card_end_date"] != null && data["permit_card_end_date"] != ""){
        let permitCardEndDate = data["permit_card_end_date"].split("-");
        this.editForm.patchValue({
          permit_card_end_date_d: permitCardEndDate[0],
          permit_card_end_date_m: permitCardEndDate[1],
          permit_card_end_date_y: (Number(permitCardEndDate[2])+543)
        });
      }

      if(this.status == 'A'){
        this.editForm.patchValue({
          leave_work: '',
          leave_work_d: '',
          leave_work_m: '',
          leave_work_y: '',
        });
      }else if(this.status == 'O' || this.status == 'P'){
        this.editForm.patchValue({
          start_work: '',
          start_work_d: '',
          start_work_m: '',
          start_work_y: '',
          leave_work: '',
          leave_work_d: '',
          leave_work_m: '',
          leave_work_y: '',
        });
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.error(error);
      this.failDialog(error);
    });
  }

  companyList;
  getAllCompany(){
    $("#company_table").DataTable().clear().destroy();
    this.companyList = [];
    this.companyService.getCompany().subscribe(data => {
      this.companyList = data;
    });
  }

  departmentList;
  getDepartmentByCompanyId(companyId){
    this.departmentList = [];
    this.positionList = [];
    this.editForm.patchValue({
      department_id: "",
      position_id: ""
    });
    if(companyId != ""){
      this.departmentService.getDepartmentByCompanyId(companyId).subscribe(data=>{
        console.log(data);
        this.departmentList = data;
      });
    }
  }

  positionList;
  getPositionByDepartmentId(departmentId){
    this.positionList = [];
    this.editForm.patchValue({
      position_id: ""
    });
    if(departmentId != ""){
      this.positionService.getByDepartmentId(departmentId).subscribe(data=>{
        console.log(data);
        this.positionList = data;
      });
    }
  }

  masterDataCategory;
  getMasterDataActive(){
    var param = {};
    param["category"] = "upload_type_employee";
    this.masterDataCategory = [];
    this.masterDataService.searchMasterData(param).subscribe(res=>{
        //console.log(res);
        this.masterDataCategory = res;
    });
  }

  nationalityList;
  getNationalityList(){
    this.nationalityList = [];
    this.masterDataService.searchMasterData({"category":"nationality"}).subscribe(data=>{
      this.nationalityList = data;
    });
  }

  ethnicityList;
  getEthnicityList(){
    this.ethnicityList = [];
    this.masterDataService.searchMasterData({"category":"ethnicity"}).subscribe(data=>{
      this.ethnicityList = data;
    });
  }

  religionList;
  getReligionList(){
    this.religionList = [];
    this.masterDataService.searchMasterData({"category":"religion"}).subscribe(data=>{
      this.religionList = data;
    });
  }

  educationLevelList;
  getEducationLevelList(){
    this.educationLevelList = [];
    this.masterDataService.searchMasterData({"category":"education_level"}).subscribe(data=>{
      this.educationLevelList = data;
    });
  }

  prefixList;
  getPrefixList(){
    this.prefixList = [];
    this.masterDataService.searchMasterData({"category":"sex_prefix"}).subscribe(data=>{
      this.prefixList = data;
    });
  }

  selectedDateOfBirth(value: any, datepicker?: any) {
    var dateOfBirth = this.commonService.convertDateToStrng(value.start._d);
    console.log(dateOfBirth);
    this.editForm.patchValue({
      date_of_birth: dateOfBirth
    });
  }

  selectedExpiredCard(value: any, datepicker?: any) {
    var expiredCard = this.commonService.convertDateToStrng(value.start._d);
    console.log(expiredCard);
    this.editForm.patchValue({
      expired_card: expiredCard
    });
  }

  selectedStartWork(value: any, datepicker?: any) {
    var startWork = this.commonService.convertDateToStrng(value.start._d);
    this.editForm.patchValue({
      start_work: startWork
    });
  }

  selectedLeaveWork(value: any, datepicker?: any) {
    var leaveWork = this.commonService.convertDateToStrng(value.start._d);
    this.editForm.patchValue({
      leave_work: leaveWork
    });
  }

  preFixChange(value: any){
    let gender = "N";
    if(value == "นาย"){
      gender = "M";
    }else if(value == "นาง"){
      gender = "F";
    }if(value == "นางสาว"){
      gender = "F";
    }
    this.editForm.patchValue({
      gender: gender
    });
  }

  shareStartDateY
  shareStartDateM
  shareStartDateD
  submitted_add = false;
  saveEmployee(value){
    console.log(value);
    this.submitted_add = true;
    if(this.editForm.invalid){
      location.href = "#edit-form";
      console.log("addForm invalid");
      return;
    }
    var fileIdList = [];
    for (const [key, value] of this.fileInfoMap.entries()) {
      fileIdList.push(key);
    }
    value.fileIdList = fileIdList;
 
    var badHistoryList = [];
    for (var i = 0; i < this.badHistoryList.length; i++) {
      var badHistory = {};
      badHistory["description"] = this.badHistoryList[i].description;
      var fileIdList = [];
      for (const [key, value] of this.badHistoryList[i].fileInfoMap.entries()) {
        fileIdList.push(key);
      }
      badHistory["fileIdList"] = fileIdList;
      badHistoryList.push(badHistory);
    } 
    value.badHistoryList = badHistoryList;

    //remark list add by nick 09/08/2021
    value.remarkList = this.remarkList;

    if(value.provinceMain){
      value.province_id = value.provinceMain.split("|")[0];
      value.province = value.provinceMain.split("|")[1];
    }
    if(value.amphurMain){
      value.amphur_id = value.amphurMain.split("|")[0];
      value.amphur = value.amphurMain.split("|")[1];
    }
    if(value.thumbonMain){
      value.thumbon_id = value.thumbonMain.split("|")[0];
      value.thumbon = value.thumbonMain.split("|")[1];
    }

    if(value['date_of_birth_y'] != "" && value['date_of_birth_m'] != "" && value['date_of_birth_d'] != ""){
      value['date_of_birth'] = 
      (Number(value['date_of_birth_y'])-543)+'-'+value['date_of_birth_m']+'-'+value['date_of_birth_d'];
    }else{
      value['date_of_birth'] = null;
    }

    if(value['expired_card_y'] != "" && value['expired_card_m'] != "" && value['expired_card_d'] != ""){
      value['expired_card'] = 
      (Number(value['expired_card_y'])-543)+'-'+value['expired_card_m']+'-'+value['expired_card_d'];
    }else{
      value['expired_card'] = null;
    }

    if(value['start_work_y'] != "" && value['start_work_m'] != "" && value['start_work_d'] != ""){
      value['start_work'] = 
      (Number(value['start_work_y'])-543)+'-'+value['start_work_m']+'-'+value['start_work_d'];
    }else{
      value['start_work'] = null;
      if(this.status == 'O' || this.status == 'P'){
        alert("กรุณาเลือกวันที่จบอบรม");
        return;
      }
    }

    if(value['leave_work_y'] != "" && value['leave_work_m'] != "" && value['leave_work_d'] != ""){
      value['leave_work'] = 
      (Number(value['leave_work_y'])-543)+'-'+value['leave_work_m']+'-'+value['leave_work_d'];
    } else{
      value['leave_work'] = null;
      if(this.status == 'A'){
        alert("กรุณาเลือกวันที่ออกจากงาน");
        return;
      }
    }

    if(value['permit_card_start_date_y'] != "" && value['permit_card_start_date_m'] != "" && value['permit_card_start_date_d'] != ""){
      value['permit_card_start_date'] = 
      (Number(value['permit_card_start_date_y'])-543)+'-'+value['permit_card_start_date_m']+'-'+value['permit_card_start_date_d'];
    }

    if(value['permit_card_end_date_y'] != "" && value['permit_card_end_date_m'] != "" && value['permit_card_end_date_d'] != ""){
      value['permit_card_end_date'] = 
      (Number(value['permit_card_end_date_y'])-543)+'-'+value['permit_card_end_date_m']+'-'+value['permit_card_end_date_d'];
    }

    if(this.date_of_birth == (value['date_of_birth_d'] + "-" + value['date_of_birth_m'] + (Number(value['date_of_birth_y'])-543))){
      value.date_of_birth = "";
    }
    if(this.expired_card == (value['expired_card_d'] + "-" + value['expired_card_m'] + (Number(value['expired_card_y'])-543))){
      value.expired_card = "";
    }
    /*
    if(this.start_work == (value['start_work_d'] + "-" + value['start_work_m'] + (Number(value['start_work_y'])-543))){
      value.start_work = "";
      value.status = this.status;
    }
    if(this.leave_work == (value['leave_work_d'] + "-" + value['leave_work_m'] + (Number(value['leave_work_y'])-543))){
      value.leave_work = "";
      value.status = this.status;
    }
    */
   
    if(this.status == 'A'){
      value.status = 'O';
    }else if(this.status == 'O'){
      value.status = 'A';
    }if(this.status == 'P'){
      value.status = 'A';
    }

    value.file_manager_id = this.file_manager_id;
    value.reason = this.reason;

    var leaveWorkFileIdList = [];
    for (const [key, value] of this.fileInfoLeaveWorkMap.entries()) {
      leaveWorkFileIdList.push(key);
    }
    value.leaveWorkFileIdList = leaveWorkFileIdList;

    if(this.recommender){
      if(this.recommenderType){
        this.recommender.recommenderType = this.recommenderType;
      }else{
        this.recommender.recommenderType = '';
      }
      this.recommender.share_id = this.shareId
      value.recommender = this.recommender;
    }

    if( this.shareStartDateY != "" 
    && typeof this.shareStartDateY !== 'undefined'
    && this.shareStartDateM != "" 
    && typeof this.shareStartDateM !== 'undefined' 
    && this.shareStartDateD != "" 
    && typeof this.shareStartDateD !== 'undefined' )
    {
      value['share_start_date'] = (Number(this.shareStartDateY)-543)+'-'+this.shareStartDateM+'-'+this.shareStartDateD;
    }

    value.costEquipmentList = this.costEquipmentList;

    console.log(value);
    this.spinner.show();
    this.employeeService.updateEmployee(this.employeeId,value).subscribe(data => {
      console.log(data);

      this.employeeService.updateEmployeeSearch().subscribe(data => {
        // clear CacheEvict
        this.spinner.hide();
        this.successDialog();
      }, error => {
        this.spinner.hide();
        console.error(error);
        this.failDialog('');
      });
      
    }, error => {
      this.spinner.hide();
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.failDialog(error_message);
    });
  }

  countryJson;
  getProvince() {
    this.countryJson = [];
    this.httpService.get("./assets/json/data.json").subscribe(
      data => {
        this.countryJson = data as string[]; // FILL THE ARRAY WITH DATA.
        // console.log(this.countryJson);
        this.getEmployee(this.employeeId);
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
      let thumbons = this.thumbonJson[0];
      this.editForm.patchValue({
        postcode: thumbons[1][0]
      });
    }
  }

  getPost(e) {
    this.editForm.patchValue({
      postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      let thumbons = this.thumbonJson[value[0]][1];
      if(thumbons[0]){
        this.editForm.patchValue({
          postcode: thumbons[0]
        });
      }
    }
  }

  fileToUpload
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload)
  }

  uploadFiles() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i],this.nameFile,this.fileInfoMainMap);
    }
  }

  file_manager_id;
  selectFileProfile(event){
    this.file_manager_id = "";
    this.progressInfoProfiles = [];
    let file = event.target.files[0];
    let idx = 0;
    this.progressInfoProfiles[idx] = { value: 0, fileName: file.name };
    var formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('type', "employee");

    this.uploadService.upload(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfoProfiles[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log(event);
          if(event.body.code === "success" && event.body.data){
            var id = event.body.data.id;
            this.file_manager_id = id;
            console.log(this.file_manager_id);
            this.uploadService.getFiles(id).subscribe(data => {
              console.log(data);
              this.urlProfile = data.url;
            });
          }
        }
      },
      err => {
        this.progressInfoProfiles[idx].value = 0;
        console.log(err);
      });
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  upload(idx, file, name, fileInfoMap) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    var formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('type', "employee");
    formData.append('name', name);
    formData.append('employeeId', this.employeeId);

    this.uploadService.uploadFile(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          $('#modal-upload').modal('hide');
          console.log(event);
          if(event.body.code === "success" && event.body.data){
            var id = event.body.data.id;
            this.uploadService.getFiles(id).subscribe(data => {
              fileInfoMap.set(id,data);
              // console.log(fileInfoMap);
              // console.log(this.badHistoryList);
            });
          }
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(err);
        $('#modal-upload').modal('hide');
      });
  }

  openModalUploadImportantDocument(fileInfoMap){
    this.fileImportantMap = fileInfoMap;
    console.log(this.fileImportantMap);
    $('#modal-upload-important-document').modal('show');
  }

  selectFilesImportantDocument(event) {
    this.progressInfosImportantDocument = [];
    this.selectedFilesImportantDocument = event.target.files;
  }

  uploadFilesImportantDocument() {
    for (let i = 0; i < this.selectedFilesImportantDocument.length; i++) {
      this.uploadImportantDocument(i, this.selectedFilesImportantDocument[i],this.nameFileImportantDocument,this.fileImportantMap);
    }
  }

  uploadImportantDocument(idx, file, name, fileInfoMap) {
    this.progressInfosImportantDocument[idx] = { value: 0, fileName: file.name };
    var formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('employeeId', this.employeeId);

    this.uploadService.uploadImportantDocument(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfosImportantDocument[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          $('#modal-upload-important-document').modal('hide');
          console.log(event);
          if(event.body.code === "success" && event.body.data){
            var id = event.body.data.id;
            this.uploadService.getImportantDocument(id).subscribe(data => {
              fileInfoMap.set(id,data);
            });
          }
        }
      },
      err => {
        this.progressInfosImportantDocument[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(err);
        $('#modal-upload-important-document').modal('hide');
      });
  }

  deleteImportantDocumentProcess(id){
    this.currentIdFile = id;
    $('#modal-remove-important-document').modal('show');
  }

  remoteFileImportantDocumentProcess(){
    this.uploadService.deleteImportantDocument(this.currentIdFile).subscribe(data => {
      this.fileImportantMap.delete(this.currentIdFile);
      $('#modal-remove-important-document').modal('hide');
    },
    err => {
      console.log(err);
      this.failDialog('');
    });
  }

  currentIdFile;
  deleteFileProcess(id){
    this.currentIdFile = id;
    $('#modal-remove').modal('show');
  }

  remoteFile(idx){
    this.fileInfoMap.delete(idx);
    $('#modal-remove').modal('hide');
  }

  remoteLeaveWorkFile(idx){
    this.uploadService.remoteFile(idx).subscribe(data => {
      this.fileInfoLeaveWorkMap.delete(idx);
    });
  }

  deleteFileBadHistoryProcess(id){
    this.currentIdFile = id;
    $('#modal-remove-bad-history').modal('show');
  }

  remoteFileBadHistory(idx){
    for (var i = 0; i < this.badHistoryList.length; i++) {
      console.log(this.badHistoryList[i].fileInfoMa);
      for (const [key, value] of this.badHistoryList[i].fileInfoMap.entries()) {
        this.badHistoryList[i].fileInfoMap.delete(idx);
      }
    }
    $('#modal-remove-bad-history').modal('hide');
  }

  badHistoryList = [];
  addBadHistory(){
    var badHistoryDescription = {};
    badHistoryDescription["description"] = this.badHistoryDescription;
    badHistoryDescription["fileInfoMap"] = new Map();
    this.badHistoryList.push(badHistoryDescription);
    this.badHistoryDescription = "";
  }

  remoteBadHistory(index){
    this.badHistoryList.splice(index, 1);
  }

  openModalUpload(fileInfoMap){
    this.nameFile = '';
    this.progressInfos = [];
    this.selectedFiles = null;
    this.fileInfoMainMap = fileInfoMap;
    console.log(this.fileInfoMainMap);
    $('#modal-upload').modal('show');
  }

  invalidReason = false;
  reason;
  openModalLeaveWork(){
    this.submitted_add = true;
    console.log(this.editForm.value);
    if(this.editForm.invalid){
      location.href = "#edit-form";
      return;
    }
    this.reason = '';
    this.fileInfoMainMap = this.fileInfoLeaveWorkMap;
    $('#modal-leave-work').modal('show');
    // this.saveEmployee(value);
  }

  updateLeaveWork(){
    this.invalidReason = false;
    if(!this.reason){
      this.invalidReason = true;
      return;
    }
    $('#modal-leave-work').modal('hide');
    this.saveEmployee(this.editForm.value);
  }

  backPage(){
    this.router.navigate(['/employee']);
  }

  costEquipmentList = []
  addCostEquipmentList(){
    console.log('=== addCostEquipmentList ===')
    var costEquipment = {}
    costEquipment["detail"] = ""
    costEquipment["price"] = 0
    this.costEquipmentList.push(costEquipment)
  }

  removeCostEquipmentList(index){
    this.costEquipmentList.splice(index,1);
  }

  addRemark(){
    console.log(this.remarkDetail);
    if(this.remarkDetail == ""){
      return;
    }
    let remark = {'id':0,'description':this.remarkDetail,'created_at':new Date(),'isDeleted':false};
    this.remarkList.push(remark);
    this.remarkDetail = "";
  }

  removeRemark(i){
    //this.remarkList.splice(i,1);
    this.remarkList[i].isDeleted = true;
  }

  currentRemarkPosition = 0;
  remarkEdit = "";
  editRemark(i){
    this.currentRemarkPosition = i;
    this.remarkEdit = this.remarkList[this.currentRemarkPosition].description;
    $('#modal-edit-remark').modal('show');
  }
 
  updateRemark(){
    if(this.remarkEdit == ""){
      return;
    }
    this.remarkList[this.currentRemarkPosition].description = this.remarkEdit;
    $('#modal-edit-remark').modal('hide');
  }

  openModalRecommender(){
    $('#modal-recommender').modal('show');
  }

  recommenderType
  recommenderList = [];
  selectRecommenderType(type){
    this.spinner.show();
    this.recommenderList = []
    console.log(type)
    this.recommenderType = type
    $("#recommender_table").DataTable().clear().destroy();
    this.recommenderList = [];
    this.recommenderService.getByRecommenderType(type).subscribe(data=>{
      this.recommenderList = data;
      setTimeout(() => {
        $('#recommender_table').DataTable({});
        this.spinner.hide();
      }, 100);
      console.log(this.recommenderList);
    },
    err => {
      this.spinner.hide();
      this.failDialog('');
      console.log(err);
    });

  }

  recommender;
  selectRecommender(recommender){
    console.log(recommender)
    this.recommender = recommender
    this.recommender.status = 'active'
    $('#modal-recommender').modal('hide');
  }

  deleteRecommender(){
    this.recommender.status = 'delete'
  }

  selectedRegistrationDate(value: any, datepicker?: any) {
    // this is the date  selected
    //console.log(value);
    let startDate = value.start._d;
    //console.log(this.startDate);
    let startDateStr = this.getDateStr(startDate);
    console.log(startDateStr);
    this.editForm.get('registration_start_paid_date').setValue(startDateStr);
    console.log(this.editForm.value)
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  successDialog(){
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
    setTimeout(() => {this.backPage();}, 1000);
  }

  warningDialog(msg){
    Swal.fire({
      type: 'warning',
      confirmButtonText: 'ปิด',
      text: msg
    })
  }

  failDialog(msg){
    Swal.fire({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: msg
    })
  }

}
