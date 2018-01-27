import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhoneTypeComponent } from './addphonetype.component';

describe('AddPhoneTypeComponent', () => {
  let component: AddPhoneTypeComponent;
  let fixture: ComponentFixture<AddPhoneTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPhoneTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhoneTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
