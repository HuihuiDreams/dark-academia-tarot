# Dark Academia Tarot 🔮

一个以“暗黑学术（Dark Academia）”为主题的桌面塔罗牌占卜程序。通过 Tauri 构建的无边框、透明悬浮窗，结合 Google Gemini API 提供沉浸式的塔罗牌解读体验。

## ✨ 特性 (Features)

* **暗黑学术美学**：精心设计的哥特式/暗黑学术风格 UI，提供沉浸式体验。
* **桌面悬浮部件**：基于 Tauri v2 构建的无边框、透明背景窗口，支持全局置顶。
* **3D 卡牌交互**：流畅的 CSS 3D 塔罗牌翻转动画。
* **AI 牌阵解读**：集成 Google Gemini API，根据抽出的三张牌提供专属的塔罗运势解读。
* **灵活配置**：内置默认 API Key（自动混淆），同时也支持用户在设置中自定义个人的 Gemini API Key。
* **便捷管理**：支持最小化至系统托盘，并在托盘中快速访问设置、隐藏窗口及重新洗牌等功能，不打扰日常工作。

## 🛠️ 技术栈 (Tech Stack)

* **前端**：HTML, CSS (Vanilla), TypeScript, Vite
* **后端**：Rust, Tauri v2
* **AI 模型**：Google Gemini API (`@google/generative-ai`)
* **测试**：Vitest, Playwright

## 🚀 开发指南 (Development)

### 环境要求 (Prerequisites)
1. [Node.js](https://nodejs.org/) (建议 v18+)
2. [Rust](https://www.rust-lang.org/tools/install) (用于 Tauri)
3. Tauri 相关的系统依赖 (参考 [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

### 安装依赖 (Install Dependencies)
```bash
npm install
```

### 启动开发服务器 (Start Dev Server)
同时启动 Vite 前端和 Tauri 桌面端：
```bash
npm run tauri dev
```
或者使用：
```bash
npx tauri dev
```

> **注意**：本项目包含特殊的环境配置和脚本，如果需要单独修改前端 UI，可以运行 `npm run dev` 在浏览器中预览（但可能缺少 Tauri 的系统 API 支持）。

## 📦 打包构建 (Build)

构建适用于您当前操作系统的可执行文件：
```bash
npm run tauri build
```
或者使用：
```bash
npx tauri build
```
构建产物将位于 `src-tauri/target/release/bundle/` 目录下。

## 🧪 测试 (Testing)

运行单元测试：
```bash
npm run test
```
以 watch 模式运行测试：
```bash
npm run test:watch
```

## 📝 架构简述 (Architecture)

* **Rust/Tauri 后端** (`src-tauri/src/`)：负责应用生命周期管理、系统托盘、无边框透明窗口设置、IPC 通信以及 API Key 的解密/混淆。
* **前端生命周期** (`src/main.ts`)：初始化根节点并实例化 `TarotWidget`。
* **UI 组件** (`src/components/`)：
  * `TarotWidget.ts`：管理塔罗牌阵、翻转动画、拖拽区域及结果渲染。
  * `SettingsModal.ts`：管理 API 配置和本地存储。
* **AI 服务** (`src/services/GeminiService.ts`)：处理与 Gemini API 的流式连接、错误恢复及模型降级。

## 📜 许可证 (License)

[MIT License](LICENSE)
