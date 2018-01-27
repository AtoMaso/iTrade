import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressTypeComponent } from './addaddresstype.component';

describe('AddAddressTypeComponent', () => {
  let component: AddAddressTypeComponent;
  let fixture: ComponentFixture<AddAddressTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAddressTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddressTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
