import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { EmployeeService, UploadFilesService, CommonService, CompanyService, DepartmentService, PositionService , MasterDataService, RecommenderService, InspectionService} from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css']
})
export class InspectionComponent implements OnInit {
  employeeId;
  employee;
  addForm: FormGroup;
  remarkList = [];
  remarkDetail = "";

  inspection1
  inspection2
  inspection3
  inspection4
  inspection5
  inspection6
  inspection7
  inspection8
  inspection9
  inspection10
  inspection11
  inspection12
  inspection13
  inspection14
  inspection15
  inspection16
  inspection17
  inspection18
  inspection19
  inspection20
  inspection21
  inspection22
  inspection23
  inspection24
  inspection25

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private inspectionService: InspectionService,
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
    this.getAllInspection();
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

  getAllInspection(){
    this.inspectionService.get().subscribe(data => {
      console.log(data)
      this.inspection1 = data[0].name
      this.inspection2 = data[1].name
      this.inspection3 = data[2].name
      this.inspection4 = data[3].name
      this.inspection5 = data[4].name
      this.inspection6 = data[5].name
      this.inspection7 = data[6].name
      this.inspection8 = data[7].name
      this.inspection9 = data[8].name
      this.inspection10 = data[9].name
      this.inspection11 = data[10].name
      this.inspection12 = data[11].name
      this.inspection13 = data[12].name
      this.inspection14 = data[13].name
      this.inspection15 = data[14].name
      this.inspection16 = data[15].name
      this.inspection17 = data[16].name
      this.inspection18 = data[17].name
      this.inspection19 = data[18].name
      this.inspection20 = data[19].name
      this.inspection21 = data[20].name
      this.inspection22 = data[21].name
      this.inspection23 = data[22].name
      this.inspection24 = data[23].name
      this.inspection25 = data[24].name
    });
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
    this.dayList = this.commonService.getDayList();
    //month list
    this.monthList = this.commonService.getMonthList();
    //year list
    this.yearList = this.commonService.getYearAdList();
  }

  getDateDropdownExpiredList(){
    this.yearExpiredList = this.commonService.getYearAdExpredList();
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
    console.log(value);
    console.log(this.addForm.value);

    var req = {
      "inspection1":this.inspection1,
      "inspection2":this.inspection2,
      "inspection3":this.inspection3,
      "inspection4":this.inspection4,
      "inspection5":this.inspection5,
      "inspection6":this.inspection6,
      "inspection7":this.inspection7,
      "inspection8":this.inspection8,
      "inspection9":this.inspection9,
      "inspection10":this.inspection10,
      "inspection11":this.inspection11,
      "inspection12":this.inspection12,
      "inspection13":this.inspection13,
      "inspection14":this.inspection14,
      "inspection15":this.inspection15,
      "inspection16":this.inspection16,
      "inspection17":this.inspection17,
      "inspection18":this.inspection18,
      "inspection19":this.inspection19,
      "inspection20":this.inspection20,
      "inspection21":this.inspection21,
      "inspection22":this.inspection22,
      "inspection23":this.inspection23,
      "inspection24":this.inspection24,
      "inspection25":this.inspection25,
    }

    this.spinner.show();
    this.inspectionService.update(req).subscribe(data => {
      this.spinner.hide();
      this.successDialog();
    }, error => {
      this.spinner.hide();
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

}
