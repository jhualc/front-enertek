import { TestBed } from '@angular/core/testing';

import { ChatPanelService } from './chat-panel.service';

describe('ChatPanelService', () => {
  let service: ChatPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
