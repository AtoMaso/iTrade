import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddphonetypeComponent } from './addphonetype.component';

describe('AddphonetypeComponent', () => {
  let component: AddphonetypeComponent;
  let fixture: ComponentFixture<AddphonetypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddphonetypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddphonetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
