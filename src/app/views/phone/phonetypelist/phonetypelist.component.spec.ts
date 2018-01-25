import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonetypelistComponent } from './phonetypelist.component';

describe('PhonetypelistComponent', () => {
  let component: PhonetypelistComponent;
  let fixture: ComponentFixture<PhonetypelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhonetypelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonetypelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
