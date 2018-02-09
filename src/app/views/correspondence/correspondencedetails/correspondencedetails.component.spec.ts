import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenceDetailsComponent } from './correspondencedetails.component';

describe('CorrespondenceDetailsComponent', () => {
  let component: CorrespondenceDetailsComponent;
  let fixture: ComponentFixture<CorrespondenceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CorrespondenceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
