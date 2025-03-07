import { TestBed } from '@angular/core/testing';

import { LectiiService } from './lectii.service';

describe('LectiiService', () => {
  let service: LectiiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LectiiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
