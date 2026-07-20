import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TarotWidget } from './TarotWidget';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { emit } from '@tauri-apps/api/event';
import { GeminiService } from '../services/GeminiService';

// Mock Tauri API
vi.mock('@tauri-apps/api/window', () => {
  const mockWindow = {
    hide: vi.fn(),
    startDragging: vi.fn(),
    close: vi.fn(),
  };
  return {
    getCurrentWindow: vi.fn(() => mockWindow),
  };
});

let mockListeners: Record<string, Function> = {};
vi.mock('@tauri-apps/api/event', () => ({
  listen: vi.fn((event, callback) => {
    mockListeners[event] = callback;
    return Promise.resolve(() => {});
  }),
  emit: vi.fn(() => Promise.resolve()),
}));

// Mock GeminiService
vi.mock('../services/GeminiService', () => ({
  GeminiService: {
    interpretSpreadStream: vi.fn()
  }
}));

describe('TarotWidget', () => {
  let rootElement: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mockListeners = {};
    // Setup clean DOM
    document.body.innerHTML = '<div id="app"></div>';
    rootElement = document.getElementById('app') as HTMLElement;
    // Instantiate widget
    new TarotWidget(rootElement);
  });

  it('should render the UI components including the hide button', () => {
    const btnHide = rootElement.querySelector('#btnHide');
    expect(btnHide).not.toBeNull();
    expect(btnHide?.textContent).toBe('_');
  });

  it('should call tauri hide API when hide button is clicked', async () => {
    const btnHide = rootElement.querySelector('#btnHide') as HTMLButtonElement;
    btnHide.click();
    const currentWindowMock = getCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(currentWindowMock.hide).toHaveBeenCalled();
    expect(emit).toHaveBeenCalledWith('window-hidden');
  });

  it('should toggle card flip and enable submit only when 3 cards are flipped', () => {
    const cardScenes = rootElement.querySelectorAll('.tarot-card-scene');
    const btnSubmit = rootElement.querySelector('#btnSubmit') as HTMLButtonElement;
    const spreadStatus = rootElement.querySelector('#spreadStatus') as HTMLElement;

    expect(cardScenes.length).toBe(3);
    expect(btnSubmit.disabled).toBe(true);
    expect(spreadStatus.innerHTML).toContain('三牌尽启召唤暗黑学院指引');

    // Simulate clicking cards
    cardScenes.forEach((scene: any, i) => {
      scene.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0 }));
      scene.dispatchEvent(new MouseEvent('mouseup', { clientX: 0, clientY: 0 }));
      
      if (i < 2) {
        expect(btnSubmit.disabled).toBe(true);
      }
    });

    // After clicking all 3
    expect(btnSubmit.disabled).toBe(false);
    expect(spreadStatus.innerHTML).toContain('三牌尽启');
    
    // Unflip a card
    cardScenes[0].dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0 }));
    cardScenes[0].dispatchEvent(new MouseEvent('mouseup', { clientX: 0, clientY: 0 }));
    expect(btnSubmit.disabled).toBe(true);
    expect(spreadStatus.innerHTML).toContain('2 / 3');
  });

  it('should draw a new spread when shuffle button is clicked', () => {
    // Flip all cards first
    const cardScenes = rootElement.querySelectorAll('.tarot-card-scene');
    cardScenes.forEach((scene: any) => {
      scene.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0 }));
      scene.dispatchEvent(new MouseEvent('mouseup', { clientX: 0, clientY: 0 }));
    });
    
    const btnSubmit = rootElement.querySelector('#btnSubmit') as HTMLButtonElement;
    expect(btnSubmit.disabled).toBe(false);

    // Shuffle
    const btnShuffle = rootElement.querySelector('#btnShuffle') as HTMLButtonElement;
    btnShuffle.click();

    // Verify reset state
    const newBtnSubmit = rootElement.querySelector('#btnSubmit') as HTMLButtonElement;
    expect(newBtnSubmit.disabled).toBe(true);
    
    const spreadStatus = rootElement.querySelector('#spreadStatus') as HTMLElement;
    expect(spreadStatus.innerHTML).toContain('三牌尽启召唤暗黑学院指引');
  });

  it('should handle interpretation submission and stream rendering', async () => {
    // Mock the GeminiService stream callback execution
    (GeminiService.interpretSpreadStream as any).mockImplementation(async (_q: string, _c: any, callbacks: any) => {
      callbacks.onStart();
      callbacks.onChunk('Chunk 1 ');
      callbacks.onChunk('**Chunk 2**');
      callbacks.onComplete();
    });

    const inputQuestion = rootElement.querySelector('#questionInput') as HTMLInputElement;
    const btnSubmit = rootElement.querySelector('#btnSubmit') as HTMLButtonElement;

    // Flip all 3 cards to enable submit
    const cardScenes = rootElement.querySelectorAll('.tarot-card-scene');
    cardScenes.forEach((scene: any) => {
      scene.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0 }));
      scene.dispatchEvent(new MouseEvent('mouseup', { clientX: 0, clientY: 0 }));
    });

    expect(btnSubmit.disabled).toBe(false);
    inputQuestion.value = 'My question';

    // Submit
    btnSubmit.click();
    
    // Wait for async stream to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(GeminiService.interpretSpreadStream).toHaveBeenCalled();
    
    // Verify interpretation container has the parsed stream chunk text
    const interpretationContainer = rootElement.querySelector('#interpretationContainer') as HTMLElement;
    const streamOutput = interpretationContainer.querySelector('#streamTextOutput') as HTMLElement;
    
    expect(streamOutput).not.toBeNull();
    expect(streamOutput.style.display).toBe('block');
    expect(streamOutput.innerHTML).toContain('Chunk 1 <strong>Chunk 2</strong>');
  });

  it('should handle interpretation error gracefully', async () => {
    (GeminiService.interpretSpreadStream as any).mockImplementation(async (_q: string, _c: any, callbacks: any) => {
      callbacks.onStart();
      callbacks.onError('Test Error Message');
    });

    const btnSubmit = rootElement.querySelector('#btnSubmit') as HTMLButtonElement;
    const cardScenes = rootElement.querySelectorAll('.tarot-card-scene');
    cardScenes.forEach((scene: any) => {
      scene.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0 }));
      scene.dispatchEvent(new MouseEvent('mouseup', { clientX: 0, clientY: 0 }));
    });

    btnSubmit.click();
    await new Promise(resolve => setTimeout(resolve, 0));

    const interpretationContainer = rootElement.querySelector('#interpretationContainer') as HTMLElement;
    const streamOutput = interpretationContainer.querySelector('#streamTextOutput') as HTMLElement;
    
    expect(streamOutput.style.display).toBe('block');
    expect(streamOutput.textContent).toContain('[占卜通联异常] Test Error Message');
  });

  it('should open settings modal when open-settings IPC event is received', () => {
    expect(mockListeners['open-settings']).toBeDefined();
    mockListeners['open-settings']();
    
    const modal = document.querySelector('.modal-backdrop');
    expect(modal?.classList.contains('active')).toBe(true);
  });

  it('should reset spread when draw-new-spread IPC event is received', () => {
    const cardScenes = rootElement.querySelectorAll('.tarot-card-scene');
    cardScenes[0].dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0 }));
    cardScenes[0].dispatchEvent(new MouseEvent('mouseup', { clientX: 0, clientY: 0 }));
    
    const spreadStatus = rootElement.querySelector('#spreadStatus') as HTMLElement;
    expect(spreadStatus.innerHTML).toContain('1 / 3');

    expect(mockListeners['draw-new-spread']).toBeDefined();
    mockListeners['draw-new-spread']();
    
    const newSpreadStatus = rootElement.querySelector('#spreadStatus') as HTMLElement;
    expect(newSpreadStatus.innerHTML).toContain('三牌尽启召唤暗黑学院指引');
  });
});
