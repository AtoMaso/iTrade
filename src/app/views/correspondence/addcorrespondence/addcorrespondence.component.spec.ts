import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorrespondenceComponent } from './addcorrespondence.component';

describe('AddCorrespondenceComponent', () => {
  let component: AddCorrespondenceComponent;
  let fixture: ComponentFixture<AddCorrespondenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCorrespondenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorrespondenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
