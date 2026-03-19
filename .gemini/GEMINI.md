# GEMINI.md

This file provides context and instructions for Gemini CLI when operating within this workspace.

## Workspace Overview

This is a multi-project development environment focused on the **Nexxo** product ecosystem, personal portfolio projects, and corporate automation.

### Project Map

| Project | Path | Stack | Package Manager |
|---------|------|-------|-----------------|
| **Next.js Web** | `~/Proyectos/nexxo-web` | Next.js 16, Tailwind v4, Supabase | `npm` |
| **NestJS Server** | `~/Proyectos/server` | NestJS 11, Prisma, PostgreSQL | `pnpm` |
| **Expo App** | `~/Proyectos/expo-app-*` | Expo 53, React Native, TanStack Query | `bun` |
| **Auth Server** | `~/Proyectos/server-auth` | NestJS, Prisma, JWT/Passport | `pnpm` |
| **Corporate** | `~/Library/CloudStorage/OneDrive-AvvaleS.p.A/` | Python, FastAPI, Azure OpenAI | `pip` |

## Core Mandates

1.  **Contextual Precedence:** Always prioritize project-specific instructions (e.g., `CLAUDE.md`, `LEARN.MD`, `package.json`) found within each subdirectory.
2.  **Working Directory:** Never run build or install commands from the home directory (`/Users/ivancaamano`). Always `cd` into the target project first.
3.  **Tool Selection:** Match the package manager of the project (`npm`, `pnpm`, or `bun`) as defined in the Project Map.
4.  **Language Preference:** Strictly use **TypeScript** for all JS/TS projects. Use **Python** for corporate data projects.

## Common Workflows

### Web Development (Next.js)
- **Start Dev Server:** `npm run dev` (Note: Uses `--webpack` flag).
- **Test:** `npm run test` (Vitest) or `npm run test:e2e` (Playwright).
- **Validation:** `npm run lint` and `npm run type-check`.

### Backend Development (NestJS)
- **Start Dev Server:** `pnpm dev`.
- **Database:** `docker compose up -d` to start PostgreSQL, then `prisma migrate dev` or `prisma studio`.
- **Test:** `pnpm test` or `pnpm test:e2e`.

### Mobile Development (Expo)
- **Start Dev Server:** `bun dev` or `expo start`.
- **Build:** `eas build --profile preview`.
- **Lint:** `expo lint`.

### Corporate Automation (Python)
- **Run Tests:** `pytest`.
- **Style:** Use `ruff` for linting.

## Development Conventions

- **Naming:**
    - `PascalCase` for React/React Native components.
    - `camelCase` for variables and functions.
    - `kebab-case` for route folders and utility files.
- **Styling:** Tailwind CSS (v4) for web; native styling for Expo.
- **Testing:**
    - Unit tests: Vitest (Web), Jest (Server/Mobile), Pytest (Python).
    - End-to-End: Playwright (Web).
    - Keep tests adjacent to the code they test (`*.spec.ts`) or in `tests/`/`__tests__/` folders.
- **Architecture:**
    - Mobile apps communicate with the NestJS server via axios + TanStack Query.
    - Web apps integrate directly with Supabase.
    - Shared AI configurations are managed in `~/Proyectos/config/` and symlinked to projects.

## Skills & Slash Commands

Always check available skills before acting. If a skill matches the task domain — even partially — invoke it BEFORE writing code, delegating, or responding.

- A domain-specific skill exists for the task (frontend design, web guidelines, React best practices, etc.)
- The user explicitly references a slash command (`/commit`, `/review-pr`, etc.)
- A hook or system injects a skill recommendation — follow it

### Skill Map

| Domain | Skill | When to Use |
|--------|-------|-------------|
| Planning | `brainstorm`, `write-plan`, `execute-plan` | Open-ended problems, multi-step tasks |
| Debugging | `systematic-debugging`, `react-doctor` | Bugs persisting after 2+ attempts, React-specific issues |
| Code Quality | `simplify`, `code-review`, `review-pr` | After writing code, before commits/PRs |
| Frontend | `vercel-react-best-practices`, `web-design-guidelines`, `frontend-design` | React/Next.js components, UI review, accessibility |
| UI Polish | `make-interfaces-feel-better`, `uifix`, `shadcn` | Animations, styling bugs, component library |
| Git | `commit`, `commit-push-pr`, `clean_gone` | Committing, shipping, branch cleanup |
| Stack | `next-best-practices`, `react-native-expo`, `prisma-client-api`, `better-auth` | Framework-specific patterns |
| Content | `copywriting`, `seo-audit`, `content-strategy` | User-facing copy, SEO, marketing |
| Meta | `find-skills` | Not sure which skill applies |

Skipping a relevant skill = incomplete work. Skills contain up-to-date patterns, checklists, and constraints that training data may lack. Trust the skill over memory.

## Security & Secrets

- Never commit `.env` files, API keys, or mobile signing credentials.
- Document required environment variables in an `env.example` file within the respective repository.
