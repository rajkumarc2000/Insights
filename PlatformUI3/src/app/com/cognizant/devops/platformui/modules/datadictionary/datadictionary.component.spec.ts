import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatadictionaryComponent } from './datadictionary.component';

describe('DatadictionaryComponent', () => {
  let component: DatadictionaryComponent;
  let fixture: ComponentFixture<DatadictionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatadictionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatadictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
