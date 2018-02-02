import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTradesListComponent } from './mytradeslist.component';

describe('MyTradesListComponent', () => {
  let component: MyTradesListComponent;
  let fixture: ComponentFixture<MyTradesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyTradesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTradesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
