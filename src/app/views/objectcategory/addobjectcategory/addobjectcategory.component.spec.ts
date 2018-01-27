import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObjectCategoryComponent } from './addobjectcategory.component';

describe('AddObjectCategoryComponent', () => {
  let component: AddObjectCategoryComponent;
  let fixture: ComponentFixture<AddObjectCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddObjectCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddObjectCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
