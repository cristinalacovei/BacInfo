import { TestBed } from '@angular/core/testing';

import { NotificareService } from './notificare.service';

describe('NotificareService', () => {
  let service: NotificareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
