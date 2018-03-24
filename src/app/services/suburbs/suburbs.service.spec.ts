import { TestBed, inject } from '@angular/core/testing';

import { SuburbsService } from './suburbs.service';

describe('SuburbsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuburbsService]
    });
  });

  it('should be created', inject([SuburbsService], (service: SuburbsService) => {
    expect(service).toBeTruthy();
  }));
});
