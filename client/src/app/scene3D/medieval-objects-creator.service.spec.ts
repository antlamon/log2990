import { TestBed } from '@angular/core/testing';

import { MedievalObjectsCreatorService } from './medieval-objects-creator.service';

describe('MedievalObjectsCreatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedievalObjectsCreatorService = TestBed.get(MedievalObjectsCreatorService);
    expect(service).toBeTruthy();
  });
});
