# Cursor Rules

## General Style Guidelines

### Code Formatting
- Use consistent indentation (2 or 4 spaces, no tabs)
- One statement per line
- Use semicolons consistently based on language conventions
- Add blank lines to separate logical sections

### Naming Conventions
- **Variables**: camelCase or snake_case (depending on language)
- **Functions**: camelCase or snake_case (depending on language)
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case or snake_case

### Comments and Documentation
- Add JSDoc/docstring comments for public functions
- Use inline comments sparingly and only for complex logic
- Keep comments up-to-date with code changes
- Document "why" not "what" when possible

## Code Quality

### Best Practices
- Write self-documenting code with clear names
- Keep functions small and focused (single responsibility)
- Avoid deep nesting (max 3-4 levels)
- Handle errors explicitly, don't ignore them
- Use early returns to reduce nesting

### Testing
- Write tests for new features
- Maintain existing test coverage
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

## File Organization

### Structure
- Group related files together
- Separate concerns (models, views, controllers, etc.)
- Keep configuration files at the project root
- Use index files for cleaner imports when appropriate

### Imports
- Order imports logically (built-ins, external, internal)
- Remove unused imports
- Use absolute paths when configured

## Git Conventions

### Commits
- Use clear, descriptive commit messages
- Start with a verb in present tense (Add, Fix, Update, Remove)
- Keep the first line under 72 characters
- Add details in the commit body when needed

### Branches
- Use descriptive branch names
- Follow naming convention: type/description (e.g., feature/user-auth)

## Customization

Modify these rules to match your project's specific requirements and team preferences.

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes