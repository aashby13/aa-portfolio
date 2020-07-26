import { TestBed } from '@angular/core/testing';

import { GhostDragService } from './ghost-drag.service';

describe('GhostDragService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GhostDragService = TestBed.get(GhostDragService);
    expect(service).toBeTruthy();
  });
});
