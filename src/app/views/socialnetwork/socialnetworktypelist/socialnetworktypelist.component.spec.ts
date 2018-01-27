import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialNetworkTypeListComponent } from './socialnetworktypelist.component';

describe('SocialNetworkTypeListComponent', () => {
  let component: SocialNetworkTypeListComponent;
  let fixture: ComponentFixture<SocialNetworkTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SocialNetworkTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialNetworkTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
