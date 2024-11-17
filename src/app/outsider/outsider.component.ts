import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import { OutsiderService } from 'src/app/shared';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-outsider',
  templateUrl: './outsider.component.html',
  styleUrls: ['./outsider.component.css']
})
export class OutsiderComponent implements OnInit { 

outsiderList = new Array();
outsider;
addForm: FormGroup;
editForm: FormGroup;
submitted_add = false;
submitted_edit = false;
currentOutsiderId;

  constructor(private fb: FormBuilder,
    private outsiderService: OutsiderService,
    private spinner: NgxSpinnerService,
    private httpService: HttpClient) { 
    this.addForm = fb.group({
      'prefix': [''],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'identity_no': ['', Validators.required],
      'bank_account_no': [''],
      'mobile': [''],
      'address_detail': [''],
      'provinceMain': [''],
      'amphurMain': [''],
      'thumbonMain': [''],
      'postcode': [''],
      'share_type': [''],
    });

    this.editForm = fb.group({
      'prefix': [''],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'identity_no': ['', Validators.required],
      'bank_account_no': [''],
      'mobile': [''],
      'address_detail': [''],
      'provinceMain': [''],
      'amphurMain': [''],
      'thumbonMain': [''],
      'postcode': [''],
      'id': [''],
      'share_type': [''],
    });

  }

  ngOnInit() { 
    this.getProvince();
    this.getOutsiderAll();
  }
 
  getOutsiderAll(){
    this.spinner.show();
    $("#outsider_table").DataTable().clear().destroy();
    this.outsiderList = [];
    this.outsiderService.get().subscribe(data=>{
      this.spinner.hide();
      this.outsiderList = data;
      setTimeout(() => {
        $('#outsider_table').DataTable({
        });
      }, 10);
      console.log(this.outsiderList);
    },
    err => {
      this.spinner.hide();
      this.failDialog('');
      console.log(err);
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
      amphurMain: "",
      thumbonMain: "",
      postcode: ""
    });
    this.editForm.patchValue({
      amphurMain: "",
      thumbonMain: "",
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
      thumbonMain: "",
      postcode: ""
    });
    this.editForm.patchValue({
      thumbonMain: "",
      postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      this.thumbonJson = this.amphurJson[value[0]][1];
      let thumbons = this.thumbonJson[0];
      this.addForm.patchValue({
        postcode: thumbons[1][0]
      });
      this.editForm.patchValue({
        postcode: thumbons[1][0]
      });
    }
  }

  getPost(e) {
    this.addForm.patchValue({
      postcode: ""
    });
    this.editForm.patchValue({
      postcode: ""
    });
    if (e != "") {
      let value = e.split("|");
      let thumbons = this.thumbonJson[value[0]][1];
      if(thumbons[0]){
        this.addForm.patchValue({
          postcode: thumbons[0]
        });
        this.editForm.patchValue({
          postcode: thumbons[0]
        });
      }
    }
  }

  openModal(){
    this.addForm.patchValue({
      prefix: '',
      first_name: '',
      last_name: '',
      identity_no: '',
      mobile: '',
      address_detail: '',
      provinceMain: '',
      amphurMain: '',
      thumbonMain: '',
      postcode: '',
      share_type: '',
    });
    this.thumbonJson = [];
    this.amphurJson = [];
    $('#modal-outsider-add').modal('show');
  }

  add(value){
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }

    if(value.provinceMain){
      value.provinceId = value.provinceMain.split("|")[0];
      value.province = value.provinceMain.split("|")[1];
    }
    if(value.amphurMain){
      value.amphurId = value.amphurMain.split("|")[0];
      value.amphur = value.amphurMain.split("|")[1];
    }
    if(value.thumbonMain){
      value.thumbonId = value.thumbonMain.split("|")[0];
      value.thumbon = value.thumbonMain.split("|")[1];
    }
    this.spinner.show();
    console.log(value);
    this.outsiderService.add(value).subscribe(data => {
      this.spinner.hide();
      this.submitted_add = false;
      $('#modal-outsider-add').modal('hide');
      this.successDialog();
      this.getOutsiderAll();

    }, error => {
      this.spinner.hide();
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.failDialog(error_message);
    });
  }

  delete(id){
    this.currentOutsiderId = id;
    $('#modal-outsider-remove').modal('show');
  }

  deleteProcess(){
    this.outsiderService.delete(this.currentOutsiderId).subscribe(data => {
      $('#modal-outsider-remove').modal('hide');
      this.successDialog();
      this.getOutsiderAll();
    })
  }

  edit(id){
    this.currentOutsiderId = id;
    this.spinner.show();
    this.outsiderService.getById(id).subscribe(data => {
      this.outsider = data;
      console.log(data);

      if(data["provinceId"]){
        this.getAmphur(data["provinceId"]);
        if(data["districtId"]){
          this.getThumbon(data["districtId"]);
        }
      }
      
      var provinceMain = ''
      if(data["provinceId"] && data["province"]){
        provinceMain = data["provinceId"]+"|"+data["province"]
      }
      var amphurMain = ''
      if(data["districtId"] && data["district"]){
        amphurMain = data["districtId"]+"|"+data["district"]
      }
      var thumbonMain = ''
      if(data["subdistrictId"] && data["subdistrict"]){
        thumbonMain = data["subdistrictId"]+"|"+data["subdistrict"]
      }

      var share_type = "";
      if(this.outsider['share_type']){
        share_type = this.outsider['share_type'];
      }

      this.editForm.patchValue({
        id: this.outsider['outsider_id'],
        prefix: this.outsider['prefix'],
        first_name: this.outsider['first_name'],
        last_name: this.outsider['last_name'],
        identity_no: this.outsider['identity_no'],
        bank_account_no: this.outsider['bank_account_no'],
        mobile: this.outsider['mobile'],
        address_detail: this.outsider['detail'],
        provinceMain: provinceMain,
        amphurMain: amphurMain,
        thumbonMain: thumbonMain,
        postcode: this.outsider['postcode'],
        share_type: share_type,
      });
      this.spinner.hide();
      $('#modal-outsider-edit').modal('show');
    }, error => {
      this.spinner.hide();
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.failDialog(error_message);
    });
  }

  update(value){
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }

    if(value.provinceMain){
      value.provinceId = value.provinceMain.split("|")[0];
      value.province = value.provinceMain.split("|")[1];
    }else{
      value.provinceId = '';
      value.province = '';
    }
    if(value.amphurMain){
      value.amphurId = value.amphurMain.split("|")[0];
      value.amphur = value.amphurMain.split("|")[1];
    }else{
      value.amphurId = '';
      value.amphur = '';
    }
    if(value.thumbonMain){
      value.thumbonId = value.thumbonMain.split("|")[0];
      value.thumbon = value.thumbonMain.split("|")[1];
    }else{
      value.thumbonId = '';
      value.thumbon = '';
    }
    this.spinner.show();
    console.log(value);
    this.outsiderService.update(value.id, value).subscribe(data => {
      this.submitted_edit = false;
      this.spinner.hide();
      $('#modal-outsider-edit').modal('hide');
      this.getOutsiderAll();
      this.successDialog();
    }, error => {
      this.spinner.hide();
      console.error(error);
      var error_message = ""
      if(error.error && error.error.data){
        error_message = error.error.data.error_message;
      }
      this.failDialog(error_message);
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
