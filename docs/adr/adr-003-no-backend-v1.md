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

# ADR-003: No Backend Service for V1

## Status

Accepted

## Date

2026-07-24

## Context

The calculator specification explicitly states that core calculations must be available without user authentication and that no user-entered calculation data should be required to leave the browser for core functionality. The question is whether any server-side infrastructure is warranted for the initial release.

Candidates evaluated:

| Option                               | Core Calculation | History Persistence | Auth Required  | Complexity |
| ------------------------------------ | ---------------- | ------------------- | -------------- | ---------- |
| Pure browser (no backend)            | In-browser       | None (V1)           | No             | Low        |
| Backend API for calculation engine   | Server-side      | Optional            | Optional       | High       |
| Backend API for history only         | In-browser       | Server-side         | Yes (for sync) | Medium     |
| Static hosting + optional serverless | In-browser       | Optional (future)   | No             | Low-Medium |

## Decision

Implement V1 as a **pure browser application with no backend service**. All calculation logic executes in the client. The write store and read projections are held entirely in memory for the lifetime of the browser session.

The application will be deployable as a static site (e.g., Vite build output to Azure Static Web Apps, GitHub Pages, or any CDN).

## Consequences

**Benefits**:

- Satisfies the specification's explicit constraint (business rule 4)
- No authentication, authorization, or API surface to secure in V1
- Eliminates network latency from the calculation path entirely
- Simplifies deployment — static file hosting only
- No backend infrastructure cost or operational burden

**Costs**:

- Calculation history does not persist across sessions or devices in V1
- Multi-device sync, cloud backup, and sharing features are deferred
- If a backend is introduced later, the Redux command/query boundary must be extended to cover async command dispatch and remote projection hydration

**Deferred scope** (per specification): scientific functions, persistent history sync, user accounts, currency conversion, and offline installation.

**Future migration path**: When persistent history is required, introduce a backend API behind the command bus. Commands that require persistence become async (`dispatch` → API call → write store update on response). The query layer is unaffected.

## Related ADRs

- [ADR-001](adr-001-cqrs-redux-toolkit.md) — Adopt CQRS via Redux Toolkit
- [ADR-002](adr-002-synchronous-read-projections.md) — Synchronous read projections
