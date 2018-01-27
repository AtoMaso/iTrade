import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessMessageListComponent } from './processmessagelist.component';

describe('ProcessMessageListComponent', () => {
  let component: ProcessMessageListComponent;
  let fixture: ComponentFixture<ProcessMessageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessMessageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessMessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
