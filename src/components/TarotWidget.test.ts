import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TarotWidget } from './TarotWidget';
import { getCurrentWindow } from '@tauri-apps/api/window';

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

describe('TarotWidget', () => {
  let rootElement: HTMLElement;
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(btnHide).not.toBeNull();
    
    // Simulate click
    btnHide.click();
    
    // Check if getCurrentWindow().hide() was called
    const currentWindowMock = getCurrentWindow();
    
    // Yield to let async event listeners execute (since the listener is async)
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(currentWindowMock.hide).toHaveBeenCalled();
  });
});
