import { Component, Input, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css']
})
export class MyPageComponent implements OnInit {

  @Input() data!: string;

  num: number;

  constructor() { }

  ngOnChanges() {
    console.log('ngOnChanges called!');
  }

  ngOnInit() {
    console.log('ngOnInit called!');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called!');
  }
  

}
