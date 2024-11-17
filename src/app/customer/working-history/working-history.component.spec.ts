import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSheetManageComponent } from './timesheet-manage.component';


describe('TimeSheetManageComponent', () => {
  let component: TimeSheetManageComponent;
  let fixture: ComponentFixture<TimeSheetManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
