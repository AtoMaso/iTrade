import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderListComponent } from './traderlist.component';

describe('TraderListComponent', () => {
  let component: TraderListComponent;
  let fixture: ComponentFixture<TraderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
