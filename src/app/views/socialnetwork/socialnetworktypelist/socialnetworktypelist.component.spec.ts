import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialnetworktypelistComponent } from './socialnetworktypelist.component';

describe('SocialnetworktypelistComponent', () => {
  let component: SocialnetworktypelistComponent;
  let fixture: ComponentFixture<SocialnetworktypelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialnetworktypelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialnetworktypelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
