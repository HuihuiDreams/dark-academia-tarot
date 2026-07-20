import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiService } from './GeminiService';
import { SettingsModal } from '../components/SettingsModal';
import { invoke } from '@tauri-apps/api/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    GoogleGenerativeAI: vi.fn()
  };
});

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onError when no API key is available', async () => {
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
    
    const mockGenerateContentStream = vi.fn().mockResolvedValue({ stream: [] });
    (GoogleGenerativeAI as any).mockImplementation(function() {
      return {
        getGenerativeModel: () => ({
          generateContentStream: mockGenerateContentStream
        })
      };
    });

    const onStartMock = vi.fn();
    const callbacks = {
      onStart: onStartMock,
      onChunk: vi.fn(),
      onComplete: vi.fn(),
      onError: vi.fn()
    };

    await GeminiService.interpretSpreadStream('Test', [], callbacks);
    
    expect(invoke).toHaveBeenCalledWith('get_fallback_api_key');
    expect(onStartMock).toHaveBeenCalled();
  });

  it('should filter out thought chunks and pass normal chunks to onChunk', async () => {
    (SettingsModal.getApiKey as any).mockReturnValue('valid-key');
    (SettingsModal.getEngineMode as any).mockReturnValue('custom');
    (SettingsModal.getCustomModel as any).mockReturnValue('test-model');

    const stream = [
      { candidates: [{ content: { parts: [{ text: 'thinking...', thought: true }] } }] },
      { candidates: [{ content: { parts: [{ text: 'Hello ' }] } }] },
      { candidates: [{ content: { parts: [{ text: 'World!' }] } }] }
    ];

    async function* asyncStream() {
      for (const item of stream) yield item;
    }

    const mockGenerateContentStream = vi.fn().mockResolvedValue({ stream: asyncStream() });
    (GoogleGenerativeAI as any).mockImplementation(function() {
      return {
        getGenerativeModel: () => ({
          generateContentStream: mockGenerateContentStream
        })
      };
    });

    const onChunkMock = vi.fn();
    const onCompleteMock = vi.fn();
    const callbacks = {
      onChunk: onChunkMock,
      onComplete: onCompleteMock,
      onError: vi.fn()
    };

    await GeminiService.interpretSpreadStream('Test', [], callbacks);

    expect(onChunkMock).toHaveBeenCalledTimes(2);
    expect(onChunkMock).toHaveBeenNthCalledWith(1, 'Hello ');
    expect(onChunkMock).toHaveBeenNthCalledWith(2, 'World!');
    expect(onCompleteMock).toHaveBeenCalled();
  });

  it('should generate a prompt that forbids modern tech/programmer jargon', async () => {
    (SettingsModal.getApiKey as any).mockReturnValue('valid-key');
    (SettingsModal.getEngineMode as any).mockReturnValue('builtin');

    const mockGenerateContentStream = vi.fn().mockResolvedValue({ stream: [] });
    (GoogleGenerativeAI as any).mockImplementation(function() {
      return {
        getGenerativeModel: () => ({
          generateContentStream: mockGenerateContentStream
        })
      };
    });

    const callbacks = {
      onChunk: vi.fn(),
      onComplete: vi.fn(),
      onError: vi.fn()
    };

    await GeminiService.interpretSpreadStream('高市早苗会在近期下台吗', [], callbacks);

    expect(mockGenerateContentStream).toHaveBeenCalled();
    const promptArg = mockGenerateContentStream.mock.calls[0][0];
    
    // Verify the system prompt constraints
    expect(promptArg).toContain('绝对不要使用任何现代科技、计算机、代码或程序员相关的比喻与术语');
    expect(promptArg).not.toContain('如果来访者输入的问题涉及程序员/代码');
  });

  it('should fallback to next model if first model fails', async () => {
    (SettingsModal.getApiKey as any).mockReturnValue('valid-key');
    (SettingsModal.getEngineMode as any).mockReturnValue('builtin'); // Builtin uses 3 models

    const modelsAttempted: string[] = [];
    const mockGetGenerativeModel = vi.fn().mockImplementation(({ model }) => {
      modelsAttempted.push(model);
      return {
        generateContentStream: async () => {
          if (modelsAttempted.length === 1) {
            throw new Error('First model failed');
          }
          return { stream: [] };
        }
      };
    });

    (GoogleGenerativeAI as any).mockImplementation(function() {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    });

    const onCompleteMock = vi.fn();
    const callbacks = {
      onChunk: vi.fn(),
      onComplete: onCompleteMock,
      onError: vi.fn()
    };

    await GeminiService.interpretSpreadStream('Test', [], callbacks);

    expect(modelsAttempted.length).toBe(2);
    expect(modelsAttempted[0]).toBe('gemini-3.1-flash-lite');
    expect(modelsAttempted[1]).toBe('gemma-4-31b-it');
    expect(onCompleteMock).toHaveBeenCalled();
  });

  it('should format 429 Quota Exceeded error correctly for custom mode', async () => {
    (SettingsModal.getApiKey as any).mockReturnValue('valid-key');
    (SettingsModal.getEngineMode as any).mockReturnValue('custom');
    (SettingsModal.getCustomModel as any).mockReturnValue('custom-test-model');

    const mockGetGenerativeModel = vi.fn().mockImplementation(() => ({
      generateContentStream: async () => {
        throw new Error('429 Quota exceeded for this project');
      }
    }));

    (GoogleGenerativeAI as any).mockImplementation(function() {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    });

    const onErrorMock = vi.fn();
    const callbacks = {
      onChunk: vi.fn(),
      onComplete: vi.fn(),
      onError: onErrorMock
    };

    await GeminiService.interpretSpreadStream('Test', [], callbacks);

    expect(onErrorMock).toHaveBeenCalled();
    expect(onErrorMock.mock.calls[0][0]).toContain('私人契约模型及后备链路均限流');
    expect(onErrorMock.mock.calls[0][0]).toContain('custom-test-model');
  });

  it('should format 404 Not Found error correctly for custom mode', async () => {
    (SettingsModal.getApiKey as any).mockReturnValue('valid-key');
    (SettingsModal.getEngineMode as any).mockReturnValue('custom');
    (SettingsModal.getCustomModel as any).mockReturnValue('missing-model');

    const mockGetGenerativeModel = vi.fn().mockImplementation(() => ({
      generateContentStream: async () => {
        throw new Error('404 model not found');
      }
    }));

    (GoogleGenerativeAI as any).mockImplementation(function() {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    });

    const onErrorMock = vi.fn();
    const callbacks = {
      onChunk: vi.fn(),
      onComplete: vi.fn(),
      onError: onErrorMock
    };

    await GeminiService.interpretSpreadStream('Test', [], callbacks);

    expect(onErrorMock).toHaveBeenCalled();
    expect(onErrorMock.mock.calls[0][0]).toContain('私人契约模型未找到');
  });

  it('should format 429 error correctly for builtin mode', async () => {
    (SettingsModal.getApiKey as any).mockReturnValue('valid-key');
    (SettingsModal.getEngineMode as any).mockReturnValue('builtin');

    const mockGetGenerativeModel = vi.fn().mockImplementation(() => ({
      generateContentStream: async () => {
        throw new Error('RESOURCE_EXHAUSTED');
      }
    }));

    (GoogleGenerativeAI as any).mockImplementation(function() {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    });

    const onErrorMock = vi.fn();
    const callbacks = {
      onChunk: vi.fn(),
      onComplete: vi.fn(),
      onError: onErrorMock
    };

    await GeminiService.interpretSpreadStream('Test', [], callbacks);

    expect(onErrorMock).toHaveBeenCalled();
    expect(onErrorMock.mock.calls[0][0]).toContain('深渊通联限流（429 Quota Exceeded）');
  });
});
