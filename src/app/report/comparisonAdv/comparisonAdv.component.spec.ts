import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonAdvComponent } from './comparisonAdv.component';

describe('ComparisonAdvComponent', () => {
  let component: ComparisonAdvComponent;
  let fixture: ComponentFixture<ComparisonAdvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonAdvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonAdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
