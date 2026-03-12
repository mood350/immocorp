import { TestBed } from '@angular/core/testing';

import { Propriete } from './propriete';

describe('Propriete', () => {
  let service: Propriete;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Propriete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
