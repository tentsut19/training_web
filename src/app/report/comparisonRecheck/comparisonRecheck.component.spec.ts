import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonRecheckComponent } from './comparisonRecheck.component';

describe('ComparisonRecheckComponent', () => {
  let component: ComparisonRecheckComponent;
  let fixture: ComponentFixture<ComparisonRecheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonRecheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonRecheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
