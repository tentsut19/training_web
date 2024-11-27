import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService, ProductCategoryService } from 'src/app/shared';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  displayedColumns: string[] = ['no', 'category_name', 'created_at', 'updated_at', 'id'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  productCategoryList?: Array<any> = [];
  addForm :FormGroup;
  editForm :FormGroup;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private productCategoryService: ProductCategoryService,
    private commonService: CommonService
  ) {

    this.addForm = fb.group({
      'category_name': ['', Validators.required]
    });

    this.editForm = fb.group({
      'id': ['', Validators.required],
      'category_name': ['', Validators.required]
    });

  }

  ngOnInit() {
    this.getAll();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAll(){
    this.spinner.show();
    this.productCategoryList = [];
    this.productCategoryService.get().subscribe(data => {
        this.productCategoryList = data;
        console.log(this.productCategoryList);

        this.dataSource = new MatTableDataSource(this.productCategoryList);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


        this.spinner.hide();
    }, error => {
      this.failDialog('');
      this.spinner.hide();
      console.error(error);
    });
  }

  submitted_add = false;
  openModelCreate()
  {
    this.submitted_add = false;
    this.addForm.patchValue({
      category_name: ''
    });
    $('#modal-create').modal('show');
  }

  craete(){
    this.submitted_add = true;
    console.log(this.addForm.value);
    if(this.addForm.invalid){
      return;
    }
    this.spinner.show();
    this.productCategoryService.create(this.addForm.value).subscribe(resp => {
      console.log(resp)
      $('#modal-create').modal('hide');
      this.spinner.hide();
      this.getAll()
    }, err => {
      this.spinner.hide();
      this.failDialog('')
    });
  }

  submitted_edit = false;
  openDialogEdit(data){
    this.submitted_edit = false;
    this.editForm.patchValue({
      id: data.id,
      category_name: data.category_name
    });
    $('#modal-edit').modal('show');
  }

  update(){
    this.submitted_edit = true;
    console.log(this.editForm.value);
    if(this.editForm.invalid){
      return;
    }
    this.spinner.show();
    this.productCategoryService.update(this.editForm.value,this.editForm.value.id).subscribe(resp => {
      console.log(resp)
      $('#modal-edit').modal('hide');
      this.spinner.hide();
      this.getAll()
    }, err => {
      this.spinner.hide();
      this.failDialog('')
    });
  }

  openDialogDelete(id){
    Swal.fire({
      title: 'คุณต้องการลบข้อมูลนี้ใช่ไหม',
      text: "กดยืนยันเพื่อลบข้อมูลนี้",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        this.spinner.show()
        this.productCategoryService.delete(id).subscribe(resp => {
          this.spinner.hide()
          this.getAll()
        }, err => {
          this.spinner.hide()
          this.failDialog('')
          console.log("=== err ===")
          console.log(err)
        });

      }
    })
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

}
