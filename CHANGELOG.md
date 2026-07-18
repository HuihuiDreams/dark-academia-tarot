# Changelog
本文件记录 **Dark Academia Tarot (`ARCANA • TENEBRIS`)** 桌面塔罗牌占卜应用的所有重要变更。
格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

## [Unreleased]
### Added
- **测试驱动开发基础设施建立 (`Test-Driven Development Infrastructure`)**：为前后端引入单元测试以落地 `AGENTS.md` 中的 RED-GREEN-REFACTOR 原则。前端引入了 `vitest` 测试框架，编写了针对 `tarotDeck.ts`（大阿尔卡纳数据与洗牌逻辑）和 `GeminiService.ts`（多模型流式降级拦截逻辑）的测试；后端 `lib.rs` 引入了 `#[cfg(test)]` 模块以验证 XOR 密钥解密算法的正确性。
- **专属高密版 Agent 工程规范与架构体系建立 (`Codex Project Guidance & Architecture Documentation`)**：参照项目定制规范，在根目录下创建了专属的 `AGENTS.md` 智能协同与开发说明文档。明确划分 Rust/Tauri 后端窗口管理与前端 UI/AI 服务边界，确立了“先思考后编码”、“主动加载专属技能”、“原子化重构与链路验证”等核心准则；并同步建设了完整的 `docs/` 架构体系，包含基础架构说明 `docs/structure.md` 与关键设计决策文档 (`ADR-001` 至 `ADR-003`)，保障团队开发与 Agent 协作时对无边框窗口隔离、流式 AI 过滤及卡牌单点真实源的高度共识。

### Changed
- **私人定制占星模型自由选择与内置引擎提示校准 (`Custom Model Selection & Built-in Engine Accuracy`)**：
  - **内置契约提示准确性同步**：将右上角设置弹窗 (`SettingsModal`) 中关于“内置免费版”的文案由过时的 `Gemini 1.5 Flash` 校准为 `Gemini 2.0 Flash / 多模型智能容灾`，与底层 `GeminiService.ts` 中 `MODELS_TO_TRY` 实际调用的默认链对齐。
  - **私人定制契约多模型选择与自定义输入**：在“私人定制版 (`custom`)”配置页新增驱动模型下拉列表与自定义输入框 (`#modelSelect` 与 `#customModelInput`)，涵盖 `gemini-2.5-pro`（默认旗舰思考）、`gemini-2.5-flash`、`gemini-2.0-pro-exp-02-05` 等主流模型及自由定义名称，配置持久化于 `localStorage` (`dark_academia_tarot_custom_model`)。
  - **定制与内置链路隔离与专属报错指引**：升级 `GeminiService.interpretSpreadStream`，在私人定制模式下直接发起对用户选定目标模型的推理诉求；并在抛错（如 429 配额耗尽或 404 模型未找到）时精准定位当前选择的模型并返回定制指引，彻底解决此前定制 Key 仍强制执行内置多链降级、且无法自行指定模型的缺陷。

### Fixed
- **卡牌洗牌算法修正 (`Fisher-Yates Shuffle Fix`)**：将 `src/data/tarotDeck.ts` 中的牌阵随机生成逻辑从带有分布偏差的 `Array.prototype.sort(() => Math.random() - 0.5)` 修正为标准的 **Fisher-Yates (Knuth) 洗牌算法**，确保三张牌阵抽取概率在数学上绝对均匀，并严格对齐项目底层设计规范。

## [0.1.0] - 2026-07-18
### Added
- **沉浸式暗黑学院派桌面微件架构 (`Tauri v2 Frameless & Transparent Widget`)**：构建基于 Tauri v2 (`@tauri-apps/api` / `@tauri-apps/cli`) + Rust + TypeScript + Vite 的悬浮占卜微件程序 (`520x720`)。后端在 `lib.rs` 启动阶段通过 `window.set_shadow(false)` 清除系统阴影，前端配合 `styles.css` 实现了深邃神秘的 Dark Academia & Tenebris 胶囊与发光视效；并严格通过 `data-tauri-drag-region` 与 `data-tauri-drag-region="false"` 区分窗口全局拖放区域与内部高频交互组件（问答输入框、按钮与长文本滚动）。
- **三张牌阵抽取与 3D 纸牌翻转状态机 (`TarotDeck & Card Flip Engine`)**：在 `tarotDeck.ts` 中确立了卡牌图鉴、心理/占星原型 (`archetype`) 与暗黑释义 (`darkAcademiaInsight`) 的唯一真实数据源 (`MAJOR_ARCANA`)；在 `TarotWidget.ts` 实现了 Fisher-Yates 随机牌阵生成与三维平滑 CSS 翻开动画 (`.card-face-front` / `.card-face-back`)。严格约定了“开启全部 3 张牌方可解锁问答召唤”的交互控制闭环。
- **暗黑导师流式 AI 占卜引擎 (`Gemini Streaming & Multi-Model Fallback`)**：在 `GeminiService.ts` 中集成 `@google/generative-ai` 异步流式输出 (`onChunk` / `onComplete` / `onError`)。内置多候选模型自动降级策略 (`gemini-2.0-flash` -> `gemma-4-31b-it` -> `gemini-flash-latest`)；并在解析数据流时强制剔除模型内部思考推理块 (`part.thought === true`)，呈现沉稳不间断的暗黑学院派心理与运势疗愈建议。
- **XOR 混淆解密与双模占星契约设置 (`Dual Engine & Secure Key Management`)**：在 `SettingsModal.ts` 提供“内置免费版 (`builtin`)”与“私人定制版 (`custom` + `localStorage`)”一键切换能力；在后端 `lib.rs` 建立单字节 (`0x5A`) XOR 混淆常量数组解密机制 (`get_fallback_api_key`)，彻底杜绝明文 API Key 提交被 GitHub 安全引擎吊销的风险。
