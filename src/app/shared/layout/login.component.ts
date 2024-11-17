import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/shared/service';
declare var jquery: any;
declare var $: any;
declare var Swal: any;

@Component({
  selector: 'login-init',
  templateUrl: './login.component.html'
})
export class LoginInitComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService
  ) {
   }

  ngOnInit() {
  } 

  authen(e){
    e.preventDefault();
      var username = e.target.elements[0].value;
      var password = e.target.elements[1].value;
      var outsider = e.target.elements[2].checked;
      var employee = {'username':username, 'password':password, 'outsider': outsider};
      console.log(employee);
      this.employeeService.login(employee).subscribe(res => {
        if(res != null){
          console.log(res);
          localStorage.setItem('tisToken', JSON.stringify(res.data));
          var object = {value: "value", timestamp: new Date().getTime()}
          localStorage.setItem("key", JSON.stringify(object));
          window.location.href = "/";
        }else{
          localStorage.removeItem('tisToken');
          window.location.href = "/";
        }
      }, err => {
        console.error(err);
        this.failDialog("");
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
