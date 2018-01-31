import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTypeListComponent } from './addresstypelist.component';

describe('AddressTypeListComponent', () => {
  let component: AddressTypeListComponent;
  let fixture: ComponentFixture<AddressTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});