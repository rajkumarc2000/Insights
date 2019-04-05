import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipBuilderComponent } from './relationship-builder.component';

describe('RelationshipBuilderComponent', () => {
  let component: RelationshipBuilderComponent;
  let fixture: ComponentFixture<RelationshipBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationshipBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
