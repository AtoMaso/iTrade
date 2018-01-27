import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocialNetworkTypeComponent } from './addsocialnetworktype.component';

describe('AddSocialNetworkTypeComponent', () => {
  let component: AddSocialNetworkTypeComponent;
  let fixture: ComponentFixture<AddSocialNetworkTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSocialNetworkTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocialNetworkTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
