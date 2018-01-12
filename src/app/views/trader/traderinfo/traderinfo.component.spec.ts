import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderInfoComponent } from './traderinfo.component';

describe('TraderInfoComponent', () => {
  let component: TraderInfoComponent;
  let fixture: ComponentFixture<TraderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
