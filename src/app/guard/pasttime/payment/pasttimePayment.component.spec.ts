import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasttimePaymentComponent } from './pasttimePayment.component';

describe('PasttimeCheckpointComponent', () => {
  let component: PasttimePaymentComponent;
  let fixture: ComponentFixture<PasttimePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasttimePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasttimePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
