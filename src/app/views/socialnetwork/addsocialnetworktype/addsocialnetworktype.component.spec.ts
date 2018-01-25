import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsocialnetworktypeComponent } from './addsocialnetworktype.component';

describe('AddsocialnetworktypeComponent', () => {
  let component: AddsocialnetworktypeComponent;
  let fixture: ComponentFixture<AddsocialnetworktypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsocialnetworktypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsocialnetworktypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
