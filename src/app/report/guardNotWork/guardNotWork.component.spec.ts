import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardNotWorkComponent } from './guardNotWork.component';

describe('GuardNotWorkComponent', () => {
  let component: GuardNotWorkComponent;
  let fixture: ComponentFixture<GuardNotWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardNotWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardNotWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
