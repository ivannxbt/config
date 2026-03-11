# ai config

> personal configuration files for ai coding assistants. consistent ai behavior across all projects.

---

## installation

```bash
npx @ivannxbt/ai-config --all --yes
```

by default this installs the config folders directly into your home directory (`~`).

use `--link` to symlink instead of copy (updates sync automatically):

```bash
npx @ivannxbt/ai-config --all --link --yes
```

preview actions without changing files:

```bash
npx @ivannxbt/ai-config --all --dry-run --yes
```

install into another destination explicitly if you do not want `~`:

```bash
npx @ivannxbt/ai-config --all --yes /path/to/your/project
```

for local development or if you prefer cloning:

```bash
git clone https://github.com/ivannxbt/config.git
cd config
./install.sh /path/to/your/project
```

requires node.js 20 or newer.

on windows powershell:

```powershell
.\install.ps1 C:\path\to\your\project
```

`--link` still renders `.codex` as a local copy because codex config needs machine-local path rendering at install time.

### install paths

| use case | command |
|----------|---------|
| full config install in `~` | `npx @ivannxbt/ai-config --all --yes` |
| full config install in another folder | `npx @ivannxbt/ai-config --all --yes /path/to/project` |
| one reusable skill | `npx skills add https://github.com/ivannxbt/config --skill frontend-design` |
| all reusable skills | `npx skills add https://github.com/ivannxbt/config --all` |
| local repo workflow | `./install.sh /path/to/project` |

### installer flags

- `--all`: install every supported config folder
- `--link`: create directory links instead of copying
- `--yes` / `-y`: skip final confirmation
- `--dry-run`: print actions only, no filesystem changes
- `--force`: allow non-interactive execution
- `--no-backup`: disable backup-before-replace behavior

by default, existing destination folders are backed up into `.config-backup-YYYYMMDD-HHMMSS` before replacement.

ci validates the manifest, verifies the required directory structure from that manifest, runs `npm test`, and smoke-tests the installer in dry-run mode.

---

## what's inside

| folder | purpose |
|--------|---------|
| `.agent/` | lightweight agent configuration and skill links |
| `.agents/` | generic ai agent instructions (universal fallback for all tools) |
| `.claude/` | claude code config — agents, skills, commands, settings |
| `.cursor/` | cursor editor rules |
| `.codex/` | openai codex agent configuration |
| `.gemini/` | google gemini cli configuration |
| `.github/` | github copilot skills + issue/pr templates |

---

supported top-level config folders are defined in `configs.manifest.json`. add or rename folders there first so the installer, tests, and ci stay in sync.

---

## skills

skills extend ai capabilities with domain-specific knowledge. each tool folder contains its own copy of the skills so they work out of the box with any tool.

for codex, the repo tracks a shared `.codex/config.toml.template` with portable `{{HOME}}` placeholders only. the installer renders it to `.codex/config.toml` using the current user's home directory, while machine-local codex settings stay out of the repo.

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
- this path installs reusable skills only. it does not install full dotfolder config like `.codex`, `.cursor`, or `.claude`.

## publishing

publish the cli as a public scoped npm package so users can install without cloning:

```bash
npm publish --access public
```

verify the published package contents before release:

```bash
npm run pack:check
```

---

## license

mit
