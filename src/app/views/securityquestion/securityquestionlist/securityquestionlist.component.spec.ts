import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityquestionlistComponent } from './securityquestionlist.component';

describe('SecurityquestionlistComponent', () => {
  let component: SecurityquestionlistComponent;
  let fixture: ComponentFixture<SecurityquestionlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityquestionlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityquestionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
