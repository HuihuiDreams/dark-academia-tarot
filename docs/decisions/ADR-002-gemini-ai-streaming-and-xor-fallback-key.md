# ADR-002: Gemini AI 流式响应、多模型自动降级与 XOR 混淆密钥双模策略

## Status
Accepted

## Date
2026-07-18

## Context
本程序需要结合用户随机抽取的 3 张塔罗牌（正逆位、牌面寓意、占星原型）与用户在文本框输入的当前困惑/卡壳难题，生成极具深度与情绪疗愈价值的“暗黑学院派导师（Dark Academia Mentor）”解读。
在实现过程中，我们面临三个主要技术挑战：
1. **生成延迟与交互体验**：大语言模型生成长篇古典美学文字（350~500字）耗时较长，如果采用同步阻塞等待，界面会出现长时间假死，严重影响神秘占卜的流淌感。
2. **多模型兼容性与内部思考链干扰**：新一代 Gemini 模型（如 `gemini-2.0-flash`）可能会返回带有思考过程（Reasoning / Thought chain）的 chunk 块 (`part.thought === true`)；且单一模型在特定区域或时段可能会遇到限流或不可达。
3. **API Key 密钥管理与安全泄露风险**：程序需要为用户提供“开箱即用”的内置免费体验，同时允许进阶用户填入私人专属 API Key。如果直接将默认免费 API Key 以明文形式（`AIzaSy...`）硬编码在 TypeScript/JavaScript 或 Rust 中，一旦推送到 GitHub，会被 GitHub Secret Scanning 等安全扫描工具检测并立即吊销。

## Decision
针对上述挑战，我们决定采用以下整体策略：

### 1. 采用官方 `@google/generative-ai` SDK 进行异步流式处理 (`generateContentStream`)
在 `GeminiService.interpretSpreadStream` 中通过 `stream` 迭代器即时把每一个文字 Chunk 推送至回调函数 `callbacks.onChunk`，实现打字机般的流畅占卜文字浮现效果。

### 2. 严格剔除模型思考过程并建立多模型候选降级链 (`MODELS_TO_TRY`)
- **自动尝试策略**：按照优先级 `['gemini-2.0-flash', 'gemma-4-31b-it', 'gemini-flash-latest']` 依次发起请求；若前置模型遇到网络或报错，自动 catch 并尝试下一候选模型。
- **思考块（Thought Part）过滤**：在遍历 `chunk?.candidates?.[0]?.content?.parts` 时，严格执行 `if ((part as any).thought === true) continue;`，确保呈现在界面的仅为最终给用户的主体占卜指引，不泄露中间思维链路。

### 3. XOR 字节混淆内置密钥与双模引擎配置 (`SettingsModal`)
- **双模架构 (`EngineMode`)**：用户在右上角设置弹窗中可自由切换 `builtin`（内置免费版）或 `custom`（私人定制版）。私人密钥安全存放在浏览器安全隔离的 `localStorage` 中。
- **XOR 密钥保护 (`DEFAULT_GEMINI_KEY_XOR`)**：内置密钥不再以字符串形式出现在代码仓库。而是在后端 `src-tauri/src/lib.rs` 中存放通过单字节 `0x5A` 进行 XOR 运算后的 `u8` 字节数组：
  ```rust
  const XOR_SECRET: u8 = 0x5A;
  const DEFAULT_GEMINI_KEY_XOR: &[u8] = &[ ... ];
  ```
- **安全解密指令 (`get_fallback_api_key`)**：仅当用户处于 `builtin` 模式或未配置定制密钥时，前端通过 Tauri 原生 IPC 调用 `invoke<string>('get_fallback_api_key')` 动态在后端解密还原并传递给内存中实例化 SDK。

## Alternatives Considered

### 搭建远程服务端代理转发 API 请求
- **优点**：能够彻底隐藏 API Key，对请求频次和计费统一管控。
- **缺点**：引入了额外的服务器部署成本（VPS/Serverless）和运维复杂度，对于一款开源独立桌面客户端项目违背了无后端的轻量化原则。
- **放弃原因**：采用 XOR 混淆 + 客户端直接调用在开发成本和安全性之间取得了理想平衡。

### 仅允许用户手工填写 Custom Key，不提供内置版
- **优点**：完全避免 API 额度消耗和密钥泄露风险。
- **缺点**：对于普通非开发者用户门槛过高，首次体验极其糟糕。
- **放弃原因**：内置免费版对于呈现项目的即时可玩性至关重要。

## Consequences
- **正向收益**：彻底规避了 GitHub 自动化扫描吊销免费测试密钥的问题；流式输出 + 多模型降级保障了解读输出的高可用性与沉浸感；双模设置让进阶开发者能自由解锁更高并发或特定模型。
- **后续维护要求**：若未来更新或轮换内置免费 Key，需在本地通过 Node.js 一行脚本计算出新的 XOR 数组后再粘贴至 `src-tauri/src/lib.rs`。
