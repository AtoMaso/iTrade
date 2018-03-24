import { TestBed, inject } from '@angular/core/testing';

import { PostcodesService } from './postcodes.service';

describe('PostcodesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostcodesService]
    });
  });

  it('should be created', inject([PostcodesService], (service: PostcodesService) => {
    expect(service).toBeTruthy();
  }));
});
