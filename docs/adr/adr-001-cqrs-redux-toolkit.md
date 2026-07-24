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
  - task: "ADR drafting"
    duration: "00:15:00"
  - task: "review and finalization"
    duration: "00:05:00"
total_duration: "00:30:00"
ai_log: "ai-logs/2026/07/24/eba7a943-b5f3-493e-8f22-a69a66f5db3c/conversation.md"
source: ".github/agents/solution-architect.agent.md"
---

# ADR-001: Adopt CQRS via Redux Toolkit

## Status

Accepted

## Date

2026-07-24

## Context

The web-based calculator requires a clear mechanism for managing state mutations (user input, operator selection, evaluation) separately from state reads (display rendering, error indication). The CQRS pattern was selected as the governing architecture for this project.

The primary implementation question is which library and conventions to use to realize the CQRS command bus, command handlers, write store, and query layer within a React/TypeScript browser application.

Candidates evaluated:

| Option                 | Command Bus        | Write Store   | Query Layer         | Notes                                                                         |
| ---------------------- | ------------------ | ------------- | ------------------- | ----------------------------------------------------------------------------- |
| Redux Toolkit          | `dispatch`         | Redux state   | Reselect selectors  | Explicit action/reducer model maps directly to CQRS vocabulary                |
| Zustand                | Function calls     | Zustand store | Computed properties | Simpler API; less explicit command/query separation                           |
| XState                 | Events/transitions | Machine state | State selectors     | Strong for state machines; steeper learning curve; best for complex workflows |
| Context + `useReducer` | `dispatch`         | Context state | Derived state       | No external dependency; limited scalability for growing projections           |

## Decision

Use **Redux Toolkit** (`@reduxjs/toolkit`) as the command bus and write store, and **Reselect** (`reselect`) as the query/projection layer.

Mapping:

- `dispatch(action)` = command bus
- Action creators and payload types = typed commands (`EnterDigit`, `SelectOperator`, `EvaluateExpression`, `ClearEntry`, `AllClear`, `ToggleSign`, `EnterDecimal`, `EnterPercent`)
- Slice reducers = command handlers (enforce invariants, transition write state)
- `createSelector` = query projections (`selectDisplayValue`, `selectIsError`, `selectOperatorIndicator`, `selectSessionHistory`)
- Custom React hooks wrapping selectors = query API for UI components

## Consequences

**Benefits**:

- Redux action/reducer model makes the command/query boundary visible, typed, and auditable via Redux DevTools
- Reducers are pure functions — command handlers are deterministic and straightforward to unit-test in isolation
- Reselect projections are memoized, side-effect-free, and independently evolvable from the write model
- Redux middleware can be added later to emit integration events (e.g., session history, analytics) without changing command or query code
- TypeScript support is first-class in Redux Toolkit

**Costs**:

- More boilerplate than Zustand or Context for a domain this simple
- Redux is considered over-engineered for a basic calculator; accepted because this is a reference CQRS implementation

**Constraints**:

- UI components must not access the Redux store directly; they must consume query hooks only
- Command handlers (reducers) must never perform side effects or queries

## Related ADRs

- [ADR-002](adr-002-synchronous-read-projections.md) — Synchronous read projections
- [ADR-003](adr-003-no-backend-v1.md) — No backend for V1
