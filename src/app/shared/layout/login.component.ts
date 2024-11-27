import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var jquery: any;
declare var $: any;
declare var Swal: any;

@Component({
  selector: 'login-init',
  templateUrl: './login.component.html'
})
export class LoginInitComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
  ) {
   }

  ngOnInit() {
  } 

  authen(e){
    this.spinner.show();
    e.preventDefault();
      var email = e.target.elements[0].value;
      var password = e.target.elements[1].value;
      var param = {'email':email, 'password':password};
      console.log(param);
      this.authService.auth(param).subscribe(res=>{
        console.log(res);
        if(res != null){
          console.log(res);
          localStorage.setItem('trainingData', JSON.stringify(res.data));
          localStorage.setItem('customerName', res.data.prefix+res.data.first_name+" "+res.data.last_name);
          window.location.href = "/";
        }else{
          localStorage.clear();
          window.location.href = "/";
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }, error => {
        this.spinner.hide();
        console.log(error);
        this.failDialog("Invalid Email or Password");
      });
  }

  failDialog(msg){
    Swal.fire({
      type: 'error',
      title: 'รหัสพนักงาน หรือ รหัสผ่านไม่ถูกต้อง',
      text: msg
    })
  }
}
