import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectCategoryListComponent } from './objectcategorylist.component';

describe('ObjectCategoryListComponent', () => {
  let component: ObjectCategoryListComponent;
  let fixture: ComponentFixture<ObjectCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
