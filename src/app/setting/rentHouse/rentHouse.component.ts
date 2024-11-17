import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'ng2-org-chart/src/employee';
import { PositionService ,DepartmentService, CompanyService, CommonService, CalendarHolidayService} from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-rent-house',
  templateUrl: './rentHouse.component.html',
  styleUrls: ['./rentHouse.component.css']
})
export class RentHouseComponent implements OnInit {
  
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
     this.loadDefaultScript();
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
