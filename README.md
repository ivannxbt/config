# ai config

> personal configuration files for ai coding assistants. consistent ai behavior across all projects.

---

## what's inside

| folder | purpose |
|--------|---------|
| `.agents/` | generic ai agent instructions |
| `.claude/` | claude ai config |
| `.cursor/` | cursor editor rules |
| `.codex/` | openai codex / github copilot config |
| `.gemini/` | google gemini config |
| `.github/` | issue and pr templates |

---

## skills

skills extend ai capabilities with domain-specific knowledge. located in `.claude/skills/` and symlinked to other folders.

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
./scripts/install.sh /path/to/your/project
```

use `--link` to symlink instead of copy (updates sync automatically).

---

## license

mit
