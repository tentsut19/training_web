import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { EquipmentService, StockService } from '../shared';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Constant } from '../shared/constant';
declare var jquery: any;
declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  addForm :FormGroup;
  submitted_add = false;

  editForm :FormGroup;
  submitted_edit = false;

  equipmentList: any = [];
  stockList: any = [];

  id: number;

  constructor(
    private fb: FormBuilder,
    private constant : Constant,
    private spinner: NgxSpinnerService,
    private stockService: StockService,
    private equipmentService: EquipmentService
  ) { 
    this.addForm = fb.group({
      'equipment_code': [''],
      'equipment_name': ['', Validators.required],
      'quantity': [0],
      'cost_price': [0],
      'selling_price': [0],
      'stock_id': ['', Validators.required]
    });
    this.editForm = fb.group({
      'id': ['', Validators.required],
      'equipment_code': [''],
      'equipment_name': ['', Validators.required],
      'quantity': [0],
      'cost_price': [0],
      'selling_price': [0],
      'stock_id': ['', Validators.required]
    });
  }

  ngOnChanges() {
    console.log('ngOnChanges called!');
  }

  ngOnInit() {
    console.log('ngOnInit called!');
    this.getEquipmentList()
    this.getStockList()
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called!');
  }

  getEquipmentList(){
    this.spinner.show();
    $("#equipment_table").DataTable().clear().destroy();
    this.equipmentService.getAll().subscribe(res=>{
      console.log(res);
      this.equipmentList = res;
      setTimeout(() => {
        $('#equipment_table').DataTable({});
        this.spinner.hide();
      }, 500);
    }, error => {
      this.failDialog('');
      this.spinner.hide();
      console.error(error);
    });
  }

  openModelCreate()
  {
    this.submitted_add = false;
    this.addForm.patchValue({
      equipment_code: '',
      equipment_name: '',
      quantity: 0,
      cost_price: 0,
      selling_price: 0,
      stock_id: '',
    });
    $('#modal-create').modal('show');
  }

  viewPdf(){
    var url = this.constant.API_DOMAIN + "/api/v1/equipment-export-pdf";
    window.open(url);
  }

  viewPdfByParam() {
    var title = "test1";
    this.spinner.show();
    this.equipmentService.viewPdfByParam(title).subscribe({
      next: (response: Blob) => {
        this.spinner.hide();
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Download error:', err);
      }
    });
  }

  getStockList(){
    this.stockService.get().subscribe(res=>{
      console.log(res);
      this.stockList = res;
    }, error => {
      console.error(error);
    });
  }

  selectedFile: any
  selectFile(event,item) {
    item.message = '';
    item.progressInfos = [];
    item.selectedFile = event.target.files[0];
  }

  uploadFiles(equipmentId,item) {
    this.uploadFileTimesheet(0, item.selectedFile,equipmentId,item);
  }

  uploadFileTimesheet(idx,file,equipmentId,item) {
    this.spinner.show();
    item.message = '';
    item.progressInfos[idx] = { value: 0, fileName: file.name };
    var formData: FormData = new FormData();
    console.log(file);
    formData.append('file', file);
    formData.append('equipmentId', equipmentId);

    this.equipmentService.uploadFile(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          if(item.progressInfos[idx]){
            item.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          }
        } else if (event instanceof HttpResponse) {
          this.spinner.hide();
          console.log(event);
          item.progressInfos = [];
          this.selectedFile = null;
          this.getEquipmentList();
        }
      },
      err => {
        this.spinner.hide();
        if(item.progressInfos[idx]){
          item.progressInfos[idx].value = 0;
        }
        item.message = "เกิดข้อผิดพลาด"
        console.log(err);
      });
  }

  save(){
    this.submitted_add = true;
    console.log(this.addForm.value);
    if(this.addForm.invalid){
      return;
    }
    console.log('pass')
    let request = this.addForm.value;
    this.spinner.show();
    this.equipmentService.create(request).subscribe(res=>{
      this.spinner.hide();
      console.log(res);
      this.getEquipmentList();
      this.successDialog();
      $('#modal-create').modal('hide');
    }, error => {
      this.failDialog('');
      this.spinner.hide();
      console.error(error);
    });
  }

  edit(data){
    console.log('data : ',data);
    this.spinner.show();
    this.equipmentService.getById(data.id).subscribe(res=>{
      this.spinner.hide();
      console.log(res);
      this.editForm.patchValue({
        id: data.id,
        equipment_code: data.equipment_code,
        equipment_name: data.equipment_name,
        quantity: data.quantity,
        cost_price: data.cost_price,
        selling_price: data.selling_price,
        stock_id: data.stock_id
      });
      $('#modal-edit').modal('show');
    }, error => {
      this.failDialog('');
      this.spinner.hide();
      console.error(error);
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
    this.spinner.show();
    this.equipmentService.update(request, request.id).subscribe(res=>{
      this.spinner.hide();
      console.log(res);
      $('#modal-edit').modal('hide');
      this.getEquipmentList();
      this.successDialog();
    }, error => {
      this.spinner.hide();
      this.failDialog('')
      console.error(error);
    });
  }

  openModalDelete(data){
    this.id = data.id;
    $('#modal-remove').modal('show');
  }

  deleteProcess(){
    this.spinner.show();
    this.equipmentService.softDelete(this.id).subscribe(res=>{
      this.spinner.hide();
      $('#modal-remove').modal('hide');
      this.getEquipmentList();
      this.successDialog();
    }, error => {
      this.spinner.hide();
      this.failDialog('')
      console.error(error);
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
  
}
