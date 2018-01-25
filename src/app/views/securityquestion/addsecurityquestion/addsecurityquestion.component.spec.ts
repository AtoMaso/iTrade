import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsecurityquestionComponent } from './addsecurityquestion.component';

describe('AddsecurityquestionComponent', () => {
  let component: AddsecurityquestionComponent;
  let fixture: ComponentFixture<AddsecurityquestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsecurityquestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsecurityquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
