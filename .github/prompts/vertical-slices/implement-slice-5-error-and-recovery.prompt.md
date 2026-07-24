---
name: implement-slice-5-error-and-recovery
description: Implement vertical Slice 5 (Error and Recovery) for the CQRS calculator with verification and stakeholder showcase output.
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
  id: implement-slice-5-error-and-recovery
  title: "Implement Calculator Slice 5"
  owner: "johnmillerATcodemag-com"
  version: "1.0.0"
  output_path: "src/**"
  category: implementation
  output_format: markdown
---

# Implement Slice 5: Error and Recovery

## Goal

Implement Slice 5 from docs/web-based-calculator-vertical-slice-implementation-plan.md using vertical slice architecture and CQRS boundaries.

Slice 5 capability:

- Handle divide-by-zero gracefully and recover quickly.

Slice 5 acceptance checks:

- Division by zero shows readable error state.
- `AC` or new valid input exits error state.

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
4. Implement only Slice 5 scope. Do not add Slice 6+ behavior unless needed for Slice 5 correctness.
5. Include tests for reducer/command behavior, query projection behavior, and UI interaction behavior.

## Implementation Tasks

1. Add divide-by-zero guardrail in arithmetic evaluation command flow.
2. Introduce deterministic error projection state for invalid operations.
3. Implement recovery behavior through `AC` and valid fresh input.
4. Prevent invalid chained operations while in error state.
5. Add unit tests for divide-by-zero transition and recovery transitions.
6. Add component tests for error visibility and recovery interaction behavior.

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
2. Demonstrate Scenario A (error trigger):
   - Click 5, /, 0, =
   - Expected display shows readable error state
3. Demonstrate Scenario B (recovery via AC):
   - Click AC
   - Expected display returns to baseline entry state
4. Demonstrate Scenario C (recovery via valid input):
   - Trigger divide-by-zero again, then enter a valid digit sequence
   - Expected display exits error state and behaves normally
5. Confirm acceptance checks:
   - Map each shown scenario to the Slice 5 acceptance checks and mark PASS/FAIL

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
