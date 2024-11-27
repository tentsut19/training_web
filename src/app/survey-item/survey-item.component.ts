import { Component, Input, OnInit } from '@angular/core'; // First, import Input

@Component({
  selector: 'app-survey-item',
  templateUrl: './survey-item.component.html',
})


export class SurveyItemsComponent implements OnInit {
  ngOnInit(): void {
  }
  @Input() item = ''; // decorate the property with @Input()
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
