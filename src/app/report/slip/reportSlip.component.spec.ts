import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSlipComponent } from './reportSlip.component';

describe('ReportSlipComponent', () => {
  let component: ReportSlipComponent;
  let fixture: ComponentFixture<ReportSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
