import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'ng2-org-chart/src/employee';
import { CommonService, PickStockService, StockService, PermWorkRecordService} from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-pick-stock',
  templateUrl: './pickStock.component.html',
  styleUrls: ['./pickStock.component.css']
})
export class PickStockComponent implements OnInit {
  
  searchForm: FormGroup;
  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  yearList;
  options: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: false
  };
  options2: any = {
    locale: { format: 'DD-MM-YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  holidayDate;
  currentYear;
  holidayList;
  calendarHoliday;
  currentCalendarHoliday;
  pickStockList = [];
  productList = [];
  employeeList = [];
  pickItemList = [];
  productId=0;
  productQuantity = 1;
  pickDate = "";
  totalInstallment = 1;
  employeeId = 0;
  totalAmontPickItem = 0;

  constructor(
    private fb: FormBuilder,
    private pickStockService: PickStockService,
    private commonService: CommonService,
    private stockService: StockService,
    private permWorkRecordService: PermWorkRecordService
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
     //this.loadDefaultScript();
     this.getProductList();
     this.getGuard();
     this.search();
  } 

  search(){
    $("#pick_stock_table").DataTable().clear().destroy();
    this.pickStockList = [];
    let req = {};
    this.pickStockService.search(req).subscribe(data=>{
      this.pickStockList = data;
      console.log(this.pickStockList);
      setTimeout(() => {
        $('#pick_stock_table').DataTable({
        });
      }, 10);
    });
  }

  getProductList(){
    this.productList = [];
    let request = {};
    this.stockService.search(request).subscribe(data=>{
      this.productList = data;
      console.log(this.productList);
    })
  }

  getGuard(){
    this.employeeList = [];
    this.permWorkRecordService.getGuard().subscribe(res=>{
      this.employeeList = res; 
    });
  }

  addPickItem(){
    console.log('productId ',this.productId)
    console.log('productQuantity ',this.productQuantity)
    if(this.productId!=0){
      let dupProductList = this.pickItemList.filter(item => item.productId == this.productId);
      if(dupProductList.length>0){return}

      let prodList = this.productList.filter(product => product.id == this.productId);
      if(prodList.length>0){
        this.pickItemList.push({
          'productId':this.productId,
          'productName':prodList[0].name,
          'price':prodList[0].price,
          'quantity':this.productQuantity,
          'totalPrice':(prodList[0].price * this.productQuantity)
        })
      }
    }
    this.calculatePickStock();
  }

  quantityChanged(productId,value){
    console.log('productId ',productId)
    console.log('value ',value)
    for(let i=0;i<this.pickItemList.length;i++){
      if(this.pickItemList[i].productId == productId){
        this.pickItemList[i].totalPrice = (this.pickItemList[i].price * this.pickItemList[i].quantity)
      }
    }
    this.calculatePickStock();
  }

  calculatePickStock(){
    this.totalAmontPickItem = 0;
    for(let i=0;i<this.pickItemList.length;i++){
      this.totalAmontPickItem = this.totalAmontPickItem+this.pickItemList[i].totalPrice
    }
  }

  removePickItem(index){
    this.pickItemList.splice(index,1)
    this.calculatePickStock();
  }
 
  savePickStock(){
    console.log('savePickStock')
    console.log('pickDate',this.pickDate)
    console.log('employeeId',this.employeeId)
    console.log('pickItemList',this.pickItemList)
    console.log('totalInstallment',this.totalInstallment)
    let req = {
      'employee_id':this.employeeId,
      'total_installment':this.totalInstallment,
      'pick_total_amount':this.totalAmontPickItem,
      'pickStockItem':[]
    }
    for(let i=0;i<this.pickItemList.length;i++){
      let item = {
        'stock_id':this.pickItemList[i].productId,
        'quantity':this.pickItemList[i].quantity,
        'unit_per_price':this.pickItemList[i].price,
        'total':this.pickItemList[i].totalPrice
      }
      req.pickStockItem.push(item)
    }
    this.pickStockService.create(req).subscribe(res=>{
      this.successDialog();
    }, error => {
        console.error(error);
        this.failDialog('');
      });

  }

  loadDefaultScript(){
    $('#calendar_holiday_table').DataTable();
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
