import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTraderComponent } from './addtrader.component';

describe('AddTraderComponent', () => {
  let component: AddTraderComponent;
  let fixture: ComponentFixture<AddTraderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddTraderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
