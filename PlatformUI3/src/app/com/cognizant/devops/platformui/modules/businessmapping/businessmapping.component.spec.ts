import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessmappingComponent } from './businessmapping.component';

describe('BusinessmappingComponent', () => {
  let component: BusinessmappingComponent;
  let fixture: ComponentFixture<BusinessmappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessmappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
