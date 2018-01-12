import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeInfoComponent } from './tradeinfo.component';

describe('TradeInfoComponent', () => {
  let component: TradeInfoComponent;
  let fixture: ComponentFixture<TradeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
