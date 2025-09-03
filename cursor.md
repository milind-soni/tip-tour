## TipTour Workflow MVP Plan
### What we shipped (summary)
- Core TipTour improvements: translate3d transforms, 60fps updates, RAF pause on hide/tab-visibility, edge-aware positioning, device-pixel rounding, content sanitization, input autofocus on show.
- Workflow layer: `createRecorder`, `createPlayer`, `validateWorkflow`, storage helpers; step types (message/click/input/waitFor/navigate); guide/auto modes; optional input UI in player.
- Demo pages: examples/workflow.html and landing wired to workflow player.
- Build: named exports; ES/UMD + types.

### Notable defaults and knobs
- `smoothRadius` tightened (demo uses 2-12) for closer follow to pointer.
- Player option `includeInputUI` shows a TipTour input while guiding.
- Simple “type to focus” pattern is possible via page-level keydown (optional).


### Overview
- **Goal**: Enable recording, saving (JSON), and replaying browser workflows with TipTour overlays for guidance and optional auto-execution for safe actions.
- **Audience**: Product teams (onboarding, tours), support/success (guided resolutions), ops (repeatable tasks).

### Deliverables (MVP)
- **Recorder**: Capture clicks, inputs, waits, and navigations into a JSON workflow.
- **Player**: Guide mode (human performs) and auto mode (runtime performs safe actions).
- **Storage**: Import/export JSON and localStorage persistence.
- **TipTour Integration**: Messages, arrows to targets, step navigation.
- **Public API + Types**: Simple endpoints to record/play and validate.
- **Docs + Demo**: How to record, edit, save, and replay.

### Architecture
- **Workflow JSON**: Versioned spec describing steps, selectors, payloads, UI hints, and permissions.
- **ElementSelector Utility**: Builds stable selectors using heuristics (ids, data-*, roles, text), with fallbacks.
- **WorkflowRecorder**: Listens for user actions, builds steps, and annotates with selectors and UI.
- **WorkflowPlayer**: Executes steps and orchestrates TipTour overlays, timeouts, retries, and events.
- **Storage Adapters**: localStorage namespace and file download/upload.
- **Validation**: Runtime schema checks and TS types.

### Workflow JSON (high-level sketch)
```json
{
  "version": "1.0",
  "id": "signup-flow",
  "name": "Signup Flow",
  "metadata": { "createdAt": "2025-01-01T00:00:00Z" },
  "vars": { "email": "" },
  "steps": [
    { "id": "s1", "type": "message", "ui": { "content": "Click Sign up", "arrow": ["#signup"] } },
    { "id": "s2", "type": "click", "selector": { "css": "#signup" } },
    { "id": "s3", "type": "input", "selector": { "css": "input[name=email]" }, "payload": { "value": "${email}" } },
    { "id": "s4", "type": "waitFor", "selector": { "css": ".welcome" }, "timeout": 15000 }
  ]
}
```

### Step Types (MVP)
- **message**: Show TipTour content; optional arrow targets.
- **click**: Click an element (auto mode) or wait for user to click it (guide mode).
- **input**: Type a value (templated via `${var}`) or ask the user.
- **waitFor**: Wait until selector appears/enabled/visible.
- **navigate**: Go to a URL (same-tab by default).
- **custom (later)**: Call a user-provided function.

### Selector Strategy
- Prefer stable attributes: `id`, `data-testid`, `data-qa`, `role`, name.
- Fallbacks: text content (with contains), nth-of-type paths, proximity hints.
- Store multiple candidates with confidence scores; match live DOM with similarity.

### Player Modes
- **Guide**: Show TipTour with instructions; await human action; arrow points to target.
- **Auto**: Perform actions (click/type). Requires step-level permissions and global enable flag.

### Public API (draft)
```ts
type Recorder = { start(): void; stop(): void; getWorkflow(): Workflow };
type Player = {
  play(opts?: { fromStepId?: string }): Promise<void>;
  pause(): void; stop(): void;
  stepNext(): void; stepPrev(): void;
  on(event: string, cb: (...args: any[]) => void): void; off(event: string, cb: (...args: any[]) => void): void;
};

export function createRecorder(options?: { onEvent?: (evt: any) => void }): Recorder;
export function createPlayer(workflow: Workflow, options?: PlayerOptions): Player;
export function validate(workflow: unknown): { ok: boolean; errors?: string[] };
```

### Events (examples)
- `player:start`, `player:end`, `player:error`
- `step:start`, `step:success`, `step:timeout`, `step:retry`
- `recorder:event` (raw DOM capture), `recorder:step`

### Guardrails (auto mode)
- Domain allowlist; per-step `allowAuto: boolean`.
- Restricted selectors (block wildcards, iframes by default).
- Dry-run mode and confirmation prompts.

### Analytics Hooks
- Callback interface for events; consumer can log to their system.

### Demo Plan
- Page to: start/stop recording, view steps, edit, save/load JSON, and replay in guide/auto.
- Include variable prompts and templating.

### Milestones
1) Define workflow JSON schema and versioning (validation + TS types).
2) Build ElementSelector utility for stable selectors and matching.
3) Implement WorkflowRecorder (click/input/wait/navigate) with minimal overlay.
4) Implement WorkflowPlayer (handlers + TipTour integration + events).
5) Storage adapters (localStorage + download/upload).
6) Public API surface in `src/index.ts`.
7) Demo page (record, edit, save, replay).
8) Guardrails for auto actions (confirmations, dry-run).
9) Docs (usage, JSON spec, integration examples).

### Out of Scope (post-MVP)
- Cross-page multi-domain workflows, iframe traversal, visual diff selector healing, and cloud sync.



### Future plans
- Accessibility
  - Add aria-live (polite/assertive) with role="status"/"alert" on tooltip message; aria-atomic.
  - Label input (aria-label) and hide decorative arrow (aria-hidden).
- Mobile/touch
  - Pointer events: pointerdown to show/update, pointerup to schedule hide.
  - Touch-aware offsets and optional tap-to-pin mode; follow element mode.
- Positioning/containers
  - Anchor/follow modes: 'cursor' | 'element'; container-relative boundaries and smart flip/shift.
  - Scroll-into-view for targets (guarded), with gentle highlight pulse.
- Performance
  - Continue single RAF; passive listeners; cache tooltip size and target geometry with RO/IO invalidation.
  - Device-pixel rounding and reduced work under prefers-reduced-motion.
- Arrow UX
  - Distance-based easing for rotate/scale; hide when target offscreen.
- API ergonomics
  - Player accepts an existing TipTour instance (avoid double tooltips when embedding).
  - Presets for behavior (snappy/smooth/floaty) mapping to friction/radius.
- Workflow layer
  - Stronger selector heuristics and fallback matching; assertions and per-step UI (next/prev/skip).
  - Guardrails: domain allowlist, dry-run, step confirmations; richer analytics hooks.
  - Export/import editor UI and schema docs; browser extension/bookmarklet to run/play.
  - Auto mode hardening (retries, safe timeouts) and variable prompts.
- Docs and examples
  - Expanded README with a11y/touch patterns and full workflow spec.
  - Minimal framework examples (React/Vue/Svelte) and SPA route-change handling.

