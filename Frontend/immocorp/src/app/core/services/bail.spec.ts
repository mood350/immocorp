import { TestBed } from '@angular/core/testing';

import { Bail } from './bail';

describe('Bail', () => {
  let service: Bail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
