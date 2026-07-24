---
name: implement-slice-8-responsive-touch-experience
description: Implement vertical Slice 8 (Responsive Touch Experience) for the CQRS calculator with verification and stakeholder showcase output.
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
  id: implement-slice-8-responsive-touch-experience
  title: "Implement Calculator Slice 8"
  owner: "johnmillerATcodemag-com"
  version: "1.0.0"
  output_path: "src/**"
  category: implementation
  output_format: markdown
---

# Implement Slice 8: Responsive Touch Experience

## Goal

Implement Slice 8 from docs/web-based-calculator-vertical-slice-implementation-plan.md using vertical slice architecture and CQRS boundaries.

Slice 8 capability:

- Reliable, usable interaction across mobile and desktop viewports.

Slice 8 acceptance checks:

- Common mobile and desktop viewport layouts remain usable.
- Touch targets are reliably tappable.
- UI remains operable at 200% zoom.

## Required Inputs

Use these repository sources as the implementation contract:

- .github/instructions/vertical-slice.instructions.md
- docs/web-based-calculator-vertical-slice-implementation-plan.md
- docs/developer-guide.md
- docs/web-based-calculator-specification.md

## Implementation Rules

1. Preserve command/query separation.
2. Keep behavior deterministic and avoid visual regressions unrelated to Slice 8.
3. Keep all state reads in query selectors/hooks, not directly in components.
4. Implement only Slice 8 scope. Do not add Slice 9+ behavior unless needed for Slice 8 correctness.
5. Include tests for responsive behavior and interaction reliability where automatable.

## Implementation Tasks

1. Implement responsive layout rules for mobile and desktop breakpoints.
2. Ensure touch target sizing and spacing supports reliable tapping.
3. Validate stable button placement and readable display area across viewports.
4. Ensure calculator remains operable at 200% zoom.
5. Add responsive/UI tests where feasible (component, visual, or e2e assertions).
6. Document any manual checks required for zoom and viewport validation.

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

Also include manual verification notes for:

- Mobile viewport checks (for example 360x800)
- Desktop viewport checks (for example 1440x900)
- 200% zoom operability

## Stakeholder Showcase Instructions (Mandatory)

Provide a short demo script suitable for product stakeholders:

1. Start app:
   - pnpm dev
2. Demonstrate Scenario A (mobile layout):
   - Set viewport to a common mobile size
   - Show keypad readability and tapability
3. Demonstrate Scenario B (desktop layout):
   - Set viewport to desktop size
   - Show stable layout and easy operation
4. Demonstrate Scenario C (zoom):
   - Increase browser zoom to 200%
   - Show that operations remain fully usable
5. Confirm acceptance checks:
   - Map each shown scenario to the Slice 8 acceptance checks and mark PASS/FAIL

For the showcase output, include:

- A 60-90 second spoken walkthrough script
- Expected interaction outcomes per step
- Known limitations (if any)

## Required Response Format

Return your implementation summary in this structure:

1. Plan and scope confirmation
2. Files changed and why
3. Verification report
4. Stakeholder showcase script
5. Remaining risks or follow-ups
