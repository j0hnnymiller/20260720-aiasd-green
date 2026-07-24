---
name: create-reselect-instructions
description: Generate an instruction file for Reselect usage in this CQRS calculator repository.
ai_generated: true
model: "openai/gpt-5.3-codex@2026-07-24"
operator: "johnmillerATcodemag-com"
chat_id: "cd86f044-c9f0-4b74-a0b6-5521b68de5d2"
prompt: |
  create prompt files that create instruction files for the technology stack in the developers guide
started: "2026-07-24T09:01:09-07:00"
ended: "2026-07-24T09:01:09-07:00"
task_durations:
  - task: "stack prompt generation"
    duration: "00:00:00"
total_duration: "00:00:00"
ai_log: "ai-logs/2026/07/24/cd86f044-c9f0-4b74-a0b6-5521b68de5d2/conversation.md"
source: ".github/prompts/stack/create-reselect-instructions.instructions.prompt.md"
prompt_metadata:
  id: create-reselect-instructions
  title: "Generate Reselect Instructions"
  owner: "johnmillerATcodemag-com"
  version: "1.0.0"
  output_path: ".github/instructions/reselect.instructions.md"
  category: documentation
  output_format: markdown
---

# Generate Reselect Instructions

## Context

Create a technology-specific instruction file for Reselect that aligns with the CQRS web calculator architecture documented in docs/developer-guide.md.

CRITICAL: All AI-generated artifacts MUST comply with .github/instructions/ai-assisted-output.instructions.md. Generated instruction file MUST include full AI provenance metadata.

## Deliverable

Generate .github/instructions/reselect.instructions.md with:

Required AI Provenance Metadata (YAML Front Matter):
- ai_generated: true
- model: "<model-name-and-version>"
- operator: "<operator-username>"
- chat_id: "<chat-identifier>"
- prompt: |
    <exact-prompt-text>
- started: "<ISO8601-timestamp>"
- ended: "<ISO8601-timestamp>"
- task_durations:
    - task: "<task-name>"
      duration: "<hh:mm:ss>"
- total_duration: "<hh:mm:ss>"
- ai_log: "ai-logs/<yyyy>/<mm>/<dd>/<chat-id>/conversation.md"
- source: "<source-identifier>"
- applyTo: "**/*.{ts,tsx}"

Content Requirements:
- Explain purpose, scope, and when to use Reselect in this repository.
- Define prescriptive do and do-not rules tied to this architecture.
- Include at least one good example and one anti-pattern.
- Add integration guidance with React, TypeScript, and CQRS boundaries where relevant.
- Include a validation checklist for pull requests and CI readiness.
- Keep language imperative, concrete, and optimized for AI consumption.

Focus Notes:
- Deterministic memoized query projections.
