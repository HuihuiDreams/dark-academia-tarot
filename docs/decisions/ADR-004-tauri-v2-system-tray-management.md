# ADR-004: Tauri v2 系统托盘资源管理 (System Tray Resource Management)

## 状态 (Status)
已接受 (Accepted)

## 日期 (Date)
2026-07-18

## 背景上下文 (Context)
在 Tauri v2 中，开发者可以在 `tauri.conf.json` 中配置 `trayIcon` 属性。当存在此配置时，Tauri 运行时会在应用程序启动时自动实例化一个默认的系统托盘图标（内部标识为 `"main"` 或 `"default"`）。

在最初实现系统托盘菜单（需要调用操作系统原生的下拉菜单来执行“显示”和“退出”操作）时，我们曾尝试在 Rust 的 `setup` 闭包中使用 `TrayIconBuilder::with_id("main")` 动态创建托盘图标。这种方式在 macOS 上导致了几个严重的系统级原生 UI 问题：
1. **资源冲突 (Resource Collision)**：手动构建一个与自动生成的托盘具有相同概念标识的托盘图标，会导致产生“僵尸托盘图标”以及不可预知的视觉渲染冲突。
2. **原生菜单被覆盖 (Native Menu Override)**：为托盘附加 `.on_tray_icon_event` 监听器以拦截左键点击时，会导致 macOS 的 `NSStatusItem` 绑定一个自定义的动作选择器 (Action selector)。在 Apple 的 AppKit 架构中，一旦绑定了自定义 Action，系统就会彻底覆盖并禁用原生的 `.menu` 下拉行为，导致托盘菜单根本无法弹出。
3. **Rust 的 Drop 销毁语义 (Rust Drop Semantics)**：通过 `Menu::with_items(app, ...)` 创建的菜单以及动态构建的 `TrayIcon` 都受 Rust 作用域规则的严格限制。如果在 `setup` 闭包结束时它们脱离了作用域且未被全局托管，它们触发的 `Drop` 析构函数会极其激进地销毁底层操作系统的系统资源（操作系统的原生菜单和托盘句柄会被瞬间抹杀）。

## 决策 (Decision)
为了确保系统托盘交互在 Windows 和 macOS 跨平台环境下的绝对稳定性，我们将严格遵守以下开发规约：

1. **避免与自动生成的托盘发生构建冲突**：如果 `tauri.conf.json` 已经定义了包含有效 `iconPath` 的 `trayIcon`，我们**绝对不能**在 `setup` 中使用 `TrayIconBuilder` 手动重复构建托盘图标。相反，必须通过 `app.tray_by_id("main")`（或 `"default"`）直接获取运行时托管的托盘实例。
2. **保留原生的菜单事件传播**：如果我们首要的目标是展示一个原生操作系统的托盘下拉菜单，就**不能**绑定额外的 `.on_tray_icon_event` 拦截器。只要放弃自定义的点击动作拦截，macOS 就会自然地将左键和右键点击委托给绑定的 `Menu`，从而确保原生下拉菜单完美无瑕地弹出。
3. **显式状态托管 (`app.manage`)**：任何动态生成的 UI 组件（例如 `Menu` 菜单对象或必须手动生成的 `TrayIcon`），必须通过 `app.manage(menu)` 将所有权显式转移给应用全局状态管理器。这能防止 Rust 的 `Drop` 检查器在 `setup` 闭包结束时误杀宝贵的操作系统底层资源。
4. **前台窗口唤醒增强**：由于在 macOS 中，当整个应用被隐藏时，单纯的 `window.show()` 往往不足以将应用强制拉回前台。因此，托盘菜单的“显示 (Show)”事件必须编排一套完整的唤醒序列：`app.show()` -> `window.unminimize()` -> `window.show()` -> `window.set_focus()`。

## 考虑过的替代方案 (Alternatives Considered)

### 删除 `tauri.conf.json` 中的 `trayIcon` 配置
- 优点：允许在 Rust 中完全使用 `TrayIconBuilder` 进行手动控制。
- 缺点：需要在 Rust 代码中手动读取图标资源，在各个操作系统之间痛苦地处理路径兼容问题，并且重复了 Tauri 本身就能通过 JSON 优雅解决的配置逻辑。
- 拒绝原因：利用标准的 Tauri JSON 配置不仅极大地减少了模板样板代码，更能有效降低由于路径引发的崩溃风险。

### 使用 `.on_tray_icon_event` 手动触发 `popup_menu`
- 优点：允许在保留右键菜单的同时，自定义左键的点击动作。
- 缺点：彻底绕过了 macOS 的标准菜单行为。在操作系统层面手动模拟原生 UI 行为往往会引发一系列奇怪的回归 Bug（例如：菜单弹出的屏幕坐标错乱，或者点击屏幕其他区域时菜单无法正常收起消失）。
- 拒绝原因：完全依靠操作系统的原生下拉菜单能提供最稳健、最符合用户直觉的体验 (UX)。

## 产生的影响 (Consequences)
- **正面影响**：我们在不依赖任何脏乱的 Workaround 或手动弹出机制的情况下，彻底根除了 macOS 托盘菜单的恶性 Bug。现在的托盘表现得和任何顶级的苹果/Windows 原生应用毫无二致。
- **正面影响**：切断了潜在的内存泄漏与操作系统资源空指针问题，确保应用在热重载或休眠唤醒时更加优雅。
- **负面影响**：团队开发者必须极其小心地记住这个暗坑——绝不能将 `tauri.conf.json` 的 `trayIcon` 属性与 Rust 侧的 `TrayIconBuilder` 逻辑混用。鉴于其隐蔽性，我们已通过本 ADR 进行了极其详尽的文档沉淀。
