import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataarchivingComponent } from './dataarchiving.component';

describe('DataarchivingComponent', () => {
  let component: DataarchivingComponent;
  let fixture: ComponentFixture<DataarchivingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataarchivingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataarchivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
