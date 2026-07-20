# ADR-005: 动态系统托盘菜单的双向 IPC 同步机制 (Bidirectional IPC Sync for Dynamic System Tray Menu)

## 状态 (Status)
已接受 (Accepted)

## 日期 (Date)
2026-07-20

## 背景上下文 (Context)
随着微件功能的扩展，我们对系统托盘菜单 (System Tray) 提出了更高的交互需求：
1. **触发前端 UI 状态**：用户希望通过托盘菜单直接唤起“设置 (Settings)”面板或执行“重新洗牌 (Draw New Spread)”，这些具体逻辑完全驻留在 Vite/TypeScript 前端层。
2. **托盘文本动态响应**：用户希望将“显示”和“隐藏”合并为一个动态的 Toggle 菜单项。其文本必须与微件的真实可见状态严格同步（例如：当用户点击应用内的“隐藏”按钮时，托盘菜单的字样必须立即变为“显示 (Show)”）。

正如 [ADR-004](./ADR-004-tauri-v2-system-tray-management.md) 中所述，由于 macOS AppKit 的限制，我们**不能**通过拦截底层原生的托盘左键点击事件（`on_tray_icon_event`）来自定义行为，否则会导致原生下拉菜单彻底失效。
因此，我们必须在保留 Tauri 原生 `Menu` 声明式结构的前提下，实现后端 Rust 进程与前端 Vite 进程间的高频状态同步。

## 决策 (Decision)
为了解决上述问题，我们决定采用**基于 Tauri IPC (Inter-Process Communication) 事件广播的双向同步循环**架构：

1. **后端 -> 前端 (Backend to Frontend)**：
   - 托盘菜单在原生闭包内直接响应用户的菜单项点击 (`on_menu_event`)。
   - 当遇到需要前端处理的业务逻辑时（如“设置”、“洗牌”），Rust 端首先强制拉起窗口 (`app.show()`, `window.set_focus()`) 保证视觉可见性，随后立即通过 `app.emit("open-settings", ())` 广播自定义事件。
   - 前端 `TarotWidget.ts` 初始化时利用 `@tauri-apps/api/event` 的 `listen` 接口捕获该事件，并无缝拉起 DOM 内部的模态框或重置组件状态机。

2. **前端 -> 后端 (Frontend to Backend)**：
   - 在 Rust 的 `setup` 生命周期中，我们克隆目标 `MenuItem` 句柄（如 Toggle 项）。
   - Rust 端注册 IPC 监听器 `app.listen("window-hidden", ...)` 与 `app.listen("window-shown", ...)`。
   - 当前端代码主动触发窗口状态改变（如点击前端的 `#btnHide` 按钮）时，除了调用 `window.hide()`，还必须通过 `emit("window-hidden")` 通知后端。
   - 后端监听到事件后，利用闭包中捕获的 `MenuItem` 句柄，安全且原生地执行 `.set_text("显示 (Show)")`，完成动态文本更新。

## 考虑过的替代方案 (Alternatives Considered)

### 在 Rust 中轮询窗口状态 (Polling Window Visibility)
- **优点**：无需前端介入，后端完全自治。
- **缺点**：轮询浪费 CPU 资源；如果降低轮询频率会导致菜单文本更新延迟，体验撕裂。
- **拒绝原因**：事件驱动架构 (Event-driven) 远优于轮询机制。

### 将所有逻辑移入后端 (Move All State to Backend)
- **优点**：单点控制，不会产生前后端状态不同步。
- **缺点**：严重破坏了原有的微服务架构。洗牌算法、卡牌 DOM 翻转动画以及设置面板的 LocalStorage 数据全部都在前端，让 Rust 后端去强行接管这些 Web 逻辑会导致灾难性的耦合。
- **拒绝原因**：违背架构分层原则，增加维护成本。

## 产生的影响 (Consequences)
- **正面影响**：成功在跨平台环境（特别是 macOS）下实现了一个不仅原汁原味，而且具备完全双向响应式更新的高级系统托盘。
- **正面影响**：前端与后端的责任边界依然极其清晰。Rust 负责 OS 窗口层级的显示、隐藏调度；TypeScript 负责 DOM 节点层级的逻辑流转。
- **负面影响**：开发者在后续新增涉及托盘的 UI 交互时，必须严格遵守“发出状态变更就要触发 `emit` 同步”的纪律（就像我们在单元测试 `TarotWidget.test.ts` 中强制添加的 `expect(emit).toHaveBeenCalledWith` 断言一样），否则会导致托盘文本与实际状态脱节。
