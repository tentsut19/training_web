import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardCheckPointComponent } from './guardCheckPoint.component';

describe('GuardCheckPointComponent', () => {
  let component: GuardCheckPointComponent;
  let fixture: ComponentFixture<GuardCheckPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardCheckPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardCheckPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
