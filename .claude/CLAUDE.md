# Claude AI Configuration

## Project Overview

This section should describe your project's purpose, main features, and technology stack.

**Example:**
- Project Name: [Your Project Name]
- Purpose: [Brief description of what this project does]
- Tech Stack: [Languages, frameworks, tools]
- Target Environment: [Development, production, etc.]

## Code Style

### General Principles
- Use consistent indentation (2 or 4 spaces)
- Maximum line length: 100 characters
- Use meaningful variable and function names
- Add comments for complex logic

### Language-Specific
- **JavaScript/TypeScript**: Use ES6+ features, async/await
- **Python**: Follow PEP 8 guidelines
- **Other**: [Add your language-specific conventions]

## Architecture

### Project Structure
```
[Describe your project structure here]
```

### Design Patterns
- [List key design patterns used]
- [Architectural decisions]
- [Important conventions]

### Dependencies
- Keep dependencies minimal and up-to-date
- Document why each major dependency is needed
- Prefer well-maintained libraries

## Commands

### Common Tasks
```bash
# Development
[Add your dev commands]

# Testing
[Add your test commands]

# Build
[Add your build commands]

# Deployment
[Add your deployment commands]
```

### Best Practices
- Always run tests before committing
- Use linting and formatting tools
- Follow the git workflow established in the project

## Customization

Replace the placeholder content above with your project-specific information and guidelines.

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes