---
name: implement-slice-4-clear-controls
description: Implement vertical Slice 4 (Clear Controls) for the CQRS calculator with verification and stakeholder showcase output.
ai_generated: true
model: "openai/gpt-5.3-codex@2026-07-24"
operator: "johnmillerATcodemag-com"
chat_id: "a1c3d1e2-8688-474b-b7c8-188c071d89b4"
prompt: |
  Using vertical slice instructions and vertical slice implementation plan, create a prompt files that implements slices 2 and higher. Include verification steps and showcase instructions that demonstrate the functionality to stakeholders.
started: "2026-07-24T10:20:00-07:00"
ended: "2026-07-24T10:45:00-07:00"
task_durations:
  - task: "requirements and instruction alignment"
    duration: "00:06:00"
  - task: "prompt authoring for slices 2-10"
    duration: "00:16:00"
  - task: "traceability updates"
    duration: "00:03:00"
total_duration: "00:25:00"
ai_log: "ai-logs/2026/07/24/a1c3d1e2-8688-474b-b7c8-188c071d89b4/conversation.md"
source: ".github/agents/senior-developer.agent.md"
prompt_metadata:
  id: implement-slice-4-clear-controls
  title: "Implement Calculator Slice 4"
  owner: "johnmillerATcodemag-com"
  version: "1.0.0"
  output_path: "src/**"
  category: implementation
  output_format: markdown
---

# Implement Slice 4: Clear Controls

## Goal

Implement Slice 4 from docs/web-based-calculator-vertical-slice-implementation-plan.md using vertical slice architecture and CQRS boundaries.

Slice 4 capability:

- Support Clear Entry and All Clear with correct state semantics.

Slice 4 acceptance checks:

- `CE` resets only current operand.
- `AC` resets full expression state.
- Behavior is correct from entry, result, and pending states.
- Operator replacement remains deterministic after `CE` in pending state (`9 + CE -` must replace operator only).
- `CE` must not cause eager evaluation of a synthetic `0` operand when operator is changed before next digit entry.

## Required Inputs

Use these repository sources as the implementation contract:

- .github/instructions/vertical-slice.instructions.md
- docs/web-based-calculator-vertical-slice-implementation-plan.md
- docs/developer-guide.md
- docs/web-based-calculator-specification.md

## Implementation Rules

1. Preserve command/query separation.
2. Keep UI event handlers thin and delegate to command handlers.
3. Keep all state reads in query selectors/hooks, not directly in components.
4. Implement only Slice 4 scope. Do not add Slice 5+ behavior unless needed for Slice 4 correctness.
5. Include tests for reducer/command behavior, query projection behavior, and UI interaction behavior.

## Implementation Tasks

1. Implement `CE` command to reset active entry without destroying pending operation context.
2. Implement `AC` command to reset full write state.
3. Ensure both commands behave correctly from input, pending-operation, and post-result states.
4. Wire clear-control UI events to command dispatch.
5. Add unit tests for CE vs AC semantics across state modes.
6. Add component tests verifying display behavior for CE and AC interactions.
7. Add reducer and UI regression tests for `9 + CE -` and `9 + CE - 4 =`.

## Verification Steps (Mandatory)

Run these checks and report outcomes:

1. Install and baseline:
   - pnpm install
2. Static checks:
   - pnpm typecheck
   - pnpm lint
3. Automated tests:
   - pnpm test
4. If e2e exists for calculator flow:
   - pnpm test:e2e

Include a verification report with:

- Commands executed
- Pass/fail result for each command
- Any failures with root cause and fix applied

## Stakeholder Showcase Instructions (Mandatory)

Provide a short demo script suitable for product stakeholders:

1. Start app:
   - pnpm dev
2. Demonstrate Scenario A (CE on active entry):
   - Click 1, 2, 3, CE
   - Expected display resets only current entry
3. Demonstrate Scenario B (operator replacement after CE in pending state):
   - Click 9, +, CE, -
   - Expected behavior: operator is replaced, no eager evaluation is performed
4. Demonstrate Scenario C (complete sequence after replacement):
   - Continue from Scenario B with 4, =
   - Expected display: 5
5. Demonstrate Scenario D (AC from pending operation):
   - Click 7, +, 8, AC
   - Expected display and expression state fully reset
6. Demonstrate Scenario E (clear behavior after result):
   - Click 2, +, 3, =, CE and AC
   - Show and explain the implemented state outcomes
7. Confirm acceptance checks:
   - Map each shown scenario to the Slice 4 acceptance checks and mark PASS/FAIL

For the showcase output, include:

- A 60-90 second spoken walkthrough script
- Expected display values per step
- Known limitations (if any)

## Required Response Format

Return your implementation summary in this structure:

1. Plan and scope confirmation
2. Files changed and why
3. Verification report
4. Stakeholder showcase script
5. Remaining risks or follow-ups
