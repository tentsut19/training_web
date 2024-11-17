import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPreCheckPointComponent } from './summaryPrecheckpoint.component';

describe('SummaryPreCheckPointComponent', () => {
  let component: SummaryPreCheckPointComponent;
  let fixture: ComponentFixture<SummaryPreCheckPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPreCheckPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPreCheckPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
