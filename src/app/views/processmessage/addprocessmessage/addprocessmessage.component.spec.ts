import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcessMessageComponent } from './addprocessmessage.component';

describe('AddProcessMessageComponent', () => {
  let component: AddProcessMessageComponent;
  let fixture: ComponentFixture<AddProcessMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddProcessMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProcessMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
