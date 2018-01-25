import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessmessagelistComponent } from './processmessagelist.component';

describe('ProcessmessagelistComponent', () => {
  let component: ProcessmessagelistComponent;
  let fixture: ComponentFixture<ProcessmessagelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessmessagelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessmessagelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
