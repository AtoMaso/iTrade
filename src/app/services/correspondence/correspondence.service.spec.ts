import { TestBed, inject } from '@angular/core/testing';

import { CorrespondenceService } from './correspondence.service';

describe('CorrespondenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CorrespondenceService]
    });
  });

  it('should be created', inject([CorrespondenceService], (service: CorrespondenceService) => {
    expect(service).toBeTruthy();
  }));
});
