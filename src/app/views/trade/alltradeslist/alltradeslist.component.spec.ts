import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTradesListComponent } from './alltradeslist.component';

describe('AllTradesListComponent', () => {
  let component: AllTradesListComponent;
  let fixture: ComponentFixture<AllTradesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllTradesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTradesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
