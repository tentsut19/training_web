import { Component } from '@angular/core';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'layout-menu-left',
  templateUrl: './menu-left.component.html'
})


export class MenuLeftComponent { 
  customerName = '';
  constructor( 

  ) { 
  }

  ngOnInit() {
    this.customerName = localStorage.getItem("customerName");
  }

  logoutUser() {
    localStorage.clear();
    window.location.href = "/";
  }

}
