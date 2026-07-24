---
name: implement-slice-1-number-entry-display
description: Implement vertical Slice 1 (Number Entry and Display) for the CQRS calculator with verification and stakeholder showcase output.
ai_generated: true
model: "openai/gpt-5.3-codex@2026-07-24"
operator: "johnmillerATcodemag-com"
chat_id: "210a308b-2d94-453c-8a6c-4fd80dc4eabd"
prompt: |
  Using vertical slice instructions and vertical slice implementation plan, create a prompt file that implements slice 1. Include verification steps and showcase instructions that demonstrate the functionality to stakeholders.
started: "2026-07-24T09:53:30-07:00"
ended: "2026-07-24T10:00:30-07:00"
task_durations:
  - task: "requirements and instruction alignment"
    duration: "00:03:00"
  - task: "prompt authoring and traceability updates"
    duration: "00:04:00"
total_duration: "00:07:00"
ai_log: "ai-logs/2026/07/24/210a308b-2d94-453c-8a6c-4fd80dc4eabd/conversation.md"
source: ".github/agents/senior-developer.agent.md"
prompt_metadata:
  id: implement-slice-1-number-entry-display
  title: "Implement Calculator Slice 1"
  owner: "johnmillerATcodemag-com"
  version: "1.0.0"
  output_path: "src/**"
  category: implementation
  output_format: markdown
---

# Implement Slice 1: Number Entry and Display

## Goal

Implement Slice 1 from docs/web-based-calculator-vertical-slice-implementation-plan.md using vertical slice architecture and CQRS boundaries.

Slice 1 capability:

- Enter digits 0-9 and see immediate display updates.

Slice 1 acceptance checks:

- Digits render correctly in display.
- Leading zero behavior is deterministic.
- Starting new entry after completed result follows calculator rules.

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
4. Implement only Slice 1 scope. Do not add Slice 2+ behavior unless needed for Slice 1 correctness.
5. Include tests for reducer/command behavior, query projection behavior, and UI interaction behavior.

## Implementation Tasks

1. Identify or create Slice 1 feature area and wire digit entry command flow.
2. Implement or update write-state logic for deterministic numeric entry:
   - digit append behavior
   - leading zero handling
   - new-entry behavior after evaluated result
3. Implement or update read projection for canonical display value.
4. Wire keypad pointer interactions for digits 0-9 to command dispatch.
5. Add unit tests for command handlers and selectors.
6. Add component tests for display updates from pointer input.

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
2. Demonstrate Scenario A (basic entry):
   - Click 1, 2, 3
   - Expected display: 123
3. Demonstrate Scenario B (leading zero determinism):
   - Begin from clean state
   - Click 0, 0, 7
   - Expected display follows implemented deterministic rule
   - State the rule in one sentence
4. Demonstrate Scenario C (new entry after evaluated result):
   - Produce a result (for example: 2 + 3 =)
   - Click 4
   - Expected display starts a fresh entry according to calculator rules
5. Confirm acceptance checks:
   - Map each shown scenario to the Slice 1 acceptance checks and mark PASS/FAIL

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
