import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasttimeCheckpointComponent } from './pasttimeCheckpoint.component';

describe('PasttimeCheckpointComponent', () => {
  let component: PasttimeCheckpointComponent;
  let fixture: ComponentFixture<PasttimeCheckpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasttimeCheckpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasttimeCheckpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
