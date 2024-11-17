import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CompanyService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
 companyCurrent;
 companyMain;
 companyList;
 currentCompanyId;
 addForm: FormGroup;
 editForm: FormGroup;
 submitted_add = false;
 submitted_edit = false;
 company = {"name":"", "tax_id":"", "vat":"", "inv_credit":"", "address_detail":"", "mobile":"", "email":"", "fax":""};

  constructor(private companyService: CompanyService,
    private httpService: HttpClient,
    private fb: FormBuilder,) { 
    this.addForm = fb.group({
      'name': ['', Validators.required],
      'address_detail': ['', Validators.required],
      'mobile': ['', Validators.required],
      'email': ['', Validators.required],
      'fax': ['', Validators.required],
      'tax_id': ['', Validators.required],
      'vat': ['', Validators.required],
      'inv_credit': ['', Validators.required],
      'province': ['', Validators.required],
      'amphur': ['', Validators.required],
      'thumbon': ['', Validators.required],
      'postcode': ['', Validators.required]
    });
    this.editForm = fb.group({
      'name': ['', Validators.required],
      'address_detail': ['', Validators.required],
      'mobile': ['', Validators.required],
      'email': ['', Validators.required],
      'fax': ['', Validators.required],
      'tax_id': ['', Validators.required],
      'vat': ['', Validators.required],
      'inv_credit': ['', Validators.required],
      'id': ['', Validators.required],
      'province': ['', Validators.required],
      'amphur': ['', Validators.required],
      'thumbon': ['', Validators.required],
      'postcode': ['', Validators.required]
    });
   }

  ngOnInit() {
    this.getAllCompany();
    this.getProvince();
  }

  getAllCompany(){
    $("#company_table").DataTable().clear().destroy();
    this.companyList = [];
    this.companyService.getCompany().subscribe(data => {
      this.companyList = data;
      setTimeout(() => {
        $('#company_table').DataTable({
        });
      }, 100);
      console.log(this.companyList);
    });
  }

  addCompany(company){
    this.submitted_add = true;
    if(this.addForm.invalid){
      return;
    }
    if(company.province){
      company.provinceId = company.province.split("|")[0];
      company.province = company.province.split("|")[1];
    }
    if(company.amphur){
      company.amphurId = company.amphur.split("|")[0];
      company.amphur = company.amphur.split("|")[1];
    }
    if(company.thumbon){
      company.thumbonId = company.thumbon.split("|")[0];
      company.thumbon = company.thumbon.split("|")[1];
    }
    console.log(company);
    this.companyService.addCompany(company).subscribe(data => {
      this.submitted_add = false;
      $('#modal-subcompany-add').modal('hide');
      this.successDialog();
      this.getAllCompany();

    }, error => {
      console.error(error);
      this.failDialog(error);
    });
  }

  editCompany(id){
    this.currentCompanyId = id;
    this.companyService.getCompanyById(id).subscribe(data => {
      this.company = data;
      console.log(this.company);

      var province = this.company['provinceId']+"|"+this.company['province'];
      var amphur = this.company['districtId']+"|"+this.company['district'];

      this.editForm.patchValue({
        name: this.company['name'],
        address_detail: this.company['address_detail'],
        mobile: this.company['mobile'],
        email: this.company['email'],
        fax: this.company['fax'],
        tax_id: this.company['tax_id'],
        vat: this.company['vat'],
        inv_credit: this.company['inv_credit'],
        id: this.company['id'],
        province: province,
        amphur: amphur,
        thumbon: this.company['subdistrictId']+"|"+this.company['subdistrict'],
      });

      this.getAmphur(province);
      this.getThumbon(amphur);

      $('#modal-subcompany-edit').modal('show');
    });
  }

  updateCompany(value){
    this.submitted_edit = true;
    if(this.editForm.invalid){
      return;
    }
    if(value.province){
      value.provinceId = value.province.split("|")[0];
      value.province = value.province.split("|")[1];
    }
    if(value.amphur){
      value.amphurId = value.amphur.split("|")[0];
      value.amphur = value.amphur.split("|")[1];
    }
    if(value.thumbon){
      value.thumbonId = value.thumbon.split("|")[0];
      value.thumbon = value.thumbon.split("|")[1];
    }
    console.log(value);
    this.companyService.updateCompany(value.id, value).subscribe(data => {
      this.submitted_edit = false;
      $('#modal-subcompany-edit').modal('hide');
      this.getAllCompany();
      this.successDialog();
    })
  }

  deleteCompany(id){
    this.currentCompanyId = id;
    $('#modal-subcompany-remove').modal('show');
  }

  deleteProcess(id){
    this.companyService.deleteCompany(id).subscribe(data => {
      $('#modal-subcompany-remove').modal('hide');
      this.successDialog();
      this.getAllCompany();
    })
  }


  countryJson;
  getProvince() {
    this.countryJson = [];
    this.httpService.get("./assets/json/data.json").subscribe(
      data => {
        this.countryJson = data as string[]; // FILL THE ARRAY WITH DATA.
        // console.log(this.countryJson);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  amphurJson;
  getAmphur(e) {
    this.thumbonJson = [];
    if (e == "") {
      this.amphurJson = [];
    } else {
      this.postcode = '';
      let value = e.split("|");
      this.amphurJson = this.countryJson[value[0]][1];
    }
  }

  thumbonJson;
  getThumbon(e) {
    if (e == "") {
      this.postcode = '';
    } else {
      let value = e.split("|");
      this.thumbonJson = this.amphurJson[value[0]][1];
      let thumbons = this.thumbonJson[1];
      this.postcode = thumbons[1][0];
    }

    //console.log(thumbons[1][0])
  }

  postcode;
  getPost(e) {
    let value = e.split("|");
    let thumbons = this.thumbonJson[value[0]][1];
    this.postcode = thumbons[0];
    //console.log(this.postcode)
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
