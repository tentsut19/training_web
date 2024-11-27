import { Component, Directive, Input, OnInit } from "@angular/core";
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { NgxSpinnerService } from "ngx-spinner";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Directive({
  selector: "[var]",
  exportAs: "var",
})
class VarDirective {
  @Input() var: any;
}

@Component({
  selector: "app-survey-round",
  templateUrl: "./survey-round.component.html",
  styleUrls: ["./survey-round.component.css"],
})
export class SurveyRoundComponent implements OnInit {
  suveyRoundLs?: Array<any> = [];
  agencyList?: Array<any> = [];
  surveyRoundItem?: Array<any> = [];

  pointList?: Array<any> = [];
  deviceList?: Array<any> = [];

  addSurveyForm: FormGroup;
  editSurveyForm: FormGroup;
  submitted_add = false;
  submitted_edit = false;

  surveyData: any;

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    this.addSurveyForm = fb.group({
      name: ["", Validators.required],
      code: ["", Validators.required],
      agency_id: ["", Validators.required],
      round_item: this.fb.array([]),
    });

    this.editSurveyForm = fb.group({
      eid: [""],
      name: ["", Validators.required],
      code: ["", Validators.required],
      agency_id: ["", Validators.required],
      round_item: this.fb.array([]),
    });
  }

  ngOnInit() {
    
  }

}

