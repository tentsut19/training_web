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
  name: string = 'Pisit Ngamkarn';
  result: number = 0.00;

  constructor() { }

  ngOnChanges() {
    console.log('ngOnChanges called!');
  }

  ngOnInit() {
    console.log('ngOnInit called!');
    this.getData();

    this.result = this.calculate(500);
    console.log(this.result);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called!');
  }
  
  getData(): void {
    console.log('getData');
  }

  calculate(param: number) : number {
    return param / 100;
  }

}
