import { TestBed, inject } from '@angular/core/testing';

import { GeoDataService } from './geodata.service';

describe('GeoDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoDataService]
    });
  });

  it('should be created', inject([GeoDataService], (service: GeoDataService) => {
    expect(service).toBeTruthy();
  }));
});
