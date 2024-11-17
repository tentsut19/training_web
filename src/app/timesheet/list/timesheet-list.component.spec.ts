import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSheetListComponent } from './timesheet-list.component';


describe('TimeSheetListComponent', () => {
  let component: TimeSheetListComponent;
  let fixture: ComponentFixture<TimeSheetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
