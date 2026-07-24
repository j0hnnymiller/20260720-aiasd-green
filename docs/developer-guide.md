---
ai_generated: true
model: "anthropic/claude-sonnet-4.6@2026-07-24"
operator: "johnmillerATcodemag-com"
chat_id: "eba7a943-b5f3-493e-8f22-a69a66f5db3c"
prompt: |
  to propose a tech stack for implementing the requirements using CQRS
  capture the ADRs in a document and add the stack to a developer's guide
started: "2026-07-24T12:00:00-07:00"
ended: "2026-07-24T12:30:00-07:00"
task_durations:
  - task: "architecture analysis"
    duration: "00:10:00"
  - task: "developer guide drafting"
    duration: "00:15:00"
  - task: "review and finalization"
    duration: "00:05:00"
total_duration: "00:30:00"
ai_log: "ai-logs/2026/07/24/eba7a943-b5f3-493e-8f22-a69a66f5db3c/conversation.md"
source: ".github/agents/solution-architect.agent.md"
---

# Developer Guide: Web-Based Calculator

## Overview

This guide covers the architecture, tech stack, project structure, and development workflow for the web-based calculator. The calculator is implemented as a pure browser application using CQRS to separate state mutations (commands) from state reads (queries).

For full product requirements, see [docs/web-based-calculator-specification.md](web-based-calculator-specification.md).

For architecture decisions, see the [ADR index](#architecture-decision-records).

---

## Architecture

The application follows CQRS with synchronous in-memory projections. All state lives in a single Redux store. Commands mutate state via slice reducers. Queries are Reselect projections consumed through custom React hooks. UI components interact only with the query layer.

```
User Input
    |
    v
Command Bus (Redux dispatch)
    |
    v
Command Handler (slice reducer)  <-- enforces invariants
    |
    v
Write Store (Redux state)
    |
    v
Read Projections (Reselect)
    |
    v
Query Hooks (React)
    |
    v
UI Components (React)
```

### Commands

Each user action maps to one typed command:

| Command              | Trigger                                             |
| -------------------- | --------------------------------------------------- |
| `EnterDigit`         | Digit button or numeric key                         |
| `EnterDecimal`       | `.` button or `.` key                               |
| `SelectOperator`     | `+`, `-`, `×`, `÷` button or `+`, `-`, `*`, `/` key |
| `EvaluateExpression` | `=` button or `Enter`/`=` key                       |
| `ClearEntry`         | `CE` button or `Delete` key                         |
| `AllClear`           | `AC` button or `Escape` key                         |
| `ToggleSign`         | `+/-` button                                        |
| `EnterPercent`       | `%` button or `%` key                               |

### Write State Shape

```typescript
interface CalculatorState {
  currentEntry: string; // digits being entered
  previousValue: number | null;
  pendingOperator: Operator | null;
  phase: "idle" | "entering" | "evaluated" | "error";
  errorMessage: string | null;
}
```

### Read Projections (Queries)

| Selector                  | Returns                           | Used by                                 |
| ------------------------- | --------------------------------- | --------------------------------------- |
| `selectDisplayValue`      | `string` — value shown in display | `useDisplayValue()` hook                |
| `selectIsError`           | `boolean`                         | `useIsError()` hook                     |
| `selectOperatorIndicator` | `Operator \| null`                | `useOperatorIndicator()` hook           |
| `selectSessionHistory`    | `HistoryEntry[]`                  | `useSessionHistory()` hook (Could Have) |

---

## Tech Stack

### Core

| Concern             | Library / Tool | Version | Notes                                         |
| ------------------- | -------------- | ------- | --------------------------------------------- |
| Language            | TypeScript     | 5.x     | Strict mode; types for all commands and state |
| UI framework        | React          | 19.x    | Hooks-based; no class components              |
| Build tool          | Vite           | 6.x     | Native ESM, fast HMR, static output           |
| State / command bus | Redux Toolkit  | 2.x     | `createSlice`, `configureStore`               |
| Query projections   | Reselect       | 5.x     | `createSelector` for memoized queries         |

### UI and Accessibility

| Concern       | Library / Tool     | Notes                                                  |
| ------------- | ------------------ | ------------------------------------------------------ |
| Styling       | Tailwind CSS v4    | Utility-first; responsive via breakpoint prefixes      |
| Accessibility | React Aria (Adobe) | ARIA live regions, keyboard handling, focus management |
| Icon set      | (none required)    | Calculator labels are text only                        |

### Testing

| Concern             | Library / Tool                        | Notes                                                   |
| ------------------- | ------------------------------------- | ------------------------------------------------------- |
| Unit tests          | Vitest                                | Fast, Vite-native; tests command handlers and selectors |
| Component tests     | React Testing Library                 | Tests UI behaviour against query hooks                  |
| E2E tests           | Playwright                            | Cross-browser; covers all acceptance criteria scenarios |
| Accessibility audit | axe-core (via `@axe-core/playwright`) | Automated WCAG checks in CI                             |

### Developer Tooling

| Concern               | Tool                             | Notes                                                       |
| --------------------- | -------------------------------- | ----------------------------------------------------------- |
| Linting               | ESLint + `eslint-plugin-reduxjs` | Enforces no direct store access in UI components            |
| Formatting            | Prettier                         | Consistent code style                                       |
| Type checking         | `tsc --noEmit`                   | Run in CI alongside tests                                   |
| Dependency management | pnpm                             | Deterministic installs; workspace-ready for future monorepo |

---

## Development Workflow

### Prerequisites

- Node.js 22 LTS or later
- pnpm 9 or later

### Setup

```sh
pnpm install
```

### Run dev server

```sh
pnpm dev
```

Opens at `http://localhost:5173`.

### Run tests

```sh
# Unit and component tests
pnpm test

# E2E tests (requires a running dev server or use --ui)
pnpm test:e2e

# Type check
pnpm typecheck
```

### Build for production

```sh
pnpm build
# Output in dist/ — deploy as static files
```

---

## CQRS Rules for Contributors

These rules enforce the command/query boundary. Violations should be caught by ESLint.

1. **Components dispatch commands only.** A component may call `dispatch(someCommand(...))` but must never read from the store directly via `useSelector`.
2. **Components consume query hooks only.** All read access goes through hooks in `src/queries/hooks.ts`.
3. **Reducers are pure and side-effect-free.** No API calls, timers, or external reads inside a reducer.
4. **Selectors are idempotent.** A selector called with the same state must always return the same result.
5. **Commands are intention-revealing.** Use `EvaluateExpression` not `setResult`; use `AllClear` not `resetState`.

### Calculator Reducer Invariants (Mandatory)

These invariants must remain true across all slices that touch calculator command handlers.

1. **Operator replacement must not evaluate early.**
   When `pendingOperator !== null` and no right-hand operand is committed yet, pressing another operator must only replace `pendingOperator`.
2. **Operator chaining must evaluate exactly once per committed right-hand operand.**
   When a right-hand operand is committed, selecting another operator performs one evaluation and sets the new pending operator.
3. **Clear semantics must preserve deterministic operator behavior.**
   If `ClearEntry` is present, `9 + CE -` must replace `+` with `-` without computing `9 + 0`.

Any command change that can affect these invariants requires reducer tests and UI tests for replacement/chaining behavior.

## Pull Request Checklist

Before requesting review for command-layer changes, confirm all items below.

- [ ] Command/query boundary remains intact.
- [ ] Existing command invariants are listed and revalidated.
- [ ] Transition tests cover changed command interactions, not only happy paths.
- [ ] Interaction regression test added for cross-slice behavior (for example, operator replacement after clear semantics changes).
- [ ] `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass.

---

## Architecture Decision Records

| ADR                                                    | Title                        | Status   |
| ------------------------------------------------------ | ---------------------------- | -------- |
| [ADR-001](adr/adr-001-cqrs-redux-toolkit.md)           | Adopt CQRS via Redux Toolkit | Accepted |
| [ADR-002](adr/adr-002-synchronous-read-projections.md) | Synchronous read projections | Accepted |
| [ADR-003](adr/adr-003-no-backend-v1.md)                | No backend service for V1    | Accepted |

---

## Deployment

The production build (`pnpm build`) produces static files in `dist/`. Deploy to any static host:

- **Azure Static Web Apps** — zero-config for Vite output; add `staticwebapp.config.json` for routing
- **GitHub Pages** — set `base` in `vite.config.ts` if deploying to a subpath
- **Netlify / Vercel** — auto-detected as a Vite project

No server-side runtime is required. See [ADR-003](adr/adr-003-no-backend-v1.md) for rationale.
