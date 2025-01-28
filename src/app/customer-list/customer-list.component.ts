import { Component, Input, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  fname: string;
  lname: string;
  list: any = [];

  constructor() { }

  ngOnChanges() {
    console.log('ngOnChanges called!');
  }

  ngOnInit() {
    setTimeout(() => {
      $('#customer_table').DataTable({
      });
    }, 100);
    console.log('ngOnInit called!');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called!');
  }

  clear(){
    this.fname = '';
    this.lname = '';
  }

  add(){
    this.list.push(
      {fname: this.fname, lname: this.lname}
    );
    //this.clear(); 
  }

  delete(index: number){
    this.list.splice(index,1);
  }

}
