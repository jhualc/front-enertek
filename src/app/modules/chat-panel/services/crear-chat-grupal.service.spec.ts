import { TestBed } from '@angular/core/testing';

import { CrearChatGrupalService } from './crear-chat-grupal.service';

describe('CrearChatGrupalService', () => {
  let service: CrearChatGrupalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearChatGrupalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
