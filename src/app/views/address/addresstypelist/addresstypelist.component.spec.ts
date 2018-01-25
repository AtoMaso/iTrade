import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddresstypelistComponent } from './addresstypelist.component';

describe('AddresstypelistComponent', () => {
  let component: AddresstypelistComponent;
  let fixture: ComponentFixture<AddresstypelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddresstypelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddresstypelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
