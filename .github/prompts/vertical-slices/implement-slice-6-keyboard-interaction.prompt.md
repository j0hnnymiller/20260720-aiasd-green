---
name: implement-slice-6-keyboard-interaction
description: Implement vertical Slice 6 (Keyboard Interaction) for the CQRS calculator with verification and stakeholder showcase output.
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
  id: implement-slice-6-keyboard-interaction
  title: "Implement Calculator Slice 6"
  owner: "johnmillerATcodemag-com"
  version: "1.0.0"
  output_path: "src/**"
  category: implementation
  output_format: markdown
---

# Implement Slice 6: Keyboard Interaction

## Goal

Implement Slice 6 from docs/web-based-calculator-vertical-slice-implementation-plan.md using vertical slice architecture and CQRS boundaries.

Slice 6 capability:

- Perform full workflow via keyboard.

Slice 6 acceptance checks:

- Number keys map to digit input.
- `+`, `-`, `*`, `/` map to operator commands.
- `Enter` and `=` evaluate expression.
- Keyboard flow behavior matches button flow.

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
4. Implement only Slice 6 scope. Do not add Slice 7+ behavior unless needed for Slice 6 correctness.
5. Include tests for reducer/command behavior, query projection behavior, and UI interaction behavior.

## Implementation Tasks

1. Implement a keyboard adapter that maps keys to existing commands.
2. Ensure `Enter` and `=` both map to equals command behavior.
3. Ensure operator key mappings use command handlers, not direct state mutation.
4. Implement focus behavior needed for reliable keyboard operation.
5. Add unit tests for key-to-command mapping logic.
6. Add component tests for full keyboard-based arithmetic workflows.

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
2. Demonstrate Scenario A (digit input):
   - Press `1`, `2`, `3`
   - Expected display: 123
3. Demonstrate Scenario B (operator and evaluation parity):
   - Press `7`, `*`, `6`, `Enter`
   - Expected display: 42
4. Demonstrate Scenario C (`=` parity):
   - Press `8`, `/`, `4`, `=`
   - Expected display: 2
5. Confirm acceptance checks:
   - Map each shown scenario to the Slice 6 acceptance checks and mark PASS/FAIL

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
