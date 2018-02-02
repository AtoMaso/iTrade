import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderHomeComponent } from './traderhome.component';

describe('TraderHomeComponent', () => {
  let component: TraderHomeComponent;
  let fixture: ComponentFixture<TraderHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TraderHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
