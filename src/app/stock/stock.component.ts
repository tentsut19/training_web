import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockService } from '../shared/service/stock.service';
declare var jquery: any;
declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  addForm :FormGroup;
  submitted_add = false;

  editForm :FormGroup;
  submitted_edit = false;

  stockList: any = [];

  id: number;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService
  ) { 
    this.addForm = fb.group({
      'stock_name': ['', Validators.required]
    });
    this.editForm = fb.group({
      'id': ['', Validators.required],
      'stock_name': ['', Validators.required]
    });
  }

  ngOnChanges() {
    console.log('ngOnChanges called!');
  }

  ngOnInit() {
    console.log('ngOnInit called!'); 
    this.getStockList();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called!');
  }

  openModelCreate()
  {
    this.submitted_add = false;
    this.addForm.patchValue({
      stock_name: ''
    });
    $('#modal-create').modal('show');
  }

  save(){
    this.submitted_add = true;
    console.log(this.addForm.value);
    if(this.addForm.invalid){
      return;
    }
    console.log('pass')
    let request = this.addForm.value;
    this.stockService.create(request).subscribe(res=>{
      console.log(res);
      this.getStockList();
      this.successDialog();
    }, err => {
      this.failDialog('')
    });

  }

  getStockList(){
    $("#stock_table").DataTable().clear().destroy();
    this.stockService.get().subscribe(res=>{
      console.log(res);
      this.stockList = res;
      setTimeout(() => {$('#stock_table').DataTable({});}, 100);
    });
  }

  successDialog() {
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
  }

  failDialog(msg) {
    Swal.fire({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: msg
    })
  }

  warningDialog(msg){
    Swal.fire({
      type: 'warning',
      title: '',
      text: msg
    })
  }

  edit(data){
    console.log('data : ',data);
    this.stockService.getById(data.id).subscribe(res=>{
      console.log(res);
      this.editForm.patchValue({
        id: data.id,
        stock_name: data.stock_name
      });
      $('#modal-edit').modal('show');
    });
  }

  update(){
    this.submitted_edit = true;
    console.log(this.editForm.value);
    if(this.editForm.invalid){
      return;
    }
    console.log('pass')
    let request = this.editForm.value;
    this.stockService.update(request, request.id).subscribe(res=>{
      console.log(res);
      $('#modal-edit').modal('hide');
      this.getStockList();
      this.successDialog();
    }, err => {
      this.failDialog('')
    });
  }

  openModalDelete(data){
    this.id = data.id;
    $('#modal-remove').modal('show');
  }

  deleteProcess(){
    this.stockService.softDelete(this.id).subscribe(res=>{
      $('#modal-remove').modal('hide');
      this.getStockList();
      this.successDialog();
    }, err => {
      this.failDialog('')
    });
  }
  
}
