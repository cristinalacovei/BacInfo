import { TestBed } from '@angular/core/testing';

import { UserValidatorService } from './user-validators.service';

describe('UserValidatorsService', () => {
  let service: UserValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
