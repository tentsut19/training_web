import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent {

  tisToken = null;

  ngOnInit() {
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
  }

  unAuthen(){
    localStorage.removeItem("tisToken");
    window.location.href = "/";
  }
}
