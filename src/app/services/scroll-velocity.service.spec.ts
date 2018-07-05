import { TestBed, inject } from '@angular/core/testing';

import { ScrollVelocityService } from './scroll-velocity.service';

describe('ScrollVelocityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollVelocityService]
    });
  });

  it('should be created', inject([ScrollVelocityService], (service: ScrollVelocityService) => {
    expect(service).toBeTruthy();
  }));
});
