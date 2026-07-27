---
ai_generated: true
model: "openai/gpt-5.2-codex@2026-02-07"
operator: "johnmillerATcodemag-com"
chat_id: "cqrs-architecture-instructions-20260207"
prompt: |
  @solution-architect create an instruction file for a CQRS architecture
started: "2026-02-07T17:00:00Z"
ended: "2026-02-07T17:20:00Z"
task_durations:
  - task: "requirements analysis"
    duration: "00:05:00"
  - task: "instruction drafting"
    duration: "00:12:00"
  - task: "review and refinement"
    duration: "00:03:00"
total_duration: "00:20:00"
ai_log: "ai-logs/2026/02/07/cqrs-architecture-instructions-20260207/conversation.md"
source: "johnmillerATcodemag-com"
applyTo: "**/*.{cs,ts,js,py,java,go,rb,kt,swift}"
---

# CQRS Architecture Instructions

## Overview

Guidance for designing and implementing Command Query Responsibility Segregation (CQRS).
Use this when separate write and read models improve scalability, performance, or domain clarity.

This repository's calculator architecture uses logical CQRS with a single in-browser write store
and synchronous read projections. Do not introduce a separate read store, async projection
pipeline, or backend service unless the user asks to change the accepted ADRs.

**Target Audience**: AI assistants, architects, senior developers
**Scope**: CQRS decision criteria, components, data models, consistency, integration, and validation

**Related Documentation**:

- [AI-Assisted Output Instructions](.github/instructions/ai-assisted-output.instructions.md)
- [Vertical Slice Instructions](.github/instructions/vertical-slice.instructions.md)
- [Developer Guide](docs/developer-guide.md)
- [ADR-001: Adopt CQRS via Redux Toolkit](docs/adr/adr-001-cqrs-redux-toolkit.md)
- [ADR-002: Synchronous Read Projections](docs/adr/adr-002-synchronous-read-projections.md)
- [ADR-003: No Backend Service for V1](docs/adr/adr-003-no-backend-v1.md)

## Table of Contents

- [When to Use CQRS](#when-to-use-cqrs)
- [Core Principles](#core-principles)
- [Architecture Components](#architecture-components)
- [Command Model Design](#command-model-design)
- [Query Model Design](#query-model-design)
- [Consistency and Transactions](#consistency-and-transactions)
- [Integration and Messaging](#integration-and-messaging)
- [Operational Concerns](#operational-concerns)
- [Anti-Patterns](#anti-patterns)
- [Migration Strategy](#migration-strategy)
- [Quality Checklist](#quality-checklist)
- [Examples](#examples)

## When to Use CQRS

Use CQRS when one or more are true:

- Read and write workloads scale differently.
- Read models require denormalization, caching, or projections.
- Write model needs strong invariants and task-focused workflows.
- Auditing, event sourcing, or integration events are required.
- Query complexity is slowing down transactional throughput.

Avoid CQRS when:

- The domain is small and reads/writes are balanced.
- There is no clear boundary between commands and queries.
- Operational overhead is not justified.

## Core Principles

- Commands change state; queries never change state.
- Write model enforces invariants; read model optimizes retrieval.
- Models can be logically separated even when they share one process or store.
- Eventual consistency is optional, not required. Prefer strong synchronous projections when the
  application runs in a single process and the user expects immediate feedback.

## Architecture Components

Minimum components:

- **Command API**: Accepts commands, validates, enforces invariants.
- **Command Handler**: Orchestrates domain operations.
- **Write Store**: Transactional database for aggregates.
- **Event/Change Publisher**: Emits domain or integration events when external consumers or
  asynchronous projections exist.
- **Projection/Read Updater**: Builds read models when reads are physically separated from writes.
- **Query API**: Serves read models with filtering and pagination.
- **Read Store**: Optional query-optimized database, cache, or synchronous projection layer.

For this repository's browser calculator, map the components as follows:

- Redux `dispatch` = command API
- Slice reducers = command handlers
- Redux state = write store
- Reselect selectors = query API and read projections
- No separate read store, projection updater, or message broker in V1

## Command Model Design

- Use task-based commands: `CreateOrder`, `ApproveOrder`.
- Validate at the command boundary; reject invalid commands fast.
- Use aggregates to enforce invariants and consistency rules.
- Keep command handlers deterministic and side-effect controlled.
- Write to a single source of truth (write store).

Command rules:

- Commands are imperative and intention revealing.
- Commands can fail; queries should not.
- One command should target one aggregate root.

Repository-specific calculator invariants:

- Operator replacement must not evaluate early. If a pending operator exists and no
  right-hand operand is committed, selecting another operator replaces the pending operator only.
- Operator chaining evaluates exactly once per committed right-hand operand, then updates the
  pending operator.
- Clear-entry behavior must preserve deterministic operator behavior. Example interaction:
  `9 + CE -` replaces `+` with `-` and does not compute `9 + 0`.

When changing calculator command handlers or reducer transitions, update reducer-level and
UI-level regression tests that cover these invariants.

## Query Model Design

- Shape queries for the UI or consumer use case.
- Prefer read models that avoid joins and complex calculations.
- Use projections updated from events or change feeds only when reads are physically separated.
- Keep read models versioned and rebuildable.

Query rules:

- Queries are idempotent and side-effect free.
- Read models are optimized for latency and throughput.

## Consistency and Transactions

- Choose consistency based on deployment topology instead of assuming eventual consistency.
- Define consistency requirements per feature (strong vs eventual).
- Use the outbox pattern for reliable event publication when writes must feed external consumers.
- For strong consistency in a single-process app, derive queries synchronously from the write
  state. Use direct write-model reads or dual-write safeguards only when that architecture exists.

Consistency decision matrix:

- **Strong**: Payments, inventory, security
- **Eventual**: Dashboards, activity feeds, analytics

## Integration and Messaging

- Publish domain events after successful writes when another process, store, or integration needs
  them.
- Use message brokers for async projection updates only when projections are physically separated
  from the write path.
- Support replay to rebuild read models when an event stream or projection pipeline exists.
- Version events; avoid breaking changes to event contracts.

## Operational Concerns

- Monitor command latency, projection lag, and read freshness.
- Provide backfill and rebuild procedures for read models.
- Implement idempotency for projection consumers.
- Use separate scaling for read and write paths only when those paths are independently deployed.

## Anti-Patterns

- Mixing query logic in command handlers.
- Sharing the same ORM model for reads and writes.
- Over-using CQRS for simple CRUD domains.
- Dual writes without an outbox or transaction coordination.

## Migration Strategy

- Start with a single bounded context or feature.
- Keep the logical command/query boundary even if both paths share one store at first.
- Add a separate read store only when latency, topology, or reporting needs justify it.
- Introduce event publishing after stable write flow and a concrete consumer requirement.

## Quality Checklist

- [ ] Command and query models are clearly separated
- [ ] Write model enforces all invariants
- [ ] Calculator command invariants are preserved when applicable
- [ ] Read model is optimized for query use cases
- [ ] Event publication is reliable when external consumers or async projections exist
- [ ] Projection updates are idempotent and monitored when a projection pipeline exists
- [ ] Consistency expectations are documented per feature
- [ ] Operational dashboards include read freshness and lag when reads are physically separated
- [ ] Rebuild strategy for read models is documented when a separate read model exists

## Examples

**Command flow (write)**:

1. API receives `ApproveOrder` command
2. Command handler loads `Order` aggregate
3. Aggregate validates approval rules
4. Transaction commits to write store
5. Event published: `OrderApproved`

**Query flow (read)**:

1. UI requests order summary
2. Query API reads `OrderSummary` projection
3. Synchronous selector or read store returns the denormalized view
4. Response includes `lastUpdatedUtc` for freshness
