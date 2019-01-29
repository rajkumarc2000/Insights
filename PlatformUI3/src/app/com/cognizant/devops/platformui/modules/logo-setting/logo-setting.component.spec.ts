import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoSettingComponent } from './logo-setting.component';

describe('LogoSettingComponent', () => {
  let component: LogoSettingComponent;
  let fixture: ComponentFixture<LogoSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
