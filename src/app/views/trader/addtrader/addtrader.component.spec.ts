import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtraderComponent } from './addtrader.component';

describe('AddtraderComponent', () => {
  let component: AddtraderComponent;
  let fixture: ComponentFixture<AddtraderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtraderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
