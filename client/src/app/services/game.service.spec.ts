import { TestBed, inject } from '@angular/core/testing';

import { GameService } from './game.service';
import { HttpClientModule } from '@angular/common/http';

describe('GameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [GameService]
    });
  });

  it('should be created', inject([GameService], (service: GameService) => {
    expect(service).toBeTruthy();
  }));
});
