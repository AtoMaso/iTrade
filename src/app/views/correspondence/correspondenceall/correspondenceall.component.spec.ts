import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenceAllComponent } from './correspondenceall.component';

describe('CorrespondenceAllComponent', () => {
  let component: CorrespondenceAllComponent;
  let fixture: ComponentFixture<CorrespondenceAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CorrespondenceAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondenceAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
