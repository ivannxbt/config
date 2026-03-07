# ai config

> personal configuration files for ai coding assistants. consistent ai behavior across all projects.

---

## what's inside

| folder | purpose |
|--------|---------|
| `.agents/` | generic ai agent instructions (universal fallback for all tools) |
| `.claude/` | claude code config — agents, skills, commands, settings |
| `.cursor/` | cursor editor rules |
| `.codex/` | openai codex agent configuration |
| `.gemini/` | google gemini cli configuration |
| `.github/` | github copilot skills + issue/pr templates |

---

## skills

skills extend ai capabilities with domain-specific knowledge. each tool folder contains its own copy of the skills so they work out of the box with any tool.

skills follow the open [agent skills standard](https://agentskills.io) — supported by claude code, cursor, gemini cli, openai codex, github copilot, and more.

| skill | description |
|-------|-------------|
| `agent-browser` | browser automation for web testing, form filling, screenshots, and data extraction |
| `better-auth-best-practices` | integration guide for better auth, the typescript authentication framework |
| `design-md` | analyze stitch projects and generate semantic design systems as design.md files |
| `frontend-design` | create distinctive, production-grade frontend interfaces with high design quality |
| `remotion-best-practices` | best practices for remotion, the react-based video creation library |
| `skill-creator` | guide for creating new skills that extend ai capabilities |
| `supabase-postgres-best-practices` | postgres performance optimization and best practices from supabase |
| `ui-skills` | opinionated constraints for building better interfaces with tailwind, animations, and accessibility |
| `vercel-react-best-practices` | react and next.js performance optimization guidelines from vercel |
| `web-design-guidelines` | review ui code for web interface guidelines compliance and accessibility |

### sync from global skills

to mirror your local global skills into this repo before pushing to github:

```bash
npm run skills:sync
```

sync behavior:
- sources: `~/.agents/skills` + `~/.codex/skills`
- precedence on conflicts: `~/.agents/skills` wins
- excluded: `~/.codex/skills/.system`
- filtered metadata: `.clawdhub`, `.DS_Store`, `Thumbs.db`, `desktop.ini`
- canonical mirror target: `.agents/skills` (exact mirror, including deletions)
- propagated full copies: `.agent/skills`, `.claude/skills`, `.gemini/skills`, `.cursor/skills`, `.github/skills`, `.codex/skills`

---

## skills.sh

this repo can be consumed directly with [skills.sh](https://skills.sh/):

```bash
npx skills add https://github.com/ivannxbt/config --all
```

or install a single skill:

```bash
npx skills add https://github.com/ivannxbt/config --skill frontend-design
```

generate commands for every available skill:

```bash
npm run skills:catalog
```

notes:
- keep the repo public so skills.sh users can install from github.
- installs happen client-side via `npx skills add ...`; there is no separate upload step in this repo.

---

## quick start

```bash
git clone https://github.com/ivannxbt/config.git
cd config
./install.sh /path/to/your/project
```

or run directly with node:

```bash
node scripts/install.mjs /path/to/your/project
```

on windows powershell:

```powershell
.\install.ps1 C:\path\to\your\project
```

use `--all` to skip per-config prompts and install everything at once:

```bash
./install.sh --all --yes /path/to/your/project
```

use `--link` to symlink instead of copy (updates sync automatically):

```bash
./install.sh --all --link --yes /path/to/your/project
```

preview actions without changing files:

```bash
./install.sh --all --dry-run /path/to/your/project
```

### installer flags

- `--all`: install every supported config folder
- `--link`: create directory links instead of copying
- `--yes` / `-y`: skip final confirmation
- `--dry-run`: print actions only, no filesystem changes
- `--force`: allow non-interactive execution
- `--no-backup`: disable backup-before-replace behavior

by default, existing destination folders are backed up into `.config-backup-YYYYMMDD-HHMMSS` before replacement.

---

## license

mit
