# ADR-003: 卡牌图鉴单点真实源 (Single Source of Truth) 与资产同步管线

## Status
Accepted

## Date
2026-07-18

## Context
本项目作为一款塔罗牌占卜应用，核心基础架构高度依赖卡牌数据的完整性与多维含义表达。每张大阿卡纳卡牌（Major Arcana）不但拥有基础的正位/逆位释义，还需要具备专为程序风格定制的“占星与心理原型 (`archetype`)”以及“古典暗黑学院解说 (`darkAcademiaInsight`)”，并与实体物理图片资产进行一对比对。
如果将卡牌信息分散在前端 UI 组件、AI 提示词拼装代码或者配置文件中，随着卡牌牌组的扩充（如未来加入小阿卡纳 56 张牌），极大可能导致数据不一致、卡牌图片路径缺失或解读字段错位。

## Decision
我们决定确立 **`src/data/tarotDeck.ts` 作为塔罗卡牌体系的唯一真实数据源 (Single Source of Truth)**，并确立明确的资产映射与校验准则：

### 1. 严格的数据模型接口 (`TarotCard`)
在 `tarotDeck.ts` 中明确定义强类型接口规范，所有卡牌必须具备完整字段：
```typescript
export interface TarotCard {
  id: string;                  // 唯一标识如 '0_fool', '1_magician'
  name: string;                // 英文全称如 'The Fool'
  nameCn: string;              // 中文名称如 '愚人'
  roman: string;               // 罗马数字序号如 '0', 'I', 'II'
  symbol: string;              // 占星或神秘学炼金符号如 '☿', '🜂'
  archetype: string;           // 心理原型如 'Leap of Faith / Spontaneity'
  image: string;               // 对应资源相对路径如 'cards/0_fool.svg'
  uprightMeaning: string;      // 基础正位解读
  reversedMeaning: string;     // 基础逆位解读
  darkAcademiaInsight: string; // 暗黑学院派深度心境洞察
}
```

### 2. 物理资产同步规范
- 卡牌图像统一存放于 `public/assets/cards/` (开发阶段被 Vite 处理并映射为可访问的 `assets/cards/...`)。
- `tarotDeck.ts` 中的 `image` 字段必须严格匹配物理 SVG 或 WebP 文件名称。
- 可以利用 `scripts/generate_assets.mjs` 等辅助工具自动化生成卡牌占位或批量清洗图像，严禁手动引入未声明或不存在的非法路径。

### 3. 抽牌与牌阵生成逻辑统一收敛
所有抽牌洗牌逻辑统一在 `tarotDeck.ts` 的 `getRandomSpread(count: number)` 方法中封装：
- 采用 Fisher-Yates 随机打乱算法确保等概率分布。
- 随机判定每张牌的正位（`isReversed: false`）与逆位（`isReversed: true`）属性（对半概率）。
- 自动绑定标准牌阵位置标签（如 `过去·执念之根` / `当下·迷雾困境` / `通途·密契指引`）。

## Alternatives Considered

### JSON 静态数据文件 (`tarotDeck.json`)
- **优点**：数据与代码解耦，易于跨语言读取或外部脚本直接编辑。
- **缺点**：无法直接享受 TypeScript 编译期的严格属性检查与方法提示，且 Vite 打包引入 JSON 需要多一层对象解析或类型强制断言。
- **放弃原因**：TypeScript 模块 (`MAJOR_ARCANA` 导出数组) 在开发期既能进行绝对类型安全约束，又支持 IDE 的即时重构与跳转，开发体验更佳。

## Consequences
- **正向收益**：无论是前端 `TarotWidget.ts` 渲染卡面，还是 `GeminiService.ts` 构建给 AI 提示词中的深度背景信息，全链路统一从 `DrawnCard` 和 `tarotDeck.ts` 获取数据，实现了绝对的单点维护与扩展安全性。
- **约束要求**：新加入卡牌或定制特殊塔罗套组时，必须同时更新 `MAJOR_ARCANA` 数据数组与 `public/assets/cards/` 物理图像列表。
