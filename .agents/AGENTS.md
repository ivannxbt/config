# Repository Guidelines

## Project Structure & Module Organization
This root is a multi-project workspace, not a single app. Active code lives under `Proyectos/`, with separate repositories such as `Proyectos/nexxo-web` (Next.js), `Proyectos/server` and `Proyectos/server-auth` (NestJS), `Proyectos/expo-app*` (Expo/React Native), and `Proyectos/atresmedia-tv-budgets` (Python). Shared agent assets and local automation live in `.agents/` and `.codex/`. Keep source, tests, and config inside each project folder; do not add app code at the workspace root.

## Build, Test, and Development Commands
Run commands from the target project directory, not from `/Users/ivancaamano`.

- `cd Proyectos/nexxo-web && npm run dev`: start the Next.js app locally.
- `cd Proyectos/nexxo-web && npm run test && npm run test:e2e`: run Vitest unit tests and Playwright end-to-end coverage.
- `cd Proyectos/server && pnpm dev`: start the NestJS API in watch mode.
- `cd Proyectos/server && pnpm test:cov`: run Jest with coverage.
- `cd Proyectos/expo-app-testing && npm run dev`: launch the Expo app.
- `cd Proyectos/atresmedia-tv-budgets && pytest`: run the Python test suite.

Check each project's `package.json` or `pyproject.toml` before adding new scripts.

## Coding Style & Naming Conventions
Follow the formatter and linter already configured in each project. Current tooling includes `eslint`, `prettier`, `vitest`, `jest`, and Expo/Nest defaults. Use 2-space indentation in JS/TS projects unless the local formatter overrides it. Prefer `PascalCase` for React components, `camelCase` for variables/functions, and `kebab-case` for route folders and utility file names. Keep tests adjacent to their stack conventions, for example `*.spec.ts`, `tests/`, or `__tests__/`.

## Testing Guidelines
Match the framework used by the project: Vitest and Playwright for web apps, Jest for NestJS and Expo, and `pytest` for Python services. Add tests for new behavior and regressions, not just happy paths. Favor small, deterministic unit tests first, then E2E only where flows cross boundaries.

## Commit & Pull Request Guidelines
Recent history shows short imperative subjects, with mixed styles such as `feat: add ...`, `Fix typo ...`, and `Refactor ...`. Prefer concise, present-tense commit messages and keep each commit scoped to one change. PRs should include a clear summary, impacted project path, test evidence, linked issue when applicable, and screenshots or recordings for UI changes.

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

## Security & Configuration Tips
Do not commit secrets, local `.env` files, tokens, or mobile signing material. Store project-specific configuration inside the owning repo and document required environment variables in that repo's README.
