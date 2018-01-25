import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectcategorylistComponent } from './objectcategorylist.component';

describe('ObjectcategorylistComponent', () => {
  let component: ObjectcategorylistComponent;
  let fixture: ComponentFixture<ObjectcategorylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectcategorylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectcategorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
