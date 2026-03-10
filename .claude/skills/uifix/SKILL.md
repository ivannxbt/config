---
name: uifix
description: Fix visual/UI issues from a screenshot or numbered issue list. Use when the user says "fix this UI", "make it prettier", "these things are wrong", provides a screenshot with issues, or sends a numbered list of visual fixes. Handles one change at a time with verification after each.
---

# UI Fix

Fix visual issues sequentially with verification after each change.

## Process

### 1. Intake
- If screenshot provided: describe what you see, list issues
- If numbered list provided: create one todo per item
- If vague ("make it prettier"): ask for specifics or screenshot

### 2. Trace Component Tree (once)
Before any fix, map the render path:
- Identify the target component file
- Trace its parent layout/screen
- Identify the styling approach (Tailwind, StyleSheet, CSS modules, etc.)
- Note shared components that might be affected

This prevents re-exploring the same tree for each fix.

### 3. Fix Loop (per item)
For each issue, in order:

1. Mark todo `in_progress`
2. Read the target file
3. Make the minimal change
4. Read back the modified file — verify the logic is correct
5. If animation/transforms: trace the full render path to ensure no conflicts
6. Mark todo `completed`

### 4. Verification
After all fixes:
- Read each modified file once more
- Run lsp_diagnostics on changed files
- Report: "N fixes applied. [list of files changed]"

## Rules
- ONE change at a time — never batch multiple fixes in one edit
- Never refactor surrounding code while fixing
- If a fix requires changing a shared component, flag it before proceeding
- If unsure about a visual change, describe what you'd do and ask before editing
