import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTradeListComponent } from './mytradelist.component';

describe('MyTradeListComponent', () => {
  let component: MyTradeListComponent;
  let fixture: ComponentFixture<MyTradeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyTradeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTradeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
