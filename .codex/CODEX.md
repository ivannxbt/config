# OpenAI Codex Configuration

## Environment

### Project Setup
- **Language**: [Primary language(s)]
- **Runtime**: [Node.js, Python, etc. with versions]
- **Package Manager**: [npm, pip, cargo, etc.]
- **Build Tool**: [webpack, vite, make, etc.]

### Development Environment
```bash
# Setup commands
[Add setup instructions]

# Required tools
[List required tools and versions]
```

### Environment Variables
```bash
# List important environment variables
[Add environment variables]
```

## Guidelines

### Code Generation
- Generate code that follows project conventions
- Include necessary imports and dependencies
- Add type hints/annotations when applicable
- Generate tests alongside implementation code

### Code Completion
- Suggest idiomatic code for the language
- Prioritize readability over cleverness
- Use modern language features appropriately
- Consider performance implications

### Refactoring
- Maintain backwards compatibility unless specified
- Preserve existing functionality
- Update related tests and documentation
- Follow the project's architectural patterns

### Documentation
- Generate clear docstrings/comments
- Include parameter descriptions and return types
- Add usage examples for complex functions
- Document assumptions and limitations

### Error Handling
- Use language-specific error handling patterns
- Provide informative error messages
- Handle edge cases explicitly
- Log errors appropriately

### Security
- Validate user input
- Avoid hardcoded credentials
- Use parameterized queries for databases
- Follow security best practices for the language

## Best Practices

### Performance
- Choose appropriate data structures
- Avoid premature optimization
- Profile before optimizing
- Consider time and space complexity

### Maintainability
- Write modular, reusable code
- Keep functions focused and small
- Use meaningful names
- Minimize dependencies between modules

## Customization

Update this configuration with your specific project requirements, coding standards, and environment details.

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes