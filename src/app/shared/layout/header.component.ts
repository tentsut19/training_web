import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent {

  customerName = '';

  ngOnInit() {
    this.customerName = localStorage.getItem("customerName");
  }

  unAuthen(){
    localStorage.clear();
    window.location.href = "/";
  }
}
