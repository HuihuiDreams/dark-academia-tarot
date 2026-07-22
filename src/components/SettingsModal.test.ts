import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SettingsModal } from './SettingsModal';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(async (cmd, args) => {
    if (cmd === 'get_api_key') {
      return localStorage.getItem('mock_keyring_api_key');
    }
    if (cmd === 'save_api_key') {
      localStorage.setItem('mock_keyring_api_key', args.key);
      return;
    }
    if (cmd === 'delete_api_key') {
      localStorage.removeItem('mock_keyring_api_key');
      return;
    }
    return '';
  })
}));

describe('SettingsModal', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Clear document body
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes and renders correctly in the DOM', () => {
    const modal = new SettingsModal();
    expect(modal).toBeDefined();
    const container = document.querySelector('.modal-backdrop');
    expect(container).not.toBeNull();
    
    const dialog = container?.querySelector('.settings-modal-dialog');
    expect(dialog).not.toBeNull();
    
    const modeBtns = container?.querySelectorAll('.engine-mode-btn');
    expect(modeBtns?.length).toBe(2);
  });

  it('static methods return default values when localStorage is empty', async () => {
    expect(await SettingsModal.getEngineMode()).toBe('builtin');
    expect(await SettingsModal.getApiKey()).toBeNull();
    expect(SettingsModal.getCustomModel()).toBe('gemini-2.5-pro');
  });

  it('static methods return stored values', async () => {
    localStorage.setItem('mock_keyring_api_key', 'test-key');
    localStorage.setItem('dark_academia_tarot_engine_mode', 'custom');
    localStorage.setItem('dark_academia_tarot_custom_model', 'gemma-4-31b-it');

    expect(await SettingsModal.getEngineMode()).toBe('custom');
    expect(await SettingsModal.getApiKey()).toBe('test-key');
    expect(SettingsModal.getCustomModel()).toBe('gemma-4-31b-it');
  });

  it('switches modes when clicking mode buttons', () => {
    const modal = new SettingsModal();
    expect(modal).toBeDefined();
    const container = document.querySelector('.modal-backdrop') as HTMLElement;
    const modeBtns = container.querySelectorAll('.engine-mode-btn');
    const customContainer = container.querySelector('#customKeyContainer') as HTMLElement;
    
    // Default is builtin, so custom container should be hidden
    expect(customContainer.style.display).toBe('none');

    // Click custom mode button
    const customBtn = Array.from(modeBtns).find(btn => btn.getAttribute('data-mode') === 'custom') as HTMLElement;
    customBtn.click();

    expect(customBtn.classList.contains('active')).toBe(true);
    expect(customContainer.style.display).toBe('flex');
    
    // Click builtin mode button
    const builtinBtn = Array.from(modeBtns).find(btn => btn.getAttribute('data-mode') === 'builtin') as HTMLElement;
    builtinBtn.click();

    expect(builtinBtn.classList.contains('active')).toBe(true);
    expect(customContainer.style.display).toBe('none');
  });

  it('saves settings to localStorage and calls callback on save', async () => {
    const modal = new SettingsModal();
    expect(modal).toBeDefined();
    const container = document.querySelector('.modal-backdrop') as HTMLElement;
    const saveBtn = container.querySelector('#btnSaveModal') as HTMLButtonElement;
    const apiKeyInput = container.querySelector('#apiKeyInput') as HTMLInputElement;
    const modeBtns = container.querySelectorAll('.engine-mode-btn');
    const customBtn = Array.from(modeBtns).find(btn => btn.getAttribute('data-mode') === 'custom') as HTMLElement;
    
    const onKeyChange = vi.fn();
    await modal.show(onKeyChange);

    // Switch to custom mode and fill API key
    customBtn.click();
    apiKeyInput.value = 'new-api-key';

    // Click save
    saveBtn.click();
    // Wait for the async click handler to finish
    await new Promise(process.nextTick);

    expect(localStorage.getItem('dark_academia_tarot_engine_mode')).toBe('custom');
    expect(localStorage.getItem('mock_keyring_api_key')).toBe('new-api-key');
    expect(onKeyChange).toHaveBeenCalledWith('new-api-key');
    expect(container.classList.contains('active')).toBe(false);
  });

  it('removes api key from localStorage if saved empty', async () => {
    localStorage.setItem('mock_keyring_api_key', 'test-key');
    const modal = new SettingsModal();
    expect(modal).toBeDefined();
    const container = document.querySelector('.modal-backdrop') as HTMLElement;
    const saveBtn = container.querySelector('#btnSaveModal') as HTMLButtonElement;
    const apiKeyInput = container.querySelector('#apiKeyInput') as HTMLInputElement;
    
    apiKeyInput.value = '   ';
    saveBtn.click();
    await new Promise(process.nextTick);

    expect(localStorage.getItem('mock_keyring_api_key')).toBeNull();
  });

  it('shows error and keeps modal open when IPC save fails', async () => {
    const { invoke } = await import('@tauri-apps/api/core');
    // Override invoke to fail only on save_api_key
    (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string, args?: Record<string, unknown>) => {
      if (cmd === 'save_api_key') throw new Error('Keychain locked');
      if (cmd === 'get_api_key') return localStorage.getItem('mock_keyring_api_key');
      if (cmd === 'delete_api_key') { localStorage.removeItem('mock_keyring_api_key'); return; }
      return '';
    });

    const modal = new SettingsModal();
    await modal.show();
    const container = document.querySelector('.modal-backdrop') as HTMLElement;
    const saveBtn = container.querySelector('#btnSaveModal') as HTMLButtonElement;
    const apiKeyInput = container.querySelector('#apiKeyInput') as HTMLInputElement;
    const errorBox = container.querySelector('#modalError') as HTMLElement;
    const modeBtns = container.querySelectorAll('.engine-mode-btn');
    const customBtn = Array.from(modeBtns).find(btn => btn.getAttribute('data-mode') === 'custom') as HTMLElement;

    customBtn.click();
    apiKeyInput.value = 'my-key';
    saveBtn.click();
    await new Promise(process.nextTick);

    // Modal should still be open
    expect(container.classList.contains('active')).toBe(true);
    // Error box should be visible
    expect(errorBox.style.display).toBe('block');
    expect(errorBox.textContent).toContain('契约封存失败');

    // Restore default mock for subsequent tests
    (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string, args?: Record<string, unknown>) => {
      if (cmd === 'get_api_key') return localStorage.getItem('mock_keyring_api_key');
      if (cmd === 'save_api_key') { localStorage.setItem('mock_keyring_api_key', (args as { key: string }).key); return; }
      if (cmd === 'delete_api_key') { localStorage.removeItem('mock_keyring_api_key'); return; }
      return '';
    });
  });

  it('toggles visibility correctly with show and hide methods', async () => {
    const modal = new SettingsModal();
    expect(modal).toBeDefined();
    const container = document.querySelector('.modal-backdrop') as HTMLElement;
    
    expect(container.classList.contains('active')).toBe(false);
    
    await modal.show();
    expect(container.classList.contains('active')).toBe(true);
    
    modal.hide();
    expect(container.classList.contains('active')).toBe(false);
  });
  
  it('hides modal when clicking on backdrop', async () => {
    const modal = new SettingsModal();
    expect(modal).toBeDefined();
    const container = document.querySelector('.modal-backdrop') as HTMLElement;
    
    await modal.show();
    expect(container.classList.contains('active')).toBe(true);
    
    // Simulate click on backdrop itself
    const event = new MouseEvent('click', { bubbles: true });
    container.dispatchEvent(event);
    
    expect(container.classList.contains('active')).toBe(false);
  });

  it('handles custom model input display logic', () => {
    const modal = new SettingsModal();
    expect(modal).toBeDefined();
    const container = document.querySelector('.modal-backdrop') as HTMLElement;
    const modelSelect = container.querySelector('#modelSelect') as HTMLSelectElement;
    const customModelInput = container.querySelector('#customModelInput') as HTMLInputElement;

    expect(customModelInput.style.display).toBe('none');

    modelSelect.value = 'custom_input';
    const changeEvent = new Event('change');
    modelSelect.dispatchEvent(changeEvent);

    expect(customModelInput.style.display).toBe('block');
  });
});
