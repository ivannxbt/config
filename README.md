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

---

## quick start

```bash
git clone https://github.com/ivannxbt/config.git
cd config
./install.sh /path/to/your/project
```

use `--all` to skip prompts and install everything at once:

```bash
./install.sh --all /path/to/your/project
```

use `--link` to symlink instead of copy (updates sync automatically):

```bash
./install.sh --link /path/to/your/project
```

---

## license

mit
