#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, '..');
  const skillsRoot = path.join(repoRoot, '.agents', 'skills');
  const repoUrl = process.env.SKILLS_REPO_URL || 'https://github.com/ivannxbt/config';

  const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
  const skills = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  process.stdout.write(`skills.sh install commands for ${repoUrl}\n\n`);
  process.stdout.write(`Install all:\n`);
  process.stdout.write(`npx skills add ${repoUrl} --all\n\n`);
  process.stdout.write(`Install one skill:\n`);
  for (const skill of skills) {
    process.stdout.write(`npx skills add ${repoUrl} --skill ${skill}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`Failed to build skills catalog: ${error.message}\n`);
  process.exit(1);
});
