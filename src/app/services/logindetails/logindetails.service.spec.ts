import { TestBed, inject } from '@angular/core/testing';

import { LoginDetailsService } from './logindetails.service';

describe('SecurityDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginDetailsService]
    });
  });

  it('should be created', inject([LoginDetailsService], (service: LoginDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
