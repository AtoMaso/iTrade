import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradersListComponent } from './traderslist.component';

describe('TradersListComponent', () => {
  let component: TradersListComponent;
  let fixture: ComponentFixture<TradersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TradersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
