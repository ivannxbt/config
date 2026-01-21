# AI Config 🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Centralized configuration repository for AI agents and development tools. Keep your AI assistant instructions consistent across all your projects.

## 📋 Description

This repository provides ready-to-use configuration templates for popular AI coding assistants and development tools. Instead of recreating instructions for each project, simply install these configurations and customize them to your needs.

## 📁 Structure

```
config/
├── .agents/          # Generic AI agent instructions
│   └── AGENTS.md
├── .claude/          # Claude AI configuration
│   └── CLAUDE.md
├── .cursor/          # Cursor editor rules
│   └── rules.md
├── .codex/           # OpenAI Codex configuration
│   └── CODEX.md
├── .gemini/          # Google Gemini configuration
│   └── GEMINI.md
├── .github/          # GitHub templates and workflows
│   ├── workflows/
│   │   └── validate.yml
│   ├── ISSUE_TEMPLATE.md
│   └── PULL_REQUEST_TEMPLATE.md
├── scripts/          # Installation and utility scripts
│   └── install.sh
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Quick Start

### Installation

Install configurations to your project using the install script:

```bash
# Clone this repository
git clone https://github.com/ivannxbt/config.git

# Run the installer
cd config
./scripts/install.sh /path/to/your/project
```

### Using with Symlinks

For development or if you want to keep configurations in sync across multiple projects:

```bash
./scripts/install.sh --link /path/to/your/project
```

## 📖 Usage

### Individual Configurations

#### .agents/ - Generic AI Agent Instructions
Generic guidelines for any AI coding assistant. Includes code quality standards, communication guidelines, and best practices.

**When to use:** As a base template for any AI agent or when you want consistent instructions across different AI tools.

#### .claude/ - Claude AI Configuration
Optimized instructions for Anthropic's Claude AI assistant.

**When to use:** When using Claude for development tasks. Helps Claude understand your project structure, code style, and preferences.

#### .cursor/ - Cursor Editor Rules
Configuration rules for the Cursor AI code editor.

**When to use:** If you're using Cursor as your primary IDE. These rules guide the AI assistant within Cursor.

#### .codex/ - OpenAI Codex Configuration
Instructions tailored for OpenAI Codex and GitHub Copilot.

**When to use:** When using GitHub Copilot or OpenAI Codex for code generation and completion.

#### .gemini/ - Google Gemini Configuration
Configuration for Google's Gemini AI assistant.

**When to use:** When using Gemini for development assistance. Includes detailed project context and preferences.

### GitHub Templates

The repository includes GitHub templates for consistent issue reporting and pull requests:

- **Issue Template**: Structured format for bug reports, feature requests, and improvements
- **PR Template**: Checklist-based template ensuring all changes are properly documented and tested
- **Validate Workflow**: Automatically validates configuration files on push and pull requests

## 🛠️ Script Usage Examples

### Basic Installation

Install to current directory with interactive selection:

```bash
./scripts/install.sh
```

### Install to Specific Directory

```bash
./scripts/install.sh ~/my-awesome-project
```

### Create Symlinks (Recommended for Development)

```bash
./scripts/install.sh --link ~/my-awesome-project
```

### Script Features

- ✅ Interactive configuration selection
- ✅ Automatic backup of existing configurations
- ✅ Copy or symlink modes
- ✅ Colorful terminal output with emojis
- ✅ Error handling and validation
- ✅ Cross-platform support (Linux/macOS)

## 🎨 Customization

After installation, customize the configurations for your project:

1. **Update Project Information**: Replace placeholders like `[Your Project Name]` with actual values
2. **Add Specific Guidelines**: Include project-specific coding standards and conventions
3. **Configure Commands**: Add your build, test, and deployment commands
4. **Set Preferences**: Adjust code style, architecture patterns, and tool preferences

### Example Customization

For `.claude/CLAUDE.md`:

```markdown
## Project Overview

- Project Name: My Awesome App
- Purpose: A revolutionary task management application
- Tech Stack: React, TypeScript, Node.js, PostgreSQL
- Target Environment: Web (responsive), iOS, Android
```

## 📝 License

MIT License

Copyright (c) 2026 ivannxbt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Make sure to:

- Follow the existing code style
- Update documentation as needed
- Test your changes
- Use the provided PR template

## 📞 Support

If you have questions or need help:

- Open an [issue](https://github.com/ivannxbt/config/issues)
- Check existing [discussions](https://github.com/ivannxbt/config/discussions)

## 🌟 Show Your Support

If you find this project helpful, please consider giving it a ⭐️!

---

Made with ❤️ by [ivannxbt](https://github.com/ivannxbt)
