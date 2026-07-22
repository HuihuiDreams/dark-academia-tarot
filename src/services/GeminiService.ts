import { GoogleGenerativeAI } from '@google/generative-ai';
import { invoke } from '@tauri-apps/api/core';
import type { DrawnCard } from '../data/tarotDeck';
import { SettingsModal } from '../components/SettingsModal';

export interface StreamCallbacks {
  onStart?: () => void;
  onChunk: (chunkText: string) => void;
  onComplete: () => void;
  onError: (errorMsg: string) => void;
}

export class GeminiService {
  /**
   * Generates a Dark Academia interpretation stream from Gemini API
   */
  public static async interpretSpreadStream(
    userQuestion: string,
    cards: DrawnCard[],
    callbacks: StreamCallbacks
  ): Promise<void> {
    let apiKey = await SettingsModal.getApiKey();
    const engineMode = await SettingsModal.getEngineMode();

    if (engineMode === 'builtin' || !apiKey) {
      try {
        const fallbackKey = await invoke<string>('get_fallback_api_key');
        if (fallbackKey && fallbackKey.trim()) {
          apiKey = fallbackKey.trim();
        }
      } catch (e) {
        console.warn('[GeminiService] Failed to retrieve fallback key from Tauri IPC:', e);
      }
    }

    if (!apiKey) {
      callbacks.onError('未检测到有效占星契约钥匙。若使用内置免费版，请在后台 lib.rs 中配置解密 Key 数组；或在右上角设置中切换至私人定制版并填入你专属的 Google Gemini API Key。');
      return;
    }

    if (callbacks.onStart) callbacks.onStart();

    const genAI = new GoogleGenerativeAI(apiKey);
    let MODELS_TO_TRY: string[] = [];
    if (engineMode === 'custom') {
      const primaryModel = SettingsModal.getCustomModel() || 'gemini-3.1-pro';
      // 为私人定制版提供后备模型链路，万一首选模型 429 限流，可无缝降级
      MODELS_TO_TRY = Array.from(new Set([primaryModel, 'gemini-3.1-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash']));
    } else {
      MODELS_TO_TRY = ['gemini-3.1-flash-lite', 'gemma-4-31b-it', 'gemini-flash-latest'];
    }

    // Construct rich Dark Academia System & Prompt context
    const spreadInfo = cards.map((item, index) => {
      const stateStr = item.isReversed ? '【逆位 (Reversed)】' : '【正位 (Upright)】';
      const meaning = item.isReversed ? item.card.reversedMeaning : item.card.uprightMeaning;
      return `第${index + 1}位置（${item.positionLabel}）：
卡牌名称：${item.card.name} (${item.card.nameCn}) ${stateStr}
占星与心理原型：${item.card.archetype}
基础寓意：${meaning}
古典学院解说：${item.card.darkAcademiaInsight}`;
    }).join('\n\n---\n\n');

    const systemPrompt = `你是一位栖身于古老牛津/哥特学院图书馆深处的神秘学占星师与心理学导师（Dark Academia Mentor）。你擅长结合荣格心理投射与传统塔罗符号学，帮来访者刺破内心的执念与幻象。
你的文风要求：
1. 具备浓郁的暗黑学院派（Dark Academia）美学、古典哲学与文学质感，言词深邃、沉稳且富有情绪疗愈价值。
2. 严密结合用户抽出的 3 张牌（正逆位与对应卡面寓意），分别解析他们的【执念/过去】、【当下困境/假象】和【通往突破的密契钥匙/未来】。
3. 巧妙融合古典哲学、逻辑思维与神秘学启示，针对来访者的具体问题给出辛辣又温柔的解围意见。注意：保持语境的纯粹性，绝对不要使用任何现代科技、计算机、代码或程序员相关的比喻与术语（除非用户主动提及）。
4. 全文篇幅控制在 350～500 字左右，分段清晰，带有如羽毛笔在古老羊皮纸上书写的仪式感。`;

    const prompt = `${systemPrompt}

【来访者当前心中的困惑/提问】：
"${userQuestion || '此刻心神未定，祈求牌阵给出当下智识与心境的潜意识指引。'}"

【抽出的三张命运牌阵信息】：
${spreadInfo}

请立刻给予来访者深邃、真诚而极具启发性的暗黑学院风心理投射与运势解读：`;

    let lastError: any = null;

    for (let i = 0; i < MODELS_TO_TRY.length; i++) {
      const modelName = MODELS_TO_TRY[i];
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContentStream(prompt);

        for await (const chunk of result.stream) {
          const parts = chunk?.candidates?.[0]?.content?.parts || [];
          let chunkText = '';
          for (const part of parts) {
            // Strictly filter out model's internal thinking / reasoning chain (thought: true)
            if ((part as any).thought === true) {
              continue;
            }
            if (part.text) {
              chunkText += part.text;
            }
          }
          if (chunkText) {
            callbacks.onChunk(chunkText);
          }
        }

        callbacks.onComplete();
        return; // Success! Exit immediately.
      } catch (err: any) {
        console.warn(`[GeminiService] Model ${modelName} failed:`, err?.message || err);
        lastError = err;
        // Try next model if current one hit quota limit (429), not found (404), or high demand (503)
        if (i < MODELS_TO_TRY.length - 1) {
          continue;
        }
      }
    }

    // If all models in the fallback chain failed
    console.error('[Gemini Stream Error All Fallbacks Failed]', lastError);
    const msg = lastError?.message || '未知连接异常';
    if (engineMode === 'custom') {
      const targetModel = MODELS_TO_TRY[0];
      if (msg.includes('429') || msg.includes('Quota exceeded') || msg.includes('RESOURCE_EXHAUSTED')) {
        callbacks.onError(`私人契约模型及后备链路均限流（429 Quota Exceeded，首选模型: ${targetModel}）: 当前 API Key 调用额度已耗尽。请等待恢复，或更换可用额度的 Key。`);
      } else if (msg.includes('404') || msg.includes('not found')) {
        callbacks.onError(`私人契约模型未找到（404 Not Found，首选模型: ${targetModel}）: 当前 API Key 无法访问该模型或模型 ID 有误，且后备模型链路亦未跑通，请重新检查 ⚙️ 设置。`);
      } else {
        callbacks.onError(`私人专属契约通联中缀（API Request Failed，首选模型: ${targetModel} 及后备均失败）: ${msg}`);
      }
    } else {
      if (msg.includes('429') || msg.includes('Quota exceeded') || msg.includes('RESOURCE_EXHAUSTED')) {
        callbacks.onError('深渊通联限流（429 Quota Exceeded）: 当前内置免费星图共鸣过载（该 API Key 下所有可用免费推理模型均已达短时并发上限），请稍静心等待几分钟；或点击右上角 ⚙️ 切换至私人定制版并填入个人专属 Key 以独享专属配额与自定义模型选择。');
      } else {
        callbacks.onError(`深渊通联中缀（API Request Failed）: ${msg}`);
      }
    }
  }
}
