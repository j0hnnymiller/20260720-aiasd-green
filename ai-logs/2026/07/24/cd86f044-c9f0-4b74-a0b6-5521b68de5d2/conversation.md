# AI Conversation Log

- Chat ID: cd86f044-c9f0-4b74-a0b6-5521b68de5d2
- Operator: johnmillerATcodemag-com
- Model: openai/gpt-5.3-codex@2026-07-24
- Started: 2026-07-24T09:01:09-07:00
- Ended: 2026-07-24T09:01:09-07:00
- Total Duration: 00:00:00

## Context

- Inputs: docs/developer-guide.md, .github/instructions/instruction-prompt-files.instructions.md, .github/instructions/ai-assisted-output.instructions.md
- Targets: .github/prompts/stack/\*.instructions.prompt.md
- Constraints/Policies: .github/instructions/ai-assisted-output.instructions.md

## Exchanges

### Exchange 1

[2026-07-24T09:01:09-07:00] johnmillerATcodemag-com

```text
create prompt files that create instruction files for the technology stack in the developers guide
```

[2026-07-24T09:01:09-07:00] openai/gpt-5.3-codex@2026-07-24

```text
Created stack-specific instruction-generating prompt files for the technologies listed in the developer guide.
```

## Work Burst Closure

**Reasoning (Required)**:

- **Change Rationale**: Add reusable, technology-specific meta-prompts so instruction files can be generated consistently for each stack component.
- **Implementation Rationale**: Created one prompt per technology to keep guidance focused and maintainable while preserving AI provenance metadata and output-path targeting.

**Artifacts Produced**:

- `.github/prompts/stack/create-typescript-instructions.instructions.prompt.md` - Prompt to generate TypeScript instructions.
- `.github/prompts/stack/create-react-instructions.instructions.prompt.md` - Prompt to generate React instructions.
- `.github/prompts/stack/create-vite-instructions.instructions.prompt.md` - Prompt to generate Vite instructions.
- `.github/prompts/stack/create-redux-toolkit-instructions.instructions.prompt.md` - Prompt to generate Redux Toolkit instructions.
- `.github/prompts/stack/create-reselect-instructions.instructions.prompt.md` - Prompt to generate Reselect instructions.
- `.github/prompts/stack/create-tailwindcss-instructions.instructions.prompt.md` - Prompt to generate Tailwind CSS instructions.
- `.github/prompts/stack/create-react-aria-instructions.instructions.prompt.md` - Prompt to generate React Aria instructions.
- `.github/prompts/stack/create-vitest-instructions.instructions.prompt.md` - Prompt to generate Vitest instructions.
- `.github/prompts/stack/create-react-testing-library-instructions.instructions.prompt.md` - Prompt to generate React Testing Library instructions.
- `.github/prompts/stack/create-playwright-instructions.instructions.prompt.md` - Prompt to generate Playwright instructions.
- `.github/prompts/stack/create-axe-core-instructions.instructions.prompt.md` - Prompt to generate axe-core instructions.
- `.github/prompts/stack/create-eslint-instructions.instructions.prompt.md` - Prompt to generate ESLint instructions.
- `.github/prompts/stack/create-prettier-instructions.instructions.prompt.md` - Prompt to generate Prettier instructions.
- `.github/prompts/stack/create-pnpm-instructions.instructions.prompt.md` - Prompt to generate pnpm instructions.
- `.github/instructions/typescript.instructions.md` - Generated TypeScript instruction file.
- `.github/instructions/react.instructions.md` - Generated React instruction file.
- `.github/instructions/vite.instructions.md` - Generated Vite instruction file.
- `.github/instructions/redux-toolkit.instructions.md` - Generated Redux Toolkit instruction file.
- `.github/instructions/reselect.instructions.md` - Generated Reselect instruction file.
- `.github/instructions/tailwindcss.instructions.md` - Generated Tailwind CSS instruction file.
- `.github/instructions/react-aria.instructions.md` - Generated React Aria instruction file.
- `.github/instructions/vitest.instructions.md` - Generated Vitest instruction file.
- `.github/instructions/react-testing-library.instructions.md` - Generated React Testing Library instruction file.
- `.github/instructions/playwright.instructions.md` - Generated Playwright instruction file.
- `.github/instructions/axe-core.instructions.md` - Generated axe-core instruction file.
- `.github/instructions/eslint.instructions.md` - Generated ESLint instruction file.
- `.github/instructions/prettier.instructions.md` - Generated Prettier instruction file.
- `.github/instructions/pnpm.instructions.md` - Generated pnpm instruction file.

**Next Steps**:

- [x] Run each prompt to produce corresponding files under `.github/instructions/`.
- [x] Review generated instruction files for CQRS alignment and repository specificity.

**Duration Summary**:

- stack prompt generation: 00:00:00
- Total: 00:00:00
