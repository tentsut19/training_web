import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'ng2-org-chart/src/employee';
import { PositionService ,DepartmentService, CompanyService, CommonService, CalendarHolidayService} from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-calendar-holiday',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarHolidayComponent implements OnInit {
  
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  yearList;
  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  holidayDate;
  currentYear;
  holidayList;
  calendarHoliday;
  currentCalendarHoliday;

  constructor(
    private positionService: PositionService,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private commonService: CommonService,
    private calendarHolidayService: CalendarHolidayService
    ) { 
      this.searchForm = fb.group({
        'year': [new Date().getFullYear()]
      });
      this.addForm = fb.group({
        'holiday_date': [''],
        'holiday_name': ['', Validators.required],
        'holiday_year': [new Date().getFullYear()],
        'paid_peroid': ['', Validators.required]
      });
      this.editForm = fb.group({
        'id': ['', Validators.required],
        'holiday_date': [''],
        'holiday_name': ['', Validators.required],
        'holiday_year': [new Date().getFullYear()],
        'paid_peroid': ['', Validators.required]
      });
  }

  ngOnInit() {
     this.generateYearList();
     this.holidayDate = new Date();
     this.currentYear = new Date().getFullYear();
     this.search(this.searchForm.value);
  } 


  addHoliday(value){
    //console.log(value);
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    } 
    value['holiday_date'] = this.getDateStr(this.holidayDate);
    value['holiday_year'] = this.currentYear+"";
    let param = {
      'holiday_date':this.getDateStr(this.holidayDate),
      'holiday_year':this.currentYear+"",
      'holiday_name':value['holiday_name'],
      'paid_peroid':value['paid_peroid']
    }
    console.log(param);
    this.calendarHolidayService.addCalendarHoliday(param).subscribe(res=>{
      $('#modal-holiday-add').modal('hide');
      this.successDialog();
      this.search(this.searchForm.value);
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  search(value){
    this.holidayList = [];
    $("#calendar_holiday_table").DataTable().clear().destroy();

    //console.log(value);
    this.currentYear = value['year']; 
    //console.log(this.currentYear);
    this.calendarHolidayService.searchCalendarHoliday(value).subscribe(data=>{
      this.holidayList = data;
      console.log(this.holidayList);
      this.holidayList.forEach(element => {
        //let newDateFormatSplit = element['holiday_date'].split("-");
        //element['holiday_date'] = this.commonService.getDateThNotimeDDMMYYYY(newDateFormatSplit[2]+'-'+newDateFormatSplit[1]+'-'+newDateFormatSplit[0]);
      });
      setTimeout(() => {
        $('#calendar_holiday_table').DataTable({
        });
      }, 100);
    });
  }


  editCalendarHoliday(id){
    this.currentCalendarHoliday = id;
    this.calendarHolidayService.getCalendarHolidayById(id).subscribe(res=>{
      this.calendarHoliday = res;
      this.editForm.patchValue({
        id: this.calendarHoliday['id'],
        holiday_date: this.calendarHoliday['holiday_date'],
        holiday_name: this.calendarHoliday['holiday_name'],
        holiday_year: this.calendarHoliday['holiday_year'],
        paid_peroid: this.calendarHoliday['paid_peroid']
      });
      $('#modal-holiday-edit').modal('show');
    });
  }


  updateCalendarHoliday(value){
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }

    console.log(value);
    this.calendarHolidayService.updateCalendarHoliday(value.id, value).subscribe(data => {
      this.submitted_edit = false;
      $('#modal-holiday-edit').modal('hide');
      this.search(this.searchForm.value);
      this.successDialog();
    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  deleteCalendarHoliday(id){
    this.currentCalendarHoliday = id;
    $('#modal-holiday-remove').modal('show');
  }

  deleteProcess(id){
    this.calendarHolidayService.deleteCalendarHoliday(id).subscribe(res=>{
      $('#modal-holiday-remove').modal('hide');
      this.search(this.searchForm.value);
      this.successDialog();
    }, error => {
      $('#modal-holiday-remove').modal('hide');
      console.error(error);
      this.failDialog(error);
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
        'enYear':currentYear+i,
        'thYear':(currentYear+i) + 543
      };
      this.yearList.push(year);
    }
  }
 
  selectedDate(value: any, datepicker?: any) {
    this.holidayDate = value.start._d;
    console.log(this.holidayDate);
  }

  getDateStr(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  loadDefaultScript(){
    $('#calendar_holiday_table').DataTable();
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
