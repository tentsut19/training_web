import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { EmployeeService, UploadFilesService, CommonService, CompanyService, DepartmentService, PositionService , MasterDataService, RecommenderService} from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee_add.component.html',
  styleUrls: ['./employee_add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  employeeId;
  employee;
  addForm: FormGroup;
  remarkList = [];
  remarkDetail = "";
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private uploadService: UploadFilesService,
    private commonService: CommonService,
    private masterDataService: MasterDataService,
    private spinner: NgxSpinnerService,
    private recommenderService: RecommenderService,
    private httpService: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.addForm = fb.group({
      'gender': [''],
      'prefix': [''],
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
      'file_manager_id': [''],
      'personnel_ref': [''],
      'registration_amount': [''],
      'registration_ins_paid': [''],
      'registration_per_paid': [''],
      'registration_start_paid_date': [''],
      'share_type': [''],
      'permit_card_no': [''],
      'permit_card_start_date_d': [''],
      'permit_card_start_date_m': [''],
      'permit_card_start_date_y': [''],
      'permit_card_end_date_d': [''],
      'permit_card_end_date_m': [''],
      'permit_card_end_date_y': [''],
    });
  }

  badHistoryDescription = '';
  progressInfos = [];
  progressInfoProfiles = [];
  selectedFiles: FileList;
  message = '';
  nameFile = '';
  fileInfoMainMap = new Map();
  fileInfoMap = new Map();
  options: any = {
    locale: { 
      format: 'DD-MM-YYYY',
      displayFormat: 'DD-MM-YYYY',
    },
    alwaysShowCalendars: false,
    singleDatePicker: true,
    autoApply: true,
    closeOnAutoApply: true,
    linkedCalendars: true
  };
  dayList;
  monthList;
  yearList;
  yearExpiredList;

  ngOnInit() {
    this.addCostEquipmentList()
    this.getProvince();
    this.getAllCompany();
    this.getNationalityList();
    this.getEthnicityList();
    this.getReligionList();
    this.getEducationLevelList();
    this.getPrefixList();
    this.getDateDropdownList();
    this.getDateDropdownExpiredList();
  } 

  ngAfterViewInit(){
    this.addForm.patchValue({
      date_of_birth: "",
      expired_card: "",
      start_work: "",
      leave_work: "",
      gender: "N",
      marital_status: "N"
    });
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

  nationalityList;
  getNationalityList(){
    this.nationalityList = [];
    this.masterDataService.searchMasterData({"category":"nationality"}).subscribe(data=>{
      this.nationalityList = data;
    }, error => {
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.failDialog(error_message);
    });
  }

  ethnicityList;
  getEthnicityList(){
    this.ethnicityList = [];
    this.masterDataService.searchMasterData({"category":"ethnicity"}).subscribe(data=>{
      this.ethnicityList = data;
    }, error => {
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.failDialog(error_message);
    });
  }

  religionList;
  getReligionList(){
    this.religionList = [];
    this.masterDataService.searchMasterData({"category":"religion"}).subscribe(data=>{
      this.religionList = data;
    }, error => {
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.failDialog(error_message);
    });
  }

  educationLevelList;
  getEducationLevelList(){
    this.educationLevelList = [];
    this.masterDataService.searchMasterData({"category":"education_level"}).subscribe(data=>{
      this.educationLevelList = data;
    }, error => {
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.failDialog(error_message);
    });
  }

  prefixList;
  getPrefixList(){
    this.spinner.show();
    this.prefixList = [];
    this.masterDataService.searchMasterData({"category":"sex_prefix"}).subscribe(data=>{
      this.prefixList = data;
      this.spinner.hide();
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
    this.addForm.patchValue({
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
    this.addForm.patchValue({
      position_id: ""
    });
    if(departmentId != ""){
      this.positionService.getByDepartmentId(departmentId).subscribe(data=>{
        console.log(data);
        this.positionList = data;
      });
    }
  }

  selectedDateOfBirth(value: any, datepicker?: any) {
    var dateOfBirth = this.commonService.convertDateToStrng(value.start._d);
    console.log(dateOfBirth);
    this.addForm.patchValue({
      date_of_birth: dateOfBirth
    });
  }

  selectedExpiredCard(value: any, datepicker?: any) {
    var expiredCard = this.commonService.convertDateToStrng(value.start._d);
    console.log(expiredCard);
    this.addForm.patchValue({
      expired_card: expiredCard
    });
  }

  selectedStartWork(value: any, datepicker?: any) {
    var startWork = this.commonService.convertDateToStrng(value.start._d);
    this.addForm.patchValue({
      start_work: startWork
    });
  }

  selectedLeaveWork(value: any, datepicker?: any) {
    var leaveWork = this.commonService.convertDateToStrng(value.start._d);
    this.addForm.patchValue({
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
    this.addForm.patchValue({
      gender: gender
    });
  }

  shareStartDateY
  shareStartDateM
  shareStartDateD
  submitted_add = false;
  saveEmployee(value){
    this.submitted_add = true;
    if(this.addForm.invalid){
      location.href = "#add-form";
      console.log("addForm invalid");
      return;
    } 
    //patch date
    value['date_of_birth'] = 
    (Number(this.addForm.controls['date_of_birth_y'].value)-543)+'-'+this.addForm.controls['date_of_birth_m'].value+'-'+this.addForm.controls['date_of_birth_d'].value;

    if(this.addForm.controls['expired_card_y'].value != "" && this.addForm.controls['expired_card_m'].value != "" && this.addForm.controls['expired_card_d'].value != ""){
      value['expired_card'] = 
      (Number(this.addForm.controls['expired_card_y'].value)-543)+'-'+this.addForm.controls['expired_card_m'].value+'-'+this.addForm.controls['expired_card_d'].value;
    } 

    if(this.addForm.controls['start_work_y'].value != "" && this.addForm.controls['start_work_m'].value != "" && this.addForm.controls['start_work_d'].value != ""){
      value['start_work'] = 
      (Number(this.addForm.controls['start_work_y'].value)-543)+'-'+this.addForm.controls['start_work_m'].value+'-'+this.addForm.controls['start_work_d'].value;
    }

    if(this.addForm.controls['leave_work_y'].value != "" && this.addForm.controls['leave_work_m'].value != "" && this.addForm.controls['leave_work_d'].value != ""){
      value['leave_work'] = 
      (Number(this.addForm.controls['leave_work_y'].value)-543)+'-'+this.addForm.controls['leave_work_m'].value+'-'+this.addForm.controls['leave_work_d'].value;
    } 

    if(this.addForm.controls['permit_card_start_date_y'].value != "" && this.addForm.controls['permit_card_start_date_m'].value != "" && this.addForm.controls['permit_card_start_date_d'].value != ""){
      value['permit_card_start_date'] = 
      (Number(value['permit_card_start_date_y'])-543)+'-'+value['permit_card_start_date_m']+'-'+value['permit_card_start_date_d'];
    }

    if(this.addForm.controls['permit_card_end_date_y'].value != "" && this.addForm.controls['permit_card_end_date_m'].value != "" && this.addForm.controls['permit_card_end_date_d'].value != ""){
      value['permit_card_end_date'] = 
      (Number(value['permit_card_end_date_y'])-543)+'-'+value['permit_card_end_date_m']+'-'+value['permit_card_end_date_d'];
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
      value.provinceId = value.provinceMain.split("|")[0];
      value.province = value.provinceMain.split("|")[1];
    }
    if(value.amphurMain){
      value.amphurId = value.amphurMain.split("|")[0];
      value.amphur = value.amphurMain.split("|")[1];
    }
    if(value.thumbonMain){
      value.thumbonId = value.thumbonMain.split("|")[0];
      value.thumbon = value.thumbonMain.split("|")[1];
    }
    value.file_manager_id = this.file_manager_id;
    
    if(this.recommender){
      this.recommender.recommenderType = this.recommenderType;
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
    console.log(this.addForm.value);

    this.spinner.show();
    this.employeeService.addEmployee(value).subscribe(data => {

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
        console.log(this.countryJson);
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
    this.addForm.patchValue({
      amphur: "",
      thumbon: "",
      postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      this.amphurJson = this.countryJson[value[0]][1];
      console.log(this.amphurJson);
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
      let thumbons = this.thumbonJson[0];
      this.addForm.patchValue({
        postcode: thumbons[1][0]
      });
    }
  }

  getPost(e) {
    this.addForm.patchValue({
      postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      let thumbons = this.thumbonJson[value[0]][1];
      if(thumbons[0]){
        this.addForm.patchValue({
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
  urlProfile = "../../assets/images/users/4.jpg";
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
    console.log(file);
    formData.append('file', file);
    formData.append('type', "employee");
    formData.append('name', name);

    this.uploadService.upload(formData).subscribe(
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
              this.nameFile = '';
              // this.progressInfos[idx] = { value: 0, fileName: '' };
              this.progressInfos = []
              this.selectedFiles = null
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

  remoteFile(idx){
    this.uploadService.remoteFile(idx).subscribe(data => {
      this.fileInfoMap.delete(idx);
    });
  }

  remoteFileBadHistory(idx){
    this.uploadService.remoteFile(idx).subscribe(data => {
      for (var i = 0; i < this.badHistoryList.length; i++) {
        for (const [key, value] of this.badHistoryList[i].fileInfoMap.entries()) {
          this.badHistoryList[i].fileInfoMap.delete(idx);
        }
      }
    });
  }

  invalidBadHistoryDescription = false
  badHistoryList = [];
  addBadHistory(){
    if(this.badHistoryDescription){
      var badHistoryDescription = {};
      badHistoryDescription["description"] = this.badHistoryDescription;
      badHistoryDescription["fileInfoMap"] = new Map();
      this.badHistoryList.push(badHistoryDescription);
      this.badHistoryDescription = "";
      this.invalidBadHistoryDescription = false
    }else{
      this.invalidBadHistoryDescription = true
    }
  }

  remoteBadHistory(index){
    this.badHistoryList.splice(index, 1);
  }

  openModalUpload(fileInfoMap){
    this.fileInfoMainMap = fileInfoMap;
    console.log(this.fileInfoMainMap);
    $('#modal-upload').modal('show');
  }

  backPage(){
    this.router.navigate(['/employee']);
  }

  addRemark(){
    console.log(this.remarkDetail);
    if(this.remarkDetail == ""){
      return;
    }
    let remark = {'description':this.remarkDetail,'date':new Date()};
    this.remarkList.push(remark);
    this.remarkDetail = "";
  }

  removeRemark(i){
    this.remarkList.splice(i,1);
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

  deleteRecommender(){
    this.recommender = null
  }

  recommender;
  selectRecommender(recommender){
    console.log(recommender)
    this.recommender = recommender
    $('#modal-recommender').modal('hide');
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

  selectedRegistrationDate(value: any, datepicker?: any) {
    // this is the date  selected
    //console.log(value);
    let startDate = value.start._d;
    //console.log(this.startDate);
    let startDateStr = this.getDateStr(startDate);
    console.log(startDateStr);
    this.addForm.get('registration_start_paid_date').setValue(startDateStr);
    console.log(this.addForm.value)
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  successDialog(){
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
    setTimeout(() => {
      this.backPage()
    }, 1000);
  }

  failDialog(msg){
    Swal.fire({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: msg
    })
  }

}
