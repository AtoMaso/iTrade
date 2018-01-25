import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddobjectcategoryComponent } from './addobjectcategory.component';

describe('AddobjectcategoryComponent', () => {
  let component: AddobjectcategoryComponent;
  let fixture: ComponentFixture<AddobjectcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddobjectcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddobjectcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
