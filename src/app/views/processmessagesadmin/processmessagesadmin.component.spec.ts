import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessMessagesAdminComponent } from './processmessagesadmin.component';

describe('ProcessMessagesAdminComponent', () => {
  let component: ProcessMessagesAdminComponent;
  let fixture: ComponentFixture<ProcessMessagesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessMessagesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessMessagesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
