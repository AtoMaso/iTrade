import { TestBed, inject } from '@angular/core/testing';

import { SecurityDetailsService } from './securitydetails.service';

describe('SecurityDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurityDetailsService]
    });
  });

  it('should be created', inject([SecurityDetailsService], (service: SecurityDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
