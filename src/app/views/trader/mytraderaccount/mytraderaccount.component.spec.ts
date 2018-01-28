import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTraderAccountComponent } from './mytraderaccount.component';

describe('MyTraderAccountComponent', () => {
  let component: MyTraderAccountComponent;
  let fixture: ComponentFixture<MyTraderAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyTraderAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTraderAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
