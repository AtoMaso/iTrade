import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddaddresstypeComponent } from './addaddresstype.component';

describe('AddaddresstypeComponent', () => {
  let component: AddaddresstypeComponent;
  let fixture: ComponentFixture<AddaddresstypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddaddresstypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddaddresstypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
