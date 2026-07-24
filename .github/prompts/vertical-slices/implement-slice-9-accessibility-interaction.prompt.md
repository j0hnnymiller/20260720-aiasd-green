---
name: implement-slice-9-accessibility-interaction
description: Implement vertical Slice 9 (Accessibility Interaction) for the CQRS calculator with verification and stakeholder showcase output.
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
  id: implement-slice-9-accessibility-interaction
  title: "Implement Calculator Slice 9"
  owner: "johnmillerATcodemag-com"
  version: "1.0.0"
  output_path: "src/**"
  category: implementation
  output_format: markdown
---

# Implement Slice 9: Accessibility Interaction

## Goal

Implement Slice 9 from docs/web-based-calculator-vertical-slice-implementation-plan.md using vertical slice architecture and CQRS boundaries.

Slice 9 capability:

- Accessible controls and understandable display updates.

Slice 9 acceptance checks:

- Keyboard-only navigation is complete and logical.
- Screen reader users receive understandable display updates.
- Automated accessibility scans show zero critical issues.

## Required Inputs

Use these repository sources as the implementation contract:

- .github/instructions/vertical-slice.instructions.md
- docs/web-based-calculator-vertical-slice-implementation-plan.md
- docs/developer-guide.md
- docs/web-based-calculator-specification.md
- .github/instructions/playwright.instructions.md (if e2e updates are needed)
- .github/instructions/axe-core.instructions.md (if accessibility tests are added)

## Implementation Rules

1. Preserve command/query separation.
2. Keep UI event handlers thin and delegate to command handlers.
3. Keep all state reads in query selectors/hooks, not directly in components.
4. Implement only Slice 9 scope. Do not add Slice 10 behavior unless needed for Slice 9 correctness.
5. Include tests for keyboard navigation and accessibility outcomes.

## Implementation Tasks

1. Ensure all controls expose clear accessible names/labels.
2. Ensure visible, logical focus order for keyboard-only use.
3. Add understandable display update announcements for assistive technologies.
4. Verify keyboard interactions remain consistent with Slice 6 behavior.
5. Add tests for accessibility attributes and keyboard navigation.
6. Add automated accessibility scan coverage with zero critical issue target.

## Verification Steps (Mandatory)

Run these checks and report outcomes:

1. Install and baseline:
   - pnpm install
2. Static checks:
   - pnpm typecheck
   - pnpm lint
3. Automated tests:
   - pnpm test
4. Accessibility-focused e2e (if configured):
   - pnpm test:e2e

Include a verification report with:

- Commands executed
- Pass/fail result for each command
- Any failures with root cause and fix applied
- Accessibility scan summary (critical/high findings)

## Stakeholder Showcase Instructions (Mandatory)

Provide a short demo script suitable for product stakeholders:

1. Start app:
   - pnpm dev
2. Demonstrate Scenario A (keyboard-only flow):
   - Complete one arithmetic operation without pointer input
   - Show predictable focus movement
3. Demonstrate Scenario B (screen reader friendly updates):
   - Trigger display updates and narrate expected announcements
4. Demonstrate Scenario C (automated accessibility evidence):
   - Share latest accessibility scan result showing no critical issues
5. Confirm acceptance checks:
   - Map each shown scenario to the Slice 9 acceptance checks and mark PASS/FAIL

For the showcase output, include:

- A 60-90 second spoken walkthrough script
- Expected accessibility outcomes per step
- Known limitations (if any)

## Required Response Format

Return your implementation summary in this structure:

1. Plan and scope confirmation
2. Files changed and why
3. Verification report
4. Stakeholder showcase script
5. Remaining risks or follow-ups
