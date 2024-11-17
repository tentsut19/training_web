import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvMoneyAllComponent } from './advMoneyAll.component';

describe('AdvMoneyAllComponent', () => {
  let component: AdvMoneyAllComponent;
  let fixture: ComponentFixture<AdvMoneyAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvMoneyAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvMoneyAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
