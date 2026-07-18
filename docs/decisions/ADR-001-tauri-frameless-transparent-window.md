# ADR-001: 采用 Tauri v2 构建无边框透明置顶桌面微件

## Status
Accepted

## Date
2026-07-18

## Context
项目目标是打造一款沉浸式、暗黑学院派（Dark Academia）美格的桌面塔罗牌占卜程序（ARCANA • TENEBRIS）。作为一款陪伴型与即时占卜型桌面微件，应用界面需要具备以下关键特性：
1. **轻量与高响应**：微件在桌面长期驻留，对内存占用及启动速度有严格要求。
2. **沉浸式无边框与透明悬浮**：必须消除操作系统原生的标题栏、边框以及默认方框背景阴影，呈现出异形或半透明胶囊/卡牌悬浮于桌面的神秘视觉体验。
3. **全局置顶与平滑移动**：用户能够跨屏幕随时查看或拖动占卜微件而不会被普通窗口遮挡。

## Decision
针对上述需求，我们决定：
1. **采用 Tauri v2 (`@tauri-apps/api` v2, `@tauri-apps/cli` v2) + Rust 后端** 作为跨平台桌面应用开发框架。
2. **在 `src-tauri/tauri.conf.json` 中定义窗体基础属性**：
   - `transparent: true`（开启透明背景渲染）
   - `decorations: false`（移除操作系统原生标题栏与边框）
   - `alwaysOnTop: true`（默认保持桌面悬浮置顶）
   - `resizable: false`（固定 `520x720` 比例，保持纸牌比例一致性）
3. **在 Rust 主程序 (`src-tauri/src/lib.rs`) 启动阶段清除系统默认窗口阴影**：
   通过 `window.set_shadow(false)` 防止 macOS 和 Windows 系统对透明窗口产生多余的黑色底框阴影，确保 `styles.css` 中的自定义发光光晕与玻璃拟态效果纯净展现。
4. **前端精细化拖拽区域声明**：
   在 HTML 骨架中明确区分 `data-tauri-drag-region`（头部容器与非交互空隙，用于拖动窗口）与 `data-tauri-drag-region="false"`（按钮 `.icon-btn`、问答输入框 `#questionInput`、解读长文本滚动容器 `#interpretationContainer` 及设置模态弹窗），解决无边框窗口下鼠标事件冲突问题。

## Alternatives Considered

### Electron (配合 Webpack/Vite)
- **优点**：生态成熟，Node.js 原生 API 调用极为便捷。
- **缺点**：Chromium + Node.js 双引擎导致基础内存占用大（通常 150MB+），作为常驻桌面的轻量占卜微件显得过于沉重。
- **放弃原因**：Tauri 打包体积和内存消耗仅为 Electron 的十分之一左右，更适合微件场景。

### 传统带标题栏/标准窗口的 Tauri 应用
- **优点**：开发简单，无需处理自定义拖拽与窗口控制按钮。
- **缺点**：原生窗口边框和白色/默认标题栏会极大地破坏“哥特与暗黑神秘学”的沉浸感。
- **放弃原因**：无法满足项目在 UI 视觉表现力（WOW user experience）上的核心美学指标。

## Consequences
- **正向收益**：应用启动极快，内存占用极低（约 20~30MB）；透明发光胶囊与塔罗卡牌在桌面上具有极高的视觉质感。
- **负向约束/需要注意的事项**：前端任何新增的交互组件或弹窗必须显式标记 `data-tauri-drag-region="false"`，否则会被 Tauri 引擎捕获为窗口拖拽操作而导致无法点击或选词；跨系统（Windows vs macOS）透明窗口表现需保持 CSS 变量一致性。
