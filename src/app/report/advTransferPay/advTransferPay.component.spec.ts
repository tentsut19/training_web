import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvTransferPayComponent } from './advTransferPay.component';

describe('AdvTransferPayComponent', () => {
  let component: AdvTransferPayComponent;
  let fixture: ComponentFixture<AdvTransferPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvTransferPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvTransferPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
