import { TestBed, inject } from '@angular/core/testing';

import { SocialNetworksService } from './social-networks.service';

describe('SocialNetworksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialNetworksService]
    });
  });

  it('should be created', inject([SocialNetworksService], (service: SocialNetworksService) => {
    expect(service).toBeTruthy();
  }));
});
