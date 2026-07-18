# Changelog
本文件记录 **Dark Academia Tarot (`ARCANA • TENEBRIS`)** 桌面塔罗牌占卜应用的所有重要变更。
格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

## [Unreleased]
### Added
- **系统托盘与最小化支持 (`System Tray & Window Hide`)**：
  - 在前端微件标题栏新增了“隐藏至托盘 (`btnHide`)”按钮。
  - 在 Tauri 后端 (`lib.rs`) 中引入了 `tauri::tray`，构建了系统托盘应用菜单（支持“显示”与“退出”），并支持鼠标左键单击托盘图标快速唤醒并聚焦主应用窗口。
  - 同步更新了 `AGENTS.md`，明确系统托盘属于运行时约束与后端架构边界的一部分。
- **测试驱动开发基础设施与核心覆盖率提升 (`Test-Driven Development Infrastructure & Coverage`)**：为前后端引入单元测试以落地 `AGENTS.md` 中的 RED-GREEN-REFACTOR 原则。前端基于 `vitest` 与 `@vitest/coverage-v8` 完善了核心 UI 与服务逻辑，将核心覆盖率提升至 87% 以上：深度测试了 `SettingsModal.ts`（双模切换与持久化逻辑）、`TarotWidget.ts`（牌阵状态机与流式渲染防抖），并补全了 `GeminiService.ts`（模型智能降级与 429/404 分类错误拦截）的各项异常处理分支；后端 `lib.rs` 引入了 `#[cfg(test)]` 模块以验证 XOR 密钥解密算法的正确性。
- **专属高密版 Agent 工程规范与架构体系建立 (`Codex Project Guidance & Architecture Documentation`)**：参照项目定制规范，在根目录下创建了专属的 `AGENTS.md` 智能协同与开发说明文档。明确划分 Rust/Tauri 后端窗口管理与前端 UI/AI 服务边界，确立了“先思考后编码”、“主动加载专属技能”、“原子化重构与链路验证”等核心准则；并同步建设了完整的 `docs/` 架构体系，包含基础架构说明 `docs/structure.md` 与关键设计决策文档 (`ADR-001` 至 `ADR-003`)，保障团队开发与 Agent 协作时对无边框窗口隔离、流式 AI 过滤及卡牌单点真实源的高度共识。
- **Agent 行为准则增强：强制测试与文档同步 (`Agent Rule Enhancement: Strict Test & Doc Sync`)**：在 `AGENTS.md` 的 `Core Principles` 中新增第 7 条核心原则。从规则层面强制要求所有 Agent 在执行代码修改时，必须同步检查并更新对应的测试文件以及相关文档（如 `CHANGELOG.md`），彻底解决修改代码后遗漏测试维护的历史遗留“坑点”。

### Changed
- **全面引入 Gemini 3.1 系列模型与重构私人定制容灾链路 (`Gemini 3.1 Integration & Custom Fallback`)**：
  - **内置契约主引擎升级**：将 `GeminiService.ts` 默认回退链首选模型及 `SettingsModal` UI 描述由 `Gemini 2.0 Flash` 全面更新至延迟极低的 `Gemini 3.1 Flash Lite`。同步重构了 `GeminiService.test.ts` 以适配新的主模型断言。
  - **私人定制模型矩阵扩充**：在配置弹窗中加入了 `gemini-3.1-pro` 与 `gemini-3.1-flash` 作为全新的定制旗舰选项。
  - **私人定制专属降级机制**：为解决私人定制模式下指定单一模型遭遇限流 (429) 时占卜直接中断的问题，专门为其构建了独立的多级智能降级链路（首选模型 -> `3.1-flash` -> `3.1-flash-lite` -> `2.5-flash`，自动去重）。并重写了报错抛出文案与测试用例，确保在所有后备均耗尽时能精准透出错误原因。
- **整体羊皮纸与羽毛笔视觉美学重构 (`Parchment & Quill UI Reskin`)**：彻底重构微件视觉表现，从原有的暗黑玻璃态（黑金）转换至极具物理沉浸感的“暗黑学院羊皮纸”风格。
  - **动态背景纹理与陈年墨水排版**：所有的悬浮胶囊、面板和文本流均引入高清无缝羊皮纸纹理 (`parchment_bg.png`)。全局发光字全面转换为带有微弱“洇墨”阴影（`text-shadow`）的深邃墨水色 (`--ink-primary`) 与暗红色 (`--ink-red`)。
  - **水晶球召唤按钮**：右侧的生成交互按钮重塑为带有立体玻璃径向渐变与高光的魔法水晶球 🔮。
  - **自适应悬浮标签**：重写了悬浮提示语与卡牌小标签的 CSS 布局（引入 `flex` 容器与圆角羊皮纸底座），彻底解决在浅色系统壁纸下的对比度灾难及文字高度溢出漏洞。
  - **Markdown 实时渲染强化**：升级 `TarotWidget.ts` 流式接收逻辑，借助安全转义与正则实时捕获流式传输的 Markdown `**` 语法，并替换为专享猩红墨水高亮的加粗标签 (`<strong>`)，实现动态强调视效。
  - **卷轴裁切修复**：废除底部解读卷轴的绝对最大高度，重构为高度动态计算的弹性伸缩架构 (`flex: 1`, `min-height: 0`) 配合底部安全内边距，完美解决文本被操作系统窗口强制裁断、无法滚动至末尾的框架缺陷。
- **私人定制占星模型自由选择与内置引擎提示校准 (`Custom Model Selection & Built-in Engine Accuracy`)**：
  - **内置契约提示准确性同步**：将右上角设置弹窗 (`SettingsModal`) 中关于“内置免费版”的文案由过时的 `Gemini 1.5 Flash` 校准为 `Gemini 2.0 Flash / 多模型智能容灾`，与底层 `GeminiService.ts` 中 `MODELS_TO_TRY` 实际调用的默认链对齐。
  - **私人定制契约多模型选择与自定义输入**：在“私人定制版 (`custom`)”配置页新增驱动模型下拉列表与自定义输入框 (`#modelSelect` 与 `#customModelInput`)，涵盖 `gemini-2.5-pro`（默认旗舰思考）、`gemini-2.5-flash`、`gemini-2.0-pro-exp-02-05` 等主流模型及自由定义名称，配置持久化于 `localStorage` (`dark_academia_tarot_custom_model`)。
  - **定制与内置链路隔离与专属报错指引**：升级 `GeminiService.interpretSpreadStream`，在私人定制模式下直接发起对用户选定目标模型的推理诉求；并在抛错（如 429 配额耗尽或 404 模型未找到）时精准定位当前选择的模型并返回定制指引，彻底解决此前定制 Key 仍强制执行内置多链降级、且无法自行指定模型的缺陷。

### Fixed
- **系统托盘交互与菜单响应修复 (`System Tray Interaction Fix`)**：修复了 macOS/Windows 托盘菜单点击失效的问题。
  - **移除托盘构建冲突**：修正了 Tauri v2 中当 `tauri.conf.json` 已配置 `trayIcon` 时，代码里使用 `TrayIconBuilder` 重复创建托盘图标导致的系统级原生 UI 资源冲突。改为直接获取引擎自动生成的原生托盘 (`app.tray_by_id("main")`) 并挂载菜单，确保菜单事件不再被异常销毁。
  - **前台唤醒增强**：针对 macOS 隐藏窗口后无法拉起的问题，在唤醒逻辑中增补了 `app.show()` 强制激活应用程序前台属性，并引入 `window.unminimize()` 防止因其他状态导致的冲突。
  - **生命周期接管**：通过 `app.manage(menu)` 将托盘菜单对象托付给应用全局状态管理器，避免 Rust 局部变量在 `setup` 结束时触发 `Drop` 导致系统底层 OS 菜单资源被强杀，保证菜单弹出的稳定性。
- **卡牌洗牌算法修正 (`Fisher-Yates Shuffle Fix`)**：将 `src/data/tarotDeck.ts` 中的牌阵随机生成逻辑从带有分布偏差的 `Array.prototype.sort(() => Math.random() - 0.5)` 修正为标准的 **Fisher-Yates (Knuth) 洗牌算法**，确保三张牌阵抽取概率在数学上绝对均匀，并严格对齐项目底层设计规范。
- **主界面控制按钮修复 (`Header Action Buttons Fix`)**：修复了主界面右上角洗牌 (`btnShuffle`) 与隐藏 (`btnHide`) 按钮失效的问题。为 `btnHide` 补充了 Tauri 引擎必须的 `core:window:allow-hide` 窗口操作权限；为 `btnShuffle` 补充了洗牌 CSS 动画 (`shuffle-anim`) 提供重新发牌的视觉反馈，并将根节点拖拽监听器的绑定移至初始化阶段，杜绝了重绘时的事件内存泄漏。

## [0.1.0] - 2026-07-18
### Added
- **沉浸式暗黑学院派桌面微件架构 (`Tauri v2 Frameless & Transparent Widget`)**：构建基于 Tauri v2 (`@tauri-apps/api` / `@tauri-apps/cli`) + Rust + TypeScript + Vite 的悬浮占卜微件程序 (`520x720`)。后端在 `lib.rs` 启动阶段通过 `window.set_shadow(false)` 清除系统阴影，前端配合 `styles.css` 实现了深邃神秘的 Dark Academia & Tenebris 胶囊与发光视效；并严格通过 `data-tauri-drag-region` 与 `data-tauri-drag-region="false"` 区分窗口全局拖放区域与内部高频交互组件（问答输入框、按钮与长文本滚动）。
- **三张牌阵抽取与 3D 纸牌翻转状态机 (`TarotDeck & Card Flip Engine`)**：在 `tarotDeck.ts` 中确立了卡牌图鉴、心理/占星原型 (`archetype`) 与暗黑释义 (`darkAcademiaInsight`) 的唯一真实数据源 (`MAJOR_ARCANA`)；在 `TarotWidget.ts` 实现了 Fisher-Yates 随机牌阵生成与三维平滑 CSS 翻开动画 (`.card-face-front` / `.card-face-back`)。严格约定了“开启全部 3 张牌方可解锁问答召唤”的交互控制闭环。
- **暗黑导师流式 AI 占卜引擎 (`Gemini Streaming & Multi-Model Fallback`)**：在 `GeminiService.ts` 中集成 `@google/generative-ai` 异步流式输出 (`onChunk` / `onComplete` / `onError`)。内置多候选模型自动降级策略 (`gemini-2.0-flash` -> `gemma-4-31b-it` -> `gemini-flash-latest`)；并在解析数据流时强制剔除模型内部思考推理块 (`part.thought === true`)，呈现沉稳不间断的暗黑学院派心理与运势疗愈建议。
- **XOR 混淆解密与双模占星契约设置 (`Dual Engine & Secure Key Management`)**：在 `SettingsModal.ts` 提供“内置免费版 (`builtin`)”与“私人定制版 (`custom` + `localStorage`)”一键切换能力；在后端 `lib.rs` 建立单字节 (`0x5A`) XOR 混淆常量数组解密机制 (`get_fallback_api_key`)，彻底杜绝明文 API Key 提交被 GitHub 安全引擎吊销的风险。
