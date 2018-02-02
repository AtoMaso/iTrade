import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlDetailsComponent } from './contactdetails.component';

describe('ContactDetailsComContactlDetailsComponentponent', () => {
  let component: ContactlDetailsComponent;
  let fixture: ComponentFixture<ContactlDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactlDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
