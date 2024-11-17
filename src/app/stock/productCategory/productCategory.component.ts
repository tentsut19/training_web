import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { ProductCategoryService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-productCategory',
  templateUrl: './productCategory.component.html',
  styleUrls: ['./productCategory.component.css']
})
export class ProductCategoryComponent implements OnInit { 

  addForm: FormGroup;
  editForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;
  productCategoryList = [];
  currentProductCategoryId = 0;
  productCategory;

  constructor(
    private productCategoryService: ProductCategoryService,
    private fb: FormBuilder,
    ) { 
      this.addForm = fb.group({
        'name': ['', Validators.required],
        'code': [''],
        'description': ['']
      });
      this.editForm = fb.group({
        'name': ['', Validators.required],
        'code': ['', Validators.required],
        'description': [''],
        'id': ['', Validators.required],
      });
   }

  ngOnInit() {
     this.getAllProductCategory();
  }

  getAllProductCategory(){
    $('#product_category_table').DataTable().clear().destroy();
    this.productCategoryService.getProductCategory().subscribe(res=> {
      this.productCategoryList = res;
      setTimeout(() => {
        $('#product_category_table').DataTable({
        });
      }, 100);
    });
  }

  addProductCategory(value){
    console.log(value);
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    this.productCategoryService.addProductCategory(value).subscribe(data => {
      this.submitted_add = false;
      $('#modal-productCategory-add').modal('hide');
      this.successDialog();
      this.getAllProductCategory();

    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  deleteProductCategory(id){
    this.currentProductCategoryId = id;
    $('#modal-product-category-remove').modal('show');
  }

  deleteProcess(){
    console.log('deleteProcess : ' + this.currentProductCategoryId);
    this.productCategoryService.deleteProductCategory(this.currentProductCategoryId).subscribe(res=>{
      $('#modal-product-category-remove').modal('hide');
      this.getAllProductCategory();
      this.successDialog();
    });
  }

  editProductCategory(id){
    this.productCategoryService.getProductCategoryById(id).subscribe(data => {
      this.productCategory = data;
      
      this.editForm.patchValue({
        id: this.productCategory['id'],
        code: this.productCategory['code'],
        name: this.productCategory['name'],
        description: this.productCategory['description']
      });
      $('#modal-productCategory-edit').modal('show');
    });
  }

  updateProductCategory(value){
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }
    console.log(value);
    this.productCategoryService.updateProductCategory(value.id, value).subscribe(data => {
      this.submitted_edit = false;
      $('#modal-productCategory-edit').modal('hide');
      this.getAllProductCategory();
      this.successDialog();
    }, err => {
      console.error(err);
      $('.preloader').hide();
      var msg = 'error';
      var code = '';
      if(err.error.errors){
        err.error.errors.forEach(data => {
        console.error(data);
          msg = data.message;
        });
      }
      this.failDialog(msg);
    });
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
