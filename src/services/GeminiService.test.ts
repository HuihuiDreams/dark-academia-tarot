import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiService } from './GeminiService';
import { SettingsModal } from '../components/SettingsModal';
import { invoke } from '@tauri-apps/api/core';

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn()
}));

// Mock SettingsModal
vi.mock('../components/SettingsModal', () => ({
  SettingsModal: {
    getApiKey: vi.fn(),
    getEngineMode: vi.fn(),
    getCustomModel: vi.fn()
  }
}));

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContentStream: async () => ({ stream: [] })
        };
      }
    }
  };
});

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onError when no API key is available', async () => {
    // Setup mocks to return no keys
    (SettingsModal.getApiKey as any).mockReturnValue(null);
    (SettingsModal.getEngineMode as any).mockReturnValue('builtin');
    (invoke as any).mockResolvedValue('');

    const onErrorMock = vi.fn();
    const callbacks = {
      onChunk: vi.fn(),
      onComplete: vi.fn(),
      onError: onErrorMock
    };

    await GeminiService.interpretSpreadStream('Test question', [], callbacks);

    expect(onErrorMock).toHaveBeenCalled();
    expect(onErrorMock.mock.calls[0][0]).toContain('未检测到有效占星契约钥匙');
  });

  it('should invoke tauri to get fallback key if mode is builtin', async () => {
    (SettingsModal.getApiKey as any).mockReturnValue(null);
    (SettingsModal.getEngineMode as any).mockReturnValue('builtin');
    (invoke as any).mockResolvedValue('mock-fallback-key');

    const onErrorMock = vi.fn();
    const onStartMock = vi.fn();
    const callbacks = {
      onStart: onStartMock,
      onChunk: vi.fn(),
      onComplete: vi.fn(),
      onError: onErrorMock
    };

    await GeminiService.interpretSpreadStream('Test', [], callbacks);
    
    // Check if invoke was called
    expect(invoke).toHaveBeenCalledWith('get_fallback_api_key');
    // If it gets a key, it should proceed to onStart
    expect(onStartMock).toHaveBeenCalled();
  });
});
