---
ai_generated: true
model: "openai/gpt-5.3-codex@2026-07-24"
operator: "johnmillerATcodemag-com"
chat_id: "cd86f044-c9f0-4b74-a0b6-5521b68de5d2"
prompt: |
  3
started: "2026-07-24T09:06:25-07:00"
ended: "2026-07-24T09:06:25-07:00"
task_durations:
  - task: "instruction generation"
    duration: "00:00:00"
total_duration: "00:00:00"
ai_log: "ai-logs/2026/07/24/cd86f044-c9f0-4b74-a0b6-5521b68de5d2/conversation.md"
source: ".github/prompts/stack/create-eslint-instructions.instructions.prompt.md"
name: eslint
description: "Repository-specific guidance for ESLint."
applyTo: "**/*.{ts,tsx,js,jsx}"
version: "1.0.0"
author: "johnmillerATcodemag-com"
tags: ["instructions", "eslint", "cqrs"]
owner: "Development Team"
reviewedDate: "2026-07-24"
nextReview: "2026-10-24"
---

# ESLint Instructions

## Overview

Apply these rules when editing files matching **/*.{ts,tsx,js,jsx} in this CQRS calculator repository.

## Rules

1. Preserve command/query separation.
2. Keep behavior deterministic and testable.
3. Use explicit patterns and typed boundaries.
4. Cover edge cases in tests.
5. Maintain accessibility where UI behavior exists.

## Focus

- Architectural and quality rule enforcement.
- Align with docs/developer-guide.md and CQRS ADRs.

## Do

- Keep changes small and intention-revealing.
- Add or update tests with behavior changes.
- Keep lint, typecheck, and test gates green.

## Do Not

- Mix command-side mutations into query-only paths.
- Introduce hidden side effects.
- Bypass architecture rules for convenience.

## PR Checklist

- [ ] Command/query boundary preserved.
- [ ] Edge cases covered by tests.
- [ ] Accessibility verified where relevant.
- [ ] Lint, typecheck, and tests pass.
