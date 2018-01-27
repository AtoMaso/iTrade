import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneTypeListComponent } from './phonetypelist.component';

describe('PhoneTypeListComponent', () => {
  let component: PhoneTypeListComponent;
  let fixture: ComponentFixture<PhoneTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
