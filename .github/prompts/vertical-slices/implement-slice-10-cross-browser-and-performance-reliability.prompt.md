---
name: implement-slice-10-cross-browser-and-performance-reliability
description: Implement vertical Slice 10 (Cross-Browser and Performance Reliability) for the CQRS calculator with verification and stakeholder showcase output.
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
  id: implement-slice-10-cross-browser-and-performance-reliability
  title: "Implement Calculator Slice 10"
  owner: "johnmillerATcodemag-com"
  version: "1.0.0"
  output_path: "src/**"
  category: implementation
  output_format: markdown
---

# Implement Slice 10: Cross-Browser and Performance Reliability

## Goal

Implement Slice 10 from docs/web-based-calculator-vertical-slice-implementation-plan.md using vertical slice architecture and CQRS boundaries.

Slice 10 capability:

- Consistent performance and behavior across supported browsers.

Slice 10 acceptance checks:

- Core suite passes in all target browsers.
- Interface is interactive within 2 seconds under normal conditions.
- Median input-to-display latency remains under 100 ms.

## Required Inputs

Use these repository sources as the implementation contract:

- .github/instructions/vertical-slice.instructions.md
- docs/web-based-calculator-vertical-slice-implementation-plan.md
- docs/developer-guide.md
- docs/web-based-calculator-specification.md
- .github/instructions/playwright.instructions.md (if e2e/browser automation is updated)

## Implementation Rules

1. Preserve command/query separation.
2. Keep behavior deterministic and avoid scope creep beyond reliability and release-gate readiness.
3. Keep all state reads in query selectors/hooks, not directly in components.
4. Implement only Slice 10 scope.
5. Include tests and metrics evidence for browser compatibility and performance targets.

## Implementation Tasks

1. Validate compatibility across latest two major versions of Chrome, Edge, Firefox, and Safari.
2. Add or update automated cross-browser tests for core calculator workflows.
3. Measure interactivity timing and document whether it meets <= 2s target.
4. Measure input-to-display latency and verify median remains < 100 ms.
5. Add reporting artifacts for browser matrix and performance observations.
6. Ensure any test setup changes are documented for repeatability.

## Verification Steps (Mandatory)

Run these checks and report outcomes:

1. Install and baseline:
   - pnpm install
2. Static checks:
   - pnpm typecheck
   - pnpm lint
3. Automated tests:
   - pnpm test
4. Cross-browser/e2e checks (if configured):
   - pnpm test:e2e

Include a verification report with:

- Commands executed
- Pass/fail result for each command
- Any failures with root cause and fix applied
- Cross-browser matrix summary
- Performance metrics summary for interactivity and input latency

## Stakeholder Showcase Instructions (Mandatory)

Provide a short demo script suitable for product stakeholders:

1. Start app:
   - pnpm dev
2. Demonstrate Scenario A (browser parity):
   - Show one canonical arithmetic flow in at least two browsers
   - Reference automated matrix results for remaining browsers
3. Demonstrate Scenario B (interactivity):
   - Share measured app interactive timing and whether it meets target
4. Demonstrate Scenario C (input latency):
   - Share measured median input-to-display latency and whether it meets target
5. Confirm acceptance checks:
   - Map each shown scenario to the Slice 10 acceptance checks and mark PASS/FAIL

For the showcase output, include:

- A 60-90 second spoken walkthrough script
- Expected reliability/performance outcomes per step
- Known limitations (if any)

## Required Response Format

Return your implementation summary in this structure:

1. Plan and scope confirmation
2. Files changed and why
3. Verification report
4. Stakeholder showcase script
5. Remaining risks or follow-ups
