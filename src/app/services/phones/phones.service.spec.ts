import { TestBed, inject } from '@angular/core/testing';

import { PhonesService } from './phones.service';

describe('PhonesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhonesService]
    });
  });

  it('should be created', inject([PhonesService], (service: PhonesService) => {
    expect(service).toBeTruthy();
  }));
});
