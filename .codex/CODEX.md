# OpenAI Codex Configuration

## Style & Communication

- Be direct and pragmatic. Substance over compliments.
- Explain what you're doing and why in plain language.
- Add comments to generated code — explain the "why", not just the "what".
- Keep responses concise. Skip filler words and shallow praise.

## Stack

- **Languages**: TypeScript (primary), JavaScript, Python
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Supabase, Postgres
- **Auth**: Better Auth
- **Animation**: Framer Motion (motion/react)
- **Video**: Remotion
- **Package Manager**: npm or bun

## Code Preferences

### JavaScript / TypeScript
- Use async/await — never raw `.then()` chains
- Prefer `const` / `let`, never `var`
- Enable strict mode
- Use TypeScript for all new files
- Arrow functions for callbacks, named functions for top-level declarations
- Functional components with hooks (no class components)

### Formatting
- 2-space indentation
- Single quotes
- Semicolons
- Trailing commas in multi-line structures

### Architecture
- Keep functions small and focused (single responsibility)
- Avoid deep nesting — use early returns
- No premature abstraction — three similar lines beats a helper no one needs
- Don't add error handling for scenarios that can't happen
- Trust framework guarantees; validate only at system boundaries (user input, external APIs)

### Don't Do
- No backwards-compatibility shims for code that isn't public
- No docstrings or type annotations added to code you didn't change
- No feature flags for simple changes
- No over-engineering

## Testing
- Write tests for new features
- Follow AAA: Arrange, Act, Assert
- Use descriptive test names

## Git
- Commit messages: imperative present tense ("Add", "Fix", "Update", "Remove")
- First line under 72 characters

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` — Navigate to page
2. `agent-browser snapshot -i` — Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` — Interact using refs
4. Re-snapshot after page changes
