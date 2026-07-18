const STORAGE_KEY = 'dark_academia_tarot_api_key';
const MODE_KEY = 'dark_academia_tarot_engine_mode';
const CUSTOM_MODEL_KEY = 'dark_academia_tarot_custom_model';

export type EngineMode = 'builtin' | 'custom';

export class SettingsModal {
  private container: HTMLDivElement;
  private onKeyChangeCallback?: (key: string) => void;
  private currentMode: EngineMode = 'builtin';

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'modal-backdrop';
    this.container.setAttribute('data-tauri-drag-region', 'false');
    this.render();
    document.body.appendChild(this.container);
  }

  private render() {
    this.container.innerHTML = `
      <div class="modal-dialog settings-modal-dialog" data-tauri-drag-region="false">
        <div class="modal-title">
          <span>⚙️</span>
          <span>占星引擎与契约设置</span>
        </div>
        
        <div class="engine-mode-switcher">
          <button class="engine-mode-btn active" data-mode="builtin">
            <span class="mode-icon">✨</span>
            <span class="mode-label">内置免费版</span>
          </button>
          <button class="engine-mode-btn" data-mode="custom">
            <span class="mode-icon">🗝️</span>
            <span class="mode-label">私人定制版</span>
          </button>
        </div>

        <div class="mode-info-box" id="modeInfoBox">
          👑 当前已激活内置免费暗黑契约（Gemini 3.1 Flash Lite / 多模型智能容灾）。由开发者预置并提供基础加速，零配置直接召唤解读。
        </div>

        <div class="custom-key-container" id="customKeyContainer" style="display: none; flex-direction: column; gap: 12px;">
          <div class="settings-form-group">
            <label class="settings-form-label">🗝️ 专属 API Key (Google AI Studio)</label>
            <input type="password" class="modal-input" id="apiKeyInput" placeholder="AIzaSy..." spellcheck="false" />
          </div>
          <div class="settings-form-group">
            <label class="settings-form-label">🔮 驱动占星模型 (Model Selection)</label>
            <select class="modal-input modal-select" id="modelSelect">
              <option value="gemini-3.1-pro">Gemini 3.1 Pro (最新旗舰模型，深度思考)</option>
              <option value="gemini-3.1-flash">Gemini 3.1 Flash (最新高效极速模型)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (基础极速模型)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (高阶旗舰思考与深层推理)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (极速智能与高效平衡)</option>
              <option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro (2.0 经典旗舰模型)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (经典长文本深度推理)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (经典轻量极速响应)</option>
              <option value="custom_input">✏️ 自定义模型名称 (如 gemma-4-31b-it...)</option>
            </select>
            <input type="text" class="modal-input" id="customModelInput" placeholder="输入模型完整 ID，例如 gemma-4-31b-it" spellcheck="false" style="margin-top: 6px; display: none;" />
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" id="btnCloseModal">取消关闭</button>
          <button class="btn-primary" id="btnSaveModal">缔结契约 (保存)</button>
        </div>
      </div>
    `;

    const btnClose = this.container.querySelector('#btnCloseModal') as HTMLButtonElement;
    const btnSave = this.container.querySelector('#btnSaveModal') as HTMLButtonElement;
    const input = this.container.querySelector('#apiKeyInput') as HTMLInputElement;
    const modelSelect = this.container.querySelector('#modelSelect') as HTMLSelectElement;
    const customModelInput = this.container.querySelector('#customModelInput') as HTMLInputElement;
    const modeBtns = this.container.querySelectorAll('.engine-mode-btn');

    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as EngineMode;
        if (mode) {
          this.setModeUI(mode);
        }
      });
    });

    modelSelect.addEventListener('change', () => {
      if (modelSelect.value === 'custom_input') {
        customModelInput.style.display = 'block';
        customModelInput.focus();
      } else {
        customModelInput.style.display = 'none';
      }
    });

    btnClose.addEventListener('click', () => this.hide());
    
    btnSave.addEventListener('click', () => {
      localStorage.setItem(MODE_KEY, this.currentMode);
      const val = input.value.trim();
      if (val) {
        localStorage.setItem(STORAGE_KEY, val);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      let chosenModel = modelSelect.value;
      if (chosenModel === 'custom_input') {
        chosenModel = customModelInput.value.trim() || 'gemini-2.5-pro';
      }
      localStorage.setItem(CUSTOM_MODEL_KEY, chosenModel);

      if (this.onKeyChangeCallback) {
        this.onKeyChangeCallback(val);
      }
      this.hide();
    });

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.hide();
      }
    });
  }

  private setModeUI(mode: EngineMode) {
    this.currentMode = mode;
    const modeBtns = this.container.querySelectorAll('.engine-mode-btn');
    const infoBox = this.container.querySelector('#modeInfoBox') as HTMLElement;
    const customContainer = this.container.querySelector('#customKeyContainer') as HTMLElement;
    const input = this.container.querySelector('#apiKeyInput') as HTMLInputElement;

    modeBtns.forEach((btn) => {
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (mode === 'builtin') {
      infoBox.innerHTML = `👑 <b>内置免费暗黑契约（Gemini 3.1 Flash Lite / 多模型智能容灾）</b><br/><span style="opacity: 0.85; font-size: 0.9em;">由开发者预置并提供基础安全解密渲染，默认由 Gemini 3.1 Flash Lite 引擎驱动，零配置即可开启占卜流式解析。适合日常快速启示。</span>`;
      customContainer.style.display = 'none';
    } else {
      infoBox.innerHTML = `🗝️ <b>私人定制专属契约（API Key 与模型选择）</b><br/><span style="opacity: 0.85; font-size: 0.9em;">为了独享无限额度及自由调用旗舰深度模型（如 2.5 Pro），请填入 Google Gemini API Key 并选择所需驱动模型。密文与设定将严格封存于本地存储，绝不外泄。</span>`;
      customContainer.style.display = 'flex';
      setTimeout(() => input?.focus(), 50);
    }
  }

  public show(onKeyChange?: (key: string) => void) {
    if (onKeyChange) {
      this.onKeyChangeCallback = onKeyChange;
    }
    const savedMode = SettingsModal.getEngineMode();
    const input = this.container.querySelector('#apiKeyInput') as HTMLInputElement;
    input.value = localStorage.getItem(STORAGE_KEY) || '';

    const savedModel = SettingsModal.getCustomModel();
    const modelSelect = this.container.querySelector('#modelSelect') as HTMLSelectElement;
    const customModelInput = this.container.querySelector('#customModelInput') as HTMLInputElement;

    if (modelSelect && customModelInput) {
      const optionValues = Array.from(modelSelect.options).map((opt) => opt.value);
      if (optionValues.includes(savedModel) && savedModel !== 'custom_input') {
        modelSelect.value = savedModel;
        customModelInput.style.display = 'none';
        customModelInput.value = '';
      } else {
        modelSelect.value = 'custom_input';
        customModelInput.style.display = 'block';
        customModelInput.value = savedModel;
      }
    }
    
    this.setModeUI(savedMode);
    this.container.classList.add('active');
  }

  public hide() {
    this.container.classList.remove('active');
  }

  public static getEngineMode(): EngineMode {
    const mode = localStorage.getItem(MODE_KEY);
    if (mode === 'custom' && localStorage.getItem(STORAGE_KEY)) {
      return 'custom';
    }
    return 'builtin';
  }

  public static getApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  public static getCustomModel(): string {
    return localStorage.getItem(CUSTOM_MODEL_KEY) || 'gemini-2.5-pro';
  }
}
