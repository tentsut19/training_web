import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var jQuery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { EmployeeService, CustomerService, PasttimeWorkRecordService} from '../../../shared';

@Component({
  selector: 'app-pasttimePayment',
  templateUrl: './pasttimePayment.component.html',
  styleUrls: ['./pasttimePayment.component.css']
})
export class PasttimePaymentComponent implements OnInit { 

  searchForm: FormGroup;
  startDate;
  startDateStr;
  customerList =  [];
  checkPointList = [];
  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  }; 
  
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private pasttimeWorkRecordService: PasttimeWorkRecordService
    ) { 
      this.searchForm = fb.group({
        'pasttime_payment_date': [''],
        'customer_id': ['']
      });
   }

  ngOnInit() {
       this.loadScript(); 
       this.startDate = new Date();
       this.startDate.setHours(0);
       this.startDate.setMinutes(0);
       this.startDate.setSeconds(0);
       //get customer
       this.getCustomer();
       //get current date
       this.startDateStr = this.getDateStr(new Date());
       //auto search
       this.search(this.searchForm.value);
  }

  getCustomer(){
    this.customerList = [];
    this.customerService.getCustomer().subscribe(res=>{
      this.customerList = res;
      //console.log(this.customerList);
    });
  }

  search(value){
    //console.log(value);
    this.checkPointList=[];
    let searchParam = {'workDate':this.startDateStr,'customer_id':value['customer_id']};
    console.log(searchParam);
    this.pasttimeWorkRecordService.searchPasttimeWorkRecord(searchParam).subscribe(data=>{
      this.populateWorkRecord(data);
    });
  }

  updatePayment(){
    if(this.checkPointList.length>0){
      this.pasttimeWorkRecordService.updatePaymentPasttimeWorkRecord(this.checkPointList).subscribe(res=>{
        console.log(res);
        this.successDialog();
      }, error => {
        console.error(error);
        this.failDialog(error);
      });
    }else{
      this.failDialog('ไม่มีรายการอัพเดท');
    } 
  }
  
  paidStatusChange(id,cus_id){
    console.log(id);
    console.log(cus_id);
    
    this.checkPointList.forEach(element=>{
      if(element['cus_id'] == cus_id){
        for(let i=0;i<element['emp'].length;i++){
          if(element['emp'][i]['id'] == id){
            if(element['emp'][i]['paid_status'] == 0){
              element['emp'][i]['paid_status']=1;
            }else{
              element['emp'][i]['paid_status']=0;
            }
          }
        }
      }
    });
    console.log(this.checkPointList);
  }

  populateWorkRecord(list){
    console.log(list);
    list.forEach(element => {
      let isDupCustomer = false;
      for(let i=0;i<this.checkPointList.length;i++){
          if(this.checkPointList[i]['cus_id'] == element['cus_id']){
            isDupCustomer = true;
            this.checkPointList[i]['emp'].push(
              { 
              'id':element['id'],
              'emp_id': element['emp_id'], 
              'first_name': element['first_name'], 
              'last_name': element['last_name'], 
              'work_peroid_type': element['work_peroid_type'],
              'wage':element['wage'],
              'paid_status':element['paid_status']
              }
            );
          }
      }
      //case not dup customer
      if(!isDupCustomer){
        let customer = 
        {
          'cus_id':element['cus_id'],
          'code':element['code'],
          'name':element['name'],
          'emp':[]
        };

        customer['emp'].push(
          {
            'id':element['id'],
            'emp_id': element['emp_id'], 
            'first_name': element['first_name'], 
            'last_name': element['last_name'], 
            'work_peroid_type': element['work_peroid_type'],
            'wage':element['wage'],
            'paid_status':element['paid_status']
          }
          );
        this.checkPointList.push(customer);
      }
    });
    console.log(this.checkPointList);
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
