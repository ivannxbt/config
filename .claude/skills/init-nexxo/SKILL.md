---
name: init-nexxo
description: Generate a project-specific CLAUDE.md for Nexxo ecosystem projects. Use when entering a new project directory for the first time, when the user says "init", "setup claude", or when a CLAUDE.md is missing or outdated in a Nexxo project (expo-app, server, nexxo-web, or new projects).
---

# Init Nexxo

Generate a CLAUDE.md tailored to the current project by detecting its stack and applying Nexxo conventions.

## Process

1. **Detect stack** by reading `package.json`, `tsconfig.json`, `prisma/schema.prisma`, `app.json`, `requirements.txt`, or `pyproject.toml`
2. **Classify** using the table below
3. **Generate CLAUDE.md** using the matching template from `references/templates.md`
4. **Create LEARN.md** stub if it doesn't exist
5. **Verify** the generated file references correct commands by checking `package.json` scripts

## Stack Detection

| Signal | Stack | Template |
|--------|-------|----------|
| `expo` in package.json deps | Expo/React Native | expo |
| `@nestjs/core` in deps | NestJS | nestjs |
| `next` in deps | Next.js | nextjs |
| `fastapi` or `flask` in requirements | Python API | python |
| None of the above | Generic | generic |

## Key Conventions (always include)

- Build/dev/test/lint commands from `package.json` scripts (or equivalent)
- Architecture: key directories, data flow, external services
- Auth pattern: JWT+Passport (mobile/server) or Supabase (web)
- `LEARN.md` requirement: maintain with architecture, rationale, bugs, pitfalls
- Cross-project integration notes (see `~/CLAUDE.md` for the integration map)
- Symlinked `.claude/` watchOptions rule for Next.js projects

## LEARN.md Stub

If `LEARN.md` doesn't exist, create:

```markdown
# LEARN.md

Architecture decisions, rationale, bugs encountered, and pitfalls — maintained as an engaging educational reference.

## Architecture

<!-- Document key architectural decisions and their rationale -->

## Bugs & Pitfalls

<!-- Document bugs encountered and their solutions -->

## Patterns

<!-- Document patterns specific to this project -->
```

## Templates

Read `references/templates.md` for the full CLAUDE.md templates per stack.
