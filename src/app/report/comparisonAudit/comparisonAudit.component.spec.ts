import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonAuditComponent } from './comparisonAudit.component';

describe('ComparisonAuditComponent', () => {
  let component: ComparisonAuditComponent;
  let fixture: ComponentFixture<ComparisonAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
