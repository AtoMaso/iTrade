import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderAccountComponent } from './traderaccount.component';

describe('TraderAccountComponent', () => {
  let component: TraderAccountComponent;
  let fixture: ComponentFixture<TraderAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
