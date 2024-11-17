import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { StockService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit { 

  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  productList = [];
  product;
  quantityImport = 0;

  constructor(
    private stockService: StockService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    ) { 
      this.addForm = fb.group({
        'name': ['', Validators.required],
        'description': [''],
        'quantity': ['', Validators.required],
        'price': ['', Validators.required],
      });
      this.editForm = fb.group({
        'id': ['', Validators.required],
        'name': ['', Validators.required],
        'description': [''],
        'quantity': ['', Validators.required],
        'price': ['', Validators.required],
      });
   }

  ngOnInit() { 
    this.search();
  } 

  search(){
    this.spinner.show();
    $("#product_table").DataTable().clear().destroy();
    this.productList = [];
    let request = {};
    this.stockService.search(request).subscribe(data=>{
      this.productList = data;
      console.log(this.productList);
      this.spinner.hide();
      setTimeout(() => {
        $('#product_table').DataTable({
        });
      }, 10);
    })
  }

  addProduct(value){
    console.log(value)
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    this.spinner.show();
    this.stockService.addProduct(value).subscribe(res=>{
      $('#modal-product-add').modal('hide');
      this.successDialog();
      this.search();
    }, err => {
      this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  editProduct(id){
    this.stockService.getProductById(id).subscribe(data=>{
      this.product = data;
      console.log(this.product);
      this.editForm.patchValue({
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        quantity: this.product.quantity,
        price: this.product.price
      })
      $('#modal-product-edit').modal('show');
    })
  }

  updateProduct(value){
    console.log(value)
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }
    this.spinner.show();
    this.stockService.update(this.product.id,value).subscribe(res=>{
      $('#modal-product-edit').modal('hide');
      this.successDialog();
      this.search();
    }, err => {
      this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }
 
  importProduct(id){
    this.quantityImport = 0;
    this.stockService.getProductById(id).subscribe(data=>{
      this.product = data;
      console.log(this.product); 
      $('#modal-product-import').modal('show');
    })
  }

  updateImportProduct(){
    console.log('import quantity : ',this.quantityImport);
    console.log(this.product);
    let req = {'quantity':this.quantityImport}
    this.stockService.updateQuantity(this.product.id,req).subscribe(res=>{
      $('#modal-product-import').modal('hide');
      this.successDialog();
      this.search();
    }, err => {
      this.spinner.hide();
      var msg = 'error';
      console.error(err);
      this.failDialog(msg);
    });
  }

  successDialog(){
    Swal.fire({
      type: 'success',
      title: '',
      text: "ทำรายการสำเร็จ",
      timer: 1500
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
