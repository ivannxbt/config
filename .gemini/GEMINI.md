# Gemini AI Configuration

## Context

### Project Information
- **Name**: [Your Project Name]
- **Description**: [Brief description]
- **Domain**: [Web, Mobile, Data Science, etc.]
- **Stage**: [Development, Production, Maintenance]

### Technology Stack
- **Frontend**: [React, Vue, Angular, etc.]
- **Backend**: [Node.js, Python, Java, etc.]
- **Database**: [PostgreSQL, MongoDB, etc.]
- **Infrastructure**: [AWS, GCP, Azure, etc.]

### Team Structure
- **Team Size**: [Number of developers]
- **Roles**: [Frontend, Backend, Full-stack, DevOps]
- **Workflow**: [Agile, Scrum, Kanban, etc.]

## Preferences

### Code Style
- **Indentation**: [2 or 4 spaces]
- **Line Length**: [80, 100, or 120 characters]
- **Quotes**: [Single or double]
- **Trailing Commas**: [Yes/No]

### Language Features
- **JavaScript/TypeScript**:
  - Use async/await over promises
  - Prefer const/let over var
  - Use arrow functions when appropriate
  - Enable strict mode

- **Python**:
  - Follow PEP 8
  - Use type hints
  - Prefer list comprehensions when readable
  - Use context managers for resources

### Frameworks and Libraries
- **Preferred Libraries**: [List your go-to libraries]
- **Avoided Patterns**: [Anti-patterns to avoid]
- **State Management**: [Redux, Context, Zustand, etc.]
- **Styling**: [CSS Modules, Styled Components, Tailwind, etc.]

### Testing Strategy
- **Unit Tests**: [Jest, pytest, etc.]
- **Integration Tests**: [Cypress, Selenium, etc.]
- **Coverage Target**: [e.g., 80%]
- **Test Location**: [Co-located, separate test directory]

### Documentation
- **API Documentation**: [Swagger, JSDoc, etc.]
- **Code Comments**: [When and how to comment]
- **README Structure**: [Sections to include]
- **Changelog**: [Keep a CHANGELOG.md]

### Performance
- **Optimization Priority**: [Load time, runtime, memory]
- **Bundle Size**: [Target size if applicable]
- **Caching Strategy**: [Browser cache, CDN, etc.]
- **Lazy Loading**: [When to use]

### Accessibility
- **WCAG Level**: [A, AA, or AAA]
- **Screen Reader Support**: [Yes/No]
- **Keyboard Navigation**: [Requirements]
- **Color Contrast**: [Minimum ratio]

### Security
- **Authentication**: [JWT, OAuth, Session-based]
- **Authorization**: [RBAC, ABAC, etc.]
- **Input Validation**: [Client-side and server-side]
- **Dependency Scanning**: [Tools used]

## Workflow

### Development Process
1. Create feature branch from main/develop
2. Implement feature with tests
3. Run linters and tests locally
4. Create pull request with description
5. Address review comments
6. Merge after approval

### Code Review Guidelines
- Focus on logic and design
- Check for security issues
- Verify test coverage
- Ensure documentation is updated

### Deployment
- **CI/CD**: [GitHub Actions, Jenkins, etc.]
- **Environments**: [Dev, Staging, Production]
- **Deployment Frequency**: [On-demand, scheduled]
- **Rollback Strategy**: [How to handle failures]

## Customization

Customize this template with your specific preferences, project requirements, and team conventions.

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes