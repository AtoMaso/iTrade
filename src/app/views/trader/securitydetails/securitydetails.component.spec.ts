import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritydetailsComponent } from './securitydetails.component';

describe('SecuritydetailsComponent', () => {
  let component: SecuritydetailsComponent;
  let fixture: ComponentFixture<SecuritydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecuritydetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
