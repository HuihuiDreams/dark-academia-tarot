# Dark Academia Tarot Agent Instructions

These instructions apply to this repository. Keep `.geminirules` in place for
Gemini-based tooling; this `AGENTS.md` is the Codex-readable project guidance.

Always follow these rules when editing, debugging, reviewing, or planning work
in this project.

## Core Principles

1. Think first: surface assumptions and trade-offs before coding. Ask questions
   when divination logic, prompt engineering wording, or UI scaling behavior is unclear. Prefer simpler
   paths when they satisfy the requirement.
2. Use skills first: Before performing tasks like UI engineering, writing
   documentation, or debugging, you MUST proactively review the available agent
   skills in your context and load the relevant skill instructions via `view_file` first:
   - `debugging-and-error-recovery`: Load when investigating crashes, AI stream interruptions, or Tauri/OS-specific window anomalies.
   - `frontend-ui-engineering`: Load when modifying Dark Academia vanilla CSS, transparent window styling, or interactive tarot card flip animations.
   - `code-review-and-quality`: Load before completing PRs, release branches, or multi-file refactoring.
   - `documentation-and-adrs`: Load when making architectural decisions or creating ADRs.
   - `test-driven-development`: Load when implementing new logic, fixing bugs, or modifying behavior to follow the RED-GREEN-REFACTOR cycle and write tests first.
3. Keep changes simple: write the minimum code needed. Avoid speculative
   abstractions and premature object-oriented registry structures.
4. Make surgical edits: modify only the lines needed. Match the existing style
   with TypeScript, vanilla CSS, and Tauri v2 patterns. Remove orphaned code created by
   your edits, and do not touch unrelated code.
5. Goal-Driven Execution & Chain Verification: When executing multi-step tasks or `/goal` requests:
   - Solve exactly ONE issue or task at a time.
   - After each atomic fix, verify and test the functionality (e.g. running `npm run build` or `npm run tauri dev`), and check if any documentation needs updating.
   - Never batch multiple tasks without completing the verification loop for each step.
6. Test-Driven Development (TDD): When adding logic or fixing bugs, follow the RED-GREEN-REFACTOR cycle. Write a failing test first, make it pass with minimal code, then refactor. For bug fixes, always write a reproduction test (Prove-It Pattern) before implementing the fix.

## Architecture Boundaries

1. Rust/Tauri Backend (`src-tauri/src/lib.rs`, `src-tauri/src/main.rs`): owns Tauri application initialization, frameless transparent window setup (`transparent: true`, `decorations: false`, `alwaysOnTop: true`, shadow suppression via `window.set_shadow(false)`), IPC handlers (`get_fallback_api_key`), XOR key decryption/obfuscation (`DEFAULT_GEMINI_KEY_XOR`), and native capabilities. Never expose unencrypted raw API keys in Rust source or client code.
2. Frontend Entry & Lifecycle (`src/main.ts`, `index.html`): initializes the root container `#app` and instantiates `TarotWidget`.
3. UI & Widget Controller (`src/components/`):
   - `TarotWidget.ts`: owns the 3-card spread grid (`cardsGrid`), card flipping state machine (`flippedIndices`), window drag regions (`data-tauri-drag-region`), question input capsule (`#questionInput`), status banner, and interpretation rendering (`#interpretationContainer`).
   - `SettingsModal.ts`: owns the API configuration modal, mode switching (`builtin` free XOR key vs `custom` user API key), key storage (`localStorage`), and drag isolation (`data-tauri-drag-region="false"`).
4. AI Interpretation Service (`src/services/GeminiService.ts`): manages streaming connections to Google Gemini (`@google/generative-ai`), fallback key retrieval via Tauri IPC `invoke('get_fallback_api_key')`, stream callbacks (`onChunk`, `onComplete`, `onError`), filtering out model internal reasoning/thinking (`part.thought === true`), candidate model fallbacks (`gemini-2.0-flash`, `gemma-4-31b-it`, `gemini-flash-latest`), and enforcing the Dark Academia (`Dark Academia Mentor`) system prompt.

## Runtime Constraints & Window Behavior

1. Tauri Frameless & Transparent Window Management (`tauri.conf.json`, `styles.css`): The widget runs as a floating, transparent, always-on-top desktop window (`520x720`). When adding or modifying HTML elements:
   - Ensure drag regions (`data-tauri-drag-region`) are explicitly assigned to background headers/containers so users can reposition the window smoothly across displays.
   - Mark interactive controls, buttons (`.icon-btn`, `.submit-btn`), text inputs (`#questionInput`), modals (`.modal-dialog`), and scrollable content containers (`#interpretationContainer`) with `data-tauri-drag-region="false"` so Tauri does not swallow mouse clicks, text selection, or scroll events.
2. AI Streaming & Error Recovery (`GeminiService.ts`):
   - Never let API errors, network interruptions, or missing keys crash the widget application loop. Always catch exceptions and invoke `callbacks.onError` with clear, user-friendly guidance in Chinese.
   - Ensure `GeminiService.interpretSpreadStream` gracefully falls back across candidate models (`MODELS_TO_TRY`) and strictly strips internal model thinking chunks (`thought: true`) before passing text to `onChunk`.
   - During active stream generation (`isGenerating = true`), prevent concurrent requests or state races by disabling `drawNewSpread` and card submission button triggers.
3. Card Spread & Interaction State Machine (`TarotWidget.ts`):
   - Users must reveal all 3 cards (`flippedIndices.size === cards.length`) before the submit button (`#btnSubmit`) becomes enabled to summon interpretation.
   - When drawing a new spread (`drawNewSpread()`), clear `flippedIndices`, reset `#interpretationContainer`, and restore card slots to their initial clean state.

## Asset Pipeline & Tarot Deck System (`src/assets/`, `src/data/tarotDeck.ts`)

1. Tarot Card Data Integrity (`src/data/tarotDeck.ts`): `tarotDeck.ts` serves as the single source of truth for the tarot card definitions (`MAJOR_ARCANA`). When adding, modifying, or expanding cards, strictly conform to the `TarotCard` interface (`id`, `name`, `nameCn`, `roman`, `symbol`, `archetype`, `image`, `uprightMeaning`, `reversedMeaning`, `darkAcademiaInsight`).
2. Asset Synchronization: Card image paths (e.g. `cards/card_back.svg`, `cards/0_fool.svg`) must exactly match the physical assets stored in `public/assets/cards/` (or generated via `scripts/generate_assets.mjs`). Do not reference missing files or mismatched filenames.
3. Dark Academia Aesthetics (`src/styles.css`): Maintain the curated Dark Academia & Tenebris UI styling—gothic palettes, subtle glows, glassmorphism/floating capsules, and smooth 3D CSS card flip transitions (`.tarot-card-inner`, `.card-face-front`, `.card-face-back`). Avoid generic UI templates or jarring color schemes.

## Documentation And Versioning

Before commit or push:

1. Update `CHANGELOG.md` (when versioning releases): Group changes under exact English headings `Added`, `Changed`, `Fixed`, or `Removed`. Keep user-facing descriptions clear and well-structured.
2. Update documentation when behavior changes: Keep `docs/` and architectural comments synchronized with runtime behavior or Tauri configuration changes.
3. Use atomic commits with this message shape:

   ```text
   <type>: <short description>

   <body explaining why>
   ```

4. Build & Type Verification: Always verify TypeScript and Vite build outputs via `npm run build` (`tsc && vite build`) or test runtime behavior via `npm run tauri dev` before finalizing changes.
