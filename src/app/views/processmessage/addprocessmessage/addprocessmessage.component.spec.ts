import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprocessmessageComponent } from './addprocessmessage.component';

describe('AddprocessmessageComponent', () => {
  let component: AddprocessmessageComponent;
  let fixture: ComponentFixture<AddprocessmessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddprocessmessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddprocessmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
