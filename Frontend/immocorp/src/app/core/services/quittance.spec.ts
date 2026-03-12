import { TestBed } from '@angular/core/testing';

import { Quittance } from './quittance';

describe('Quittance', () => {
  let service: Quittance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Quittance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
