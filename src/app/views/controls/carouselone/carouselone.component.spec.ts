import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouseloneComponent } from './carouselone.component';

describe('CarouseloneComponent', () => {
  let component: CarouseloneComponent;
  let fixture: ComponentFixture<CarouseloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouseloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouseloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
