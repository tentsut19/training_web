import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPasttimeCheckpointComponent } from './reportPasttimeCheckpoint.component';

describe('ReportPasttimeCheckpointComponent', () => {
  let component: ReportPasttimeCheckpointComponent;
  let fixture: ComponentFixture<ReportPasttimeCheckpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPasttimeCheckpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPasttimeCheckpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
