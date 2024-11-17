import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoSignatureComponent } from './logoSignature.component';

describe('LogoSignatureComponent', () => {
  let component: LogoSignatureComponent;
  let fixture: ComponentFixture<LogoSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
