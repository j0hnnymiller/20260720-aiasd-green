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

# ADR-002: Synchronous Read Projections (No Separate Read Store)

## Status

Accepted

## Date

2026-07-24

## Context

In a distributed CQRS system, the read model is typically maintained in a separate store (e.g., a read-optimized database) updated asynchronously via domain events. This introduces eventual consistency between the write and read models.

For this project, the question is whether to use a separate in-memory read store (updated via events) or to derive read projections synchronously from the same Redux state.

Candidates evaluated:

| Option                                              | Read Store               | Consistency          | Complexity                                                    |
| --------------------------------------------------- | ------------------------ | -------------------- | ------------------------------------------------------------- |
| Separate in-memory read store updated by middleware | Distinct object tree     | Eventual (one tick)  | High — requires event bus, projection updater, and read store |
| Reselect projections derived from write state       | Derived from Redux state | Strong (synchronous) | Low — projections are computed on each render                 |
| Dual write to Redux + separate read cache           | Separate cache           | Strong (dual write)  | Medium — risk of divergence without an outbox                 |

## Decision

Use **synchronous Reselect projections** derived directly from the Redux write store. No separate read store or in-memory event bus is introduced in V1.

Rationale:

- The application runs entirely in the browser with a single write store; there is no distributed system boundary to cross
- Strong consistency is the correct model for a calculator — a user entering `2 + 3 =` must immediately see `5`; eventual consistency would be incorrect behavior
- A separate read store provides no scalability benefit in a single-process browser app
- Reselect memoization provides the same performance characteristics as a read cache for this use case

Per the CQRS architecture guidelines, strong consistency is required for the consistency class this calculator occupies (immediate user feedback, not analytics or dashboards).

## Consequences

**Benefits**:

- Zero projection lag — read model is always consistent with write state
- No event bus, projection updater, or read store infrastructure to maintain
- Projections are rebuildable trivially (Reselect recomputes when inputs change)
- Simplifies testing — selectors are pure functions of state

**Costs**:

- Deviates from the "separate read store" ideal of full CQRS; the command/query boundary is logical, not physical
- If the application grows to include server-side persistence or multi-tab sync, this decision must be revisited

**Future migration path**: If a server-side write store is introduced (e.g., persistent calculation history), extract the read projections into a projection consumer that subscribes to domain events. The Reselect selectors can be retained as the UI query layer while the projection data source changes.

## Related ADRs

- [ADR-001](adr-001-cqrs-redux-toolkit.md) — Adopt CQRS via Redux Toolkit
- [ADR-003](adr-003-no-backend-v1.md) — No backend for V1
