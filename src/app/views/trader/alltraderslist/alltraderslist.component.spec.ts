import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTradersListComponent } from './alltraderslist.component';

describe('AllTradersListComponent', () => {
  let component: AllTradersListComponent;
  let fixture: ComponentFixture<AllTradersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllTradersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTradersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
