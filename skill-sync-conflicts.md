# Skill Sync Conflicts

These shared skills exist in both global config and `Proyectos/config`, and need explicit policy when a sync would replace repo copies with the current global versions.

## Status

- Sync policy: add missing directories and overwrite selected shared skills from global
- Overwrite policy for shared skill conflicts: global wins unless a repo-specific fork is intentionally preserved
- Current winner: global

## Latest sync

- Added the LangChain/LangGraph/Deep Agents skill set from global into `Proyectos/config/.agents/skills`
- Updated Codex template entries for the new LangChain-family skills
- Left `skills-lock.json` unchanged because source and hash metadata for these global-only skills is not recoverable from repo-tracked provenance

## Conflicts

### `building-native-ui`

- `SKILL.md` differs
- `references/form-sheet.md` differs

### `content-strategy`

- `SKILL.md` differs

### `native-data-fetching`

- `SKILL.md` differs
- `references/` exists only in `Proyectos/config`

### `programmatic-seo`

- `SKILL.md` differs

### `seo-audit`

- `SKILL.md` differs

### `supabase-postgres-best-practices`

- `README.md` exists only in `Proyectos/config`

### `vercel-react-best-practices`

- `AGENTS.md` differs
- `SKILL.md` differs
- `rules/advanced-init-once.md` exists only in global
- `rules/rendering-hydration-suppress-warning.md` exists only in global
- `rules/rerender-derived-state-no-effect.md` exists only in global
- `rules/rerender-move-effect-to-event.md` exists only in global
- `rules/rerender-use-ref-transient-values.md` exists only in global

### `vercel-react-native-skills`

- `README.md` exists only in `Proyectos/config`
