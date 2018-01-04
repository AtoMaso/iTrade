import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandapanelComponent } from './expandapanel.component';

describe('ExpandapanelComponent', () => {
  let component: ExpandapanelComponent;
  let fixture: ComponentFixture<ExpandapanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandapanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandapanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
