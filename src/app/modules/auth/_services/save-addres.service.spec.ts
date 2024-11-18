import { TestBed } from '@angular/core/testing';

import { SaveAddresService } from './save-addres.service';

describe('SaveAddresService', () => {
  let service: SaveAddresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveAddresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
