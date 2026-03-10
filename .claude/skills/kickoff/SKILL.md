---
name: kickoff
description: Scaffold a new project from a PRD, spec, or feature description. Use when the user pastes a spec/PRD and wants to start a new project, says "kickoff", "new project", "scaffold from this spec", or provides a document and says "implement this". Generates stack recommendation, phased plan, CLAUDE.md skeleton, and first PR scope.
---

# Kickoff

Transform a spec/PRD into an actionable project plan with scaffolding.

## Process

### 1. Analyze the Spec
Read the provided spec/PRD. Extract:
- **Core features** (must-have vs nice-to-have)
- **User types** (who uses it)
- **Data model** (entities and relationships)
- **External integrations** (APIs, auth providers, payments, etc.)
- **Non-functional requirements** (performance, i18n, offline, real-time)

### 2. Recommend Stack
Match to Iván's known stacks (prefer these over new ones):

| Need | Stack | When |
|------|-------|------|
| Mobile app | Expo 53 + expo-router + TanStack Query | Default for mobile |
| Web app (product) | Next.js 16 + Tailwind v4 | Default for web products |
| Landing/marketing | Next.js 16 + Supabase + Vercel | Default for marketing sites |
| API backend | NestJS 11 + Prisma + PostgreSQL | Default for custom APIs |
| Auth (mobile) | JWT + Passport via NestJS | Default for mobile auth |
| Auth (web) | Supabase Auth or Better Auth | Default for web auth |
| Data/AI analysis | Python + FastAPI + pandas + Azure OpenAI | Avvale work projects |
| Quick prototype | Expo or Next.js (skip backend) | Time-constrained |

If the spec calls for something outside these stacks, flag it and propose alternatives.

### 3. Phase Breakdown
Split into 3-5 phases, each shippable:

```
Phase 1: Foundation (always first)
  - Project scaffold + config
  - CLAUDE.md + LEARN.md
  - Core data model / schema
  - Basic navigation / routing

Phase 2: Core Feature
  - The primary user flow end-to-end
  - Minimum viable auth (if needed)

Phase 3: Polish & Secondary Features
  - Error handling, loading states
  - Secondary features from spec

Phase 4: Production Readiness (if applicable)
  - Testing, CI/CD
  - Monitoring, analytics
  - Deployment config
```

Adapt phases to the spec — don't force-fit. Each phase should be 1-3 PRs.

### 4. Generate Artifacts

Produce these as a single markdown document or as separate files:

**a) Project Plan** (`PLAN.md`)
- Phase breakdown with estimated PR count per phase
- Dependency graph between phases
- Risk flags (unknowns, hard parts)

**b) CLAUDE.md skeleton**
- Use `/init-nexxo` skill templates as base (read `~/.claude/skills/init-nexxo/references/templates.md`)
- Fill in project-specific sections from the spec

**c) First PR scope**
- Exact files to create in PR #1
- What to defer to PR #2+
- Acceptance criteria for PR #1

### 5. Present for Approval
Show the plan and ask:
- "Does this phase breakdown match your priorities?"
- "Any stack preferences I should override?"
- "Ready to start Phase 1?"

## Anti-patterns
- Don't start coding before the plan is approved
- Don't put everything in Phase 1
- Don't recommend unfamiliar stacks when a known one fits
- Don't skip the data model — it shapes everything downstream
