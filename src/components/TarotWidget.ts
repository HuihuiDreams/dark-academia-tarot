import { getRandomSpread, type DrawnCard } from '../data/tarotDeck';
import { GeminiService } from '../services/GeminiService';
import { SettingsModal } from './SettingsModal';
import { getCurrentWindow } from '@tauri-apps/api/window';

export class TarotWidget {
  private root: HTMLElement;
  private cards: DrawnCard[] = [];
  private flippedIndices: Set<number> = new Set();
  private settingsModal: SettingsModal;
  private isGenerating: boolean = false;

  constructor(rootElement: HTMLElement) {
    this.root = rootElement;
    this.settingsModal = new SettingsModal();
    this.init();
  }

  private init() {
    this.root.className = 'widget-root';
    this.root.setAttribute('data-tauri-drag-region', '');
    
    // Explicit window dragging fallback for empty root space
    this.root.addEventListener('mousedown', async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === this.root || target.id === 'cardsGrid' || target.classList.contains('tarot-card-slot')) {
        if (e.button !== 0) return;
        try {
          await getCurrentWindow().startDragging();
        } catch (err) {
          console.warn('Root startDragging API error:', err);
        }
      }
    });

    this.drawNewSpread();
  }

  public drawNewSpread() {
    if (this.isGenerating) return;
    this.cards = getRandomSpread(3);
    this.flippedIndices.clear();
    this.render();

    // Trigger visual shuffle animation
    const grid = this.root.querySelector('#cardsGrid') as HTMLElement;
    if (grid) {
      grid.classList.remove('shuffle-anim');
      void grid.offsetWidth; // Force reflow
      grid.classList.add('shuffle-anim');
    }
  }

  private render() {
    this.root.innerHTML = `
      <!-- Floating Header Capsule / Drag Handle -->
      <div class="floating-header-capsule" data-tauri-drag-region>
        <div class="header-title-box">
          <span class="header-icon">🔮</span>
          <span class="header-title">ARCANA • TENEBRIS</span>
        </div>
        <div class="header-actions" data-tauri-drag-region="false">
          <button class="icon-btn" id="btnShuffle" title="洗牌·重塑牌阵 (Reshuffle)">🔀</button>
          <button class="icon-btn" id="btnSettings" title="契约钥匙·API设置 (Settings)">⚙️</button>
          <button class="icon-btn" id="btnHide" title="隐藏至托盘 (Hide to Tray)">_</button>
          <button class="icon-btn" id="btnClose" title="退出占卜微件 (Exit)">✕</button>
        </div>
      </div>

      <!-- Spread Prompt Banner -->
      <div class="floating-status-banner" id="spreadStatus">
        轻触纸牌揭晓命运密契，三牌尽启召唤暗黑学院指引
      </div>

      <!-- Floating 3-Cards Grid -->
      <div class="floating-cards-grid" id="cardsGrid" data-tauri-drag-region>
        ${this.cards.map((item, index) => `
          <div class="tarot-card-slot" data-tauri-drag-region>
            <div class="card-position-label">${item.positionLabel.split(' · ')[0]}</div>
            <div class="tarot-card-scene" data-index="${index}">
              <div class="tarot-card-inner">
                <!-- Face Down / Card Back -->
                <div class="card-face card-face-back">
                  <img src="assets/cards/card_back.svg" alt="Card Back" draggable="false" />
                </div>
                <!-- Face Up / Front -->
                <div class="card-face card-face-front">
                  <img src="assets/${item.card.image}" alt="${item.card.name}" draggable="false" />
                </div>
              </div>
            </div>
            <div class="card-mini-info">
              <div>${item.card.nameCn}</div>
              <div class="card-status-badge ${item.isReversed ? 'reversed' : ''}">
                ${item.isReversed ? '逆位 (Reversed)' : '正位 (Upright)'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Floating Question Input Capsule -->
      <div class="floating-input-capsule" data-tauri-drag-region="false">
        <input 
          type="text" 
          class="question-input" 
          id="questionInput" 
          placeholder="在此敲下心中困惑，或卡壳难题..." 
          autocomplete="off"
        />
        <button class="submit-btn" id="btnSubmit" disabled title="必须翻开三张牌方可召唤解答">🔮</button>
      </div>

      <!-- Floating Interpretation Scroll Area -->
      <div id="interpretationContainer" data-tauri-drag-region="false" style="width: 100%; display: flex; justify-content: center; flex: 1; min-height: 0;"></div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    // Header controls
    const btnShuffle = this.root.querySelector('#btnShuffle') as HTMLButtonElement;
    const btnSettings = this.root.querySelector('#btnSettings') as HTMLButtonElement;
    const btnHide = this.root.querySelector('#btnHide') as HTMLButtonElement;
    const btnClose = this.root.querySelector('#btnClose') as HTMLButtonElement;

    btnShuffle?.addEventListener('click', () => this.drawNewSpread());
    btnSettings?.addEventListener('click', () => this.settingsModal.show());
    
    btnHide?.addEventListener('click', async () => {
      try {
        await getCurrentWindow().hide();
      } catch (e) {
        console.warn('Window hide API error:', e);
      }
    });

    btnClose?.addEventListener('click', async () => {
      try {
        await getCurrentWindow().close();
      } catch (e) {
        console.warn('Window close API error:', e);
      }
    });

    // Explicit window dragging fallback for header capsule
    const headerCapsule = this.root.querySelector('.floating-header-capsule') as HTMLElement;
    headerCapsule?.addEventListener('mousedown', async (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.header-actions')) return;
      if (e.button !== 0) return;
      try {
        await getCurrentWindow().startDragging();
      } catch (err) {
        console.warn('Header startDragging API error:', err);
      }
    });

    // Card flip interactions with drag threshold detection (for Windows/Mac stability)
    const cardScenes = this.root.querySelectorAll('.tarot-card-scene');
    cardScenes.forEach((scene) => {
      let startX = 0;
      let startY = 0;

      scene.addEventListener('mousedown', (e: any) => {
        startX = e.clientX;
        startY = e.clientY;
      });

      scene.addEventListener('mouseup', (e: any) => {
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        // If moved more than 6 pixels, user is dragging window across desktop
        if (dist > 6) return;

        const idx = parseInt(scene.getAttribute('data-index') || '0', 10);
        this.toggleCardFlip(idx, scene as HTMLElement);
      });
    });

    // Submit question
    const btnSubmit = this.root.querySelector('#btnSubmit') as HTMLButtonElement;
    const inputQuestion = this.root.querySelector('#questionInput') as HTMLInputElement;

    const triggerSubmit = () => {
      if (this.flippedIndices.size === 3 && !this.isGenerating) {
        this.startInterpretation(inputQuestion.value.trim());
      }
    };

    let isComposing = false;
    let justEndedComposition = false;

    inputQuestion?.addEventListener('compositionstart', () => {
      isComposing = true;
      justEndedComposition = false;
    });

    inputQuestion?.addEventListener('compositionend', () => {
      isComposing = false;
      justEndedComposition = true;
      setTimeout(() => {
        justEndedComposition = false;
      }, 100);
    });

    btnSubmit?.addEventListener('click', triggerSubmit);
    inputQuestion?.addEventListener('keydown', (e) => {
      if (isComposing || e.isComposing || e.keyCode === 229 || justEndedComposition) {
        return;
      }
      if (e.key === 'Enter') {
        triggerSubmit();
      }
    });
  }

  private toggleCardFlip(index: number, sceneElem: HTMLElement) {
    if (this.isGenerating) return;

    const cardData = this.cards[index];
    if (this.flippedIndices.has(index)) {
      // Unflip
      sceneElem.classList.remove('is-flipped', 'is-reversed');
      this.flippedIndices.delete(index);
    } else {
      // Flip up!
      if (cardData.isReversed) {
        sceneElem.classList.add('is-flipped', 'is-reversed');
      } else {
        sceneElem.classList.add('is-flipped');
      }
      this.flippedIndices.add(index);
    }

    this.updateSpreadState();
  }

  private updateSpreadState() {
    const statusBox = this.root.querySelector('#spreadStatus') as HTMLElement;
    const btnSubmit = this.root.querySelector('#btnSubmit') as HTMLButtonElement;

    if (this.flippedIndices.size === 3) {
      statusBox.innerHTML = `✨ 三牌尽启！请敲下心事，轻击 ✨ 开启暗黑启示`;
      statusBox.style.color = 'var(--ink-red)';
      if (btnSubmit) btnSubmit.disabled = false;
    } else {
      statusBox.innerHTML = `已翻开 ${this.flippedIndices.size} / 3 张，轻触卡牌探索深潜运势`;
      statusBox.style.color = 'var(--ink-primary)';
      if (btnSubmit) btnSubmit.disabled = true;
    }
  }

  private async startInterpretation(question: string) {
    if (this.flippedIndices.size < 3 || this.isGenerating) return;

    this.isGenerating = true;
    const btnSubmit = this.root.querySelector('#btnSubmit') as HTMLButtonElement;
    const inputQuestion = this.root.querySelector('#questionInput') as HTMLInputElement;
    const container = this.root.querySelector('#interpretationContainer') as HTMLElement;

    if (btnSubmit) btnSubmit.disabled = true;
    if (inputQuestion) inputQuestion.disabled = true;

    // Show Candle Loading State inside Floating Interpretation Scroll
    container.innerHTML = `
      <div class="floating-interpretation-scroll">
        <div class="interpretation-header">
          <span>📜 暗黑星夜启示 (INTERPRETATIO)</span>
          <span>⏳ 灵感共鸣...</span>
        </div>
        <div class="interpretation-body">
          <div class="loading-indicator" id="loadingBox">
            <div class="candle-flame"></div>
            <span>正于学院密室深处翻阅密契心迹，凝聚解读流...</span>
          </div>
          <div class="interpretation-text" id="streamTextOutput" style="display: none;"></div>
        </div>
      </div>
    `;

    const loadingBox = container.querySelector('#loadingBox') as HTMLElement;
    const textBox = container.querySelector('#streamTextOutput') as HTMLElement;
    const headerStatus = container.querySelector('.interpretation-header span:last-child') as HTMLElement;

    let fullText = '';

    await GeminiService.interpretSpreadStream(question, this.cards, {
      onStart: () => {
        loadingBox.style.display = 'flex';
        textBox.style.display = 'none';
      },
      onChunk: (chunk: string) => {
        if (loadingBox.style.display !== 'none') {
          loadingBox.style.display = 'none';
          textBox.style.display = 'block';
          headerStatus.textContent = '✒️ 鹅毛笔疾书流淌...';
        }
        fullText += chunk;
        
        // Escape HTML and parse **bold** Markdown
        let safeText = fullText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        safeText = safeText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        safeText = safeText.replace(/\*\*([^*]+)$/, '<strong>$1</strong>');
        
        textBox.innerHTML = safeText;
        
        const scrollElem = container.querySelector('.interpretation-body');
        if (scrollElem) {
          scrollElem.scrollTop = scrollElem.scrollHeight;
        }
      },
      onComplete: () => {
        this.isGenerating = false;
        if (btnSubmit) btnSubmit.disabled = false;
        if (inputQuestion) inputQuestion.disabled = false;
        headerStatus.textContent = '🌟 启示已成 (VERITAS)';
      },
      onError: (errMsg: string) => {
        this.isGenerating = false;
        if (btnSubmit) btnSubmit.disabled = false;
        if (inputQuestion) inputQuestion.disabled = false;
        loadingBox.style.display = 'none';
        textBox.style.display = 'block';
        textBox.style.color = 'var(--ink-red)';
        textBox.textContent = `[占卜通联异常] ${errMsg}`;
        headerStatus.textContent = '⚠️ 契约中断';
      }
    });
  }
}
