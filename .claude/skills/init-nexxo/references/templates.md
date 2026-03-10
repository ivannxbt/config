# CLAUDE.md Templates

## Expo (React Native)

```markdown
# CLAUDE.md

## Project Overview
[PROJECT_NAME] — Expo [EXPO_VERSION] + React Native + expo-router + TanStack Query

## Commands
- `bun dev` / `expo start` — dev server
- `expo run:ios` / `expo run:android` — native build
- `eas build --profile preview` — cloud build
- `expo lint` — lint
- `bun test` — tests (if configured)

## Architecture
- **Router**: expo-router (file-based, `app/` directory)
- **State/Data**: TanStack Query for server state, Zustand/Context for local
- **API**: axios to NestJS server (localhost:3000 iOS, 10.0.2.2:3000 Android, Railway prod)
- **Auth**: JWT + Passport (tokens in SecureStore)
- **Styling**: [NativeWind/StyleSheet — detect from deps]

## Key Directories
- `app/` — routes (expo-router)
- `components/` — shared UI
- `hooks/` — custom hooks
- `services/` or `api/` — API layer
- `stores/` or `context/` — state management

## Conventions
- TypeScript strict
- Package manager: bun
- Maintain `LEARN.md` with architecture, rationale, bugs, pitfalls
```

## NestJS

```markdown
# CLAUDE.md

## Project Overview
[PROJECT_NAME] — NestJS [VERSION] + Prisma + PostgreSQL (Docker)

## Commands
- `pnpm dev` — watch mode
- `pnpm build` — production build
- `pnpm test` / `pnpm test:watch` — jest
- `pnpm test:e2e` — e2e tests
- `docker compose up -d` — start postgres
- `prisma migrate dev --name X` — new migration
- `prisma generate` — regenerate client
- `prisma studio` — DB GUI

## Architecture
- **ORM**: Prisma (schema in `prisma/schema.prisma`)
- **Auth**: JWT + Passport (guards in `src/auth/`)
- **Validation**: class-validator + class-transformer
- **Config**: @nestjs/config with `.env`

## Key Directories
- `src/` — modules (NestJS module pattern)
- `prisma/` — schema + migrations
- `test/` — e2e tests

## Conventions
- TypeScript strict
- Package manager: pnpm
- Each feature = NestJS module (controller + service + DTOs)
- Maintain `LEARN.md` with architecture, rationale, bugs, pitfalls
```

## Next.js

```markdown
# CLAUDE.md

## Project Overview
[PROJECT_NAME] — Next.js [VERSION] + Tailwind v4 + [Supabase/other]

## Commands
- `npm run dev` — dev server (uses --webpack flag)
- `npm run build` — production build (uses --webpack flag)
- `npm run lint` — eslint, zero warnings
- `npm run type-check` — tsc --noEmit
- `npm run test` — vitest (if configured)

## Architecture
- **Router**: App Router (`app/` directory)
- **Styling**: Tailwind CSS v4
- **Auth**: Supabase auth helpers
- **Data**: [Supabase client / API routes — detect]
- **Analytics**: PostHog
- **Error tracking**: Sentry
- **Email**: Resend

## Key Directories
- `app/` — routes + layouts
- `components/` — shared UI
- `lib/` — utilities, clients, configs
- `public/` — static assets

## Conventions
- TypeScript strict
- Package manager: npm
- Uses `--webpack` flag (not Turbopack) for dev and build
- Symlinked `.claude/` dirs: `watchOptions.ignored` in `next.config` required
- Maintain `LEARN.md` with architecture, rationale, bugs, pitfalls
```

## Python (Avvale POC)

```markdown
# CLAUDE.md

## Project Overview
[PROJECT_NAME] — Python + FastAPI + pandas + Azure OpenAI

## Commands
- `uv run uvicorn main:app --reload` — dev server
- `uv run pytest` — tests
- `ruff check .` — lint
- `ruff format .` — format

## Architecture
- **API**: FastAPI
- **LLM**: Azure OpenAI (endpoint + deployment from `.env`)
- **Data**: pandas for Excel/CSV processing
- **Reports**: Word (python-docx) + PDF output
- **Language**: All reports and UI in Spanish, executive tone

## Key Directories
- `app/` or `src/` — main application
- `data/` — input data files
- `output/` — generated reports
- `prompts/` — LLM prompt templates

## Conventions
- Python 3.11+
- Package manager: uv
- Credentials from `.env` only (never hardcoded)
- No git — deliver via OneDrive/zip
- Maintain `LEARN.md` with architecture, rationale, bugs, pitfalls
```

## Generic

```markdown
# CLAUDE.md

## Project Overview
[PROJECT_NAME] — [STACK_DESCRIPTION]

## Commands
<!-- Fill from package.json scripts or Makefile -->

## Architecture
<!-- Key components, data flow, external services -->

## Key Directories
<!-- Main source directories and their purpose -->

## Conventions
- Maintain `LEARN.md` with architecture, rationale, bugs, pitfalls
```
