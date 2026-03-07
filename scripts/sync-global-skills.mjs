#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, '..');

const DEFAULT_SOURCE_ORDER = [
  {
    id: 'codex',
    skillsDir: path.join(os.homedir(), '.codex', 'skills'),
    winsConflicts: false,
  },
  {
    id: 'agents',
    skillsDir: path.join(os.homedir(), '.agents', 'skills'),
    winsConflicts: true,
  },
];

const DEFAULT_EXCLUDED_SKILLS = new Set(['.system']);
const DEFAULT_EXCLUDED_ENTRIES = new Set([
  '.clawdhub',
  '.DS_Store',
  'Thumbs.db',
  'desktop.ini',
]);
const DEFAULT_CANONICAL_DIR = path.join(repoRoot, '.agents', 'skills');
const DEFAULT_DISTRIBUTION_TARGETS = [
  path.join(repoRoot, '.agent', 'skills'),
  path.join(repoRoot, '.claude', 'skills'),
  path.join(repoRoot, '.gemini', 'skills'),
  path.join(repoRoot, '.cursor', 'skills'),
  path.join(repoRoot, '.github', 'skills'),
  path.join(repoRoot, '.codex', 'skills'),
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function directoryExists(targetPath) {
  try {
    const stats = await fs.stat(targetPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function fileHash(filePath) {
  try {
    const contents = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(contents).digest('hex');
  } catch {
    return 'missing';
  }
}

async function listSkills(skillsDir, excludedSkills) {
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !excludedSkills.has(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

export async function mergeSkills({
  sourceOrder = DEFAULT_SOURCE_ORDER,
  excludedSkills = DEFAULT_EXCLUDED_SKILLS,
} = {}) {
  const merged = new Map();
  const conflicts = [];
  const missingSources = [];

  for (const source of sourceOrder) {
    const sourceExists = await directoryExists(source.skillsDir);
    if (!sourceExists) {
      missingSources.push(source.skillsDir);
      continue;
    }

    const skillNames = await listSkills(source.skillsDir, excludedSkills);
    for (const name of skillNames) {
      const skillPath = path.join(source.skillsDir, name);
      const skillMdHash = await fileHash(path.join(skillPath, 'SKILL.md'));
      const current = merged.get(name);

      if (!current) {
        merged.set(name, {
          name,
          sourceId: source.id,
          sourcePath: skillPath,
          skillMdHash,
        });
        continue;
      }

      if (current.skillMdHash !== skillMdHash) {
        conflicts.push({
          name,
          keptFrom: source.winsConflicts ? source.id : current.sourceId,
          replacedFrom: source.winsConflicts ? current.sourceId : source.id,
        });
      }

      if (source.winsConflicts) {
        merged.set(name, {
          name,
          sourceId: source.id,
          sourcePath: skillPath,
          skillMdHash,
        });
      }
    }
  }

  return { merged, conflicts, missingSources };
}

async function removeEntry(targetPath) {
  let stats;
  try {
    stats = await fs.lstat(targetPath);
  } catch {
    return;
  }

  try {
    await fs.chmod(targetPath, 0o666);
  } catch {
    // Best effort for Windows ACL/readonly edge cases.
  }

  if (stats.isDirectory() && !stats.isSymbolicLink()) {
    const children = await fs.readdir(targetPath);
    for (const child of children) {
      await removeEntry(path.join(targetPath, child));
    }
    await fs.rmdir(targetPath);
    return;
  }

  const maxAttempts = 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await fs.unlink(targetPath);
      return;
    } catch (error) {
      const code = error && typeof error === 'object' ? error.code : null;
      if ((code === 'EPERM' || code === 'EACCES') && attempt < maxAttempts) {
        await delay(75 * attempt);
        continue;
      }
      throw error;
    }
  }
}

async function recreateDirectory(targetPath) {
  await fs.mkdir(targetPath, { recursive: true });
  const entries = await fs.readdir(targetPath);
  for (const entry of entries) {
    await removeEntry(path.join(targetPath, entry));
  }
}

function shouldExcludeEntry(entryName, excludedEntries) {
  if (excludedEntries.has(entryName)) {
    return true;
  }
  if (entryName.startsWith('.git')) {
    return true;
  }
  return false;
}

async function copyDirectoryFiltered(sourcePath, destinationPath, excludedEntries) {
  await fs.mkdir(destinationPath, { recursive: true });
  const entries = await fs.readdir(sourcePath, { withFileTypes: true });

  for (const entry of entries) {
    if (shouldExcludeEntry(entry.name, excludedEntries)) {
      continue;
    }

    const sourceEntryPath = path.join(sourcePath, entry.name);
    const destinationEntryPath = path.join(destinationPath, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryFiltered(sourceEntryPath, destinationEntryPath, excludedEntries);
      continue;
    }

    if (entry.isSymbolicLink()) {
      continue;
    }

    await fs.copyFile(sourceEntryPath, destinationEntryPath);
  }
}

export async function syncCanonical(mergedSkills, {
  canonicalDir = DEFAULT_CANONICAL_DIR,
  excludedEntries = DEFAULT_EXCLUDED_ENTRIES,
} = {}) {
  await recreateDirectory(canonicalDir);

  const names = Array.from(mergedSkills.keys()).sort((a, b) => a.localeCompare(b));
  for (const name of names) {
    const sourcePath = mergedSkills.get(name).sourcePath;
    const destinationPath = path.join(canonicalDir, name);
    await copyDirectoryFiltered(sourcePath, destinationPath, excludedEntries);
  }

  return names;
}

export async function syncDistributions(skillNames, {
  canonicalDir = DEFAULT_CANONICAL_DIR,
  distributionTargets = DEFAULT_DISTRIBUTION_TARGETS,
} = {}) {
  for (const targetDir of distributionTargets) {
    await recreateDirectory(targetDir);
    for (const name of skillNames) {
      const canonicalSkillPath = path.join(canonicalDir, name);
      const destinationSkillPath = path.join(targetDir, name);
      await fs.cp(canonicalSkillPath, destinationSkillPath, { recursive: true, force: true });
    }
  }
}

export async function runSync({
  sourceOrder = DEFAULT_SOURCE_ORDER,
  excludedSkills = DEFAULT_EXCLUDED_SKILLS,
  excludedEntries = DEFAULT_EXCLUDED_ENTRIES,
  canonicalDir = DEFAULT_CANONICAL_DIR,
  distributionTargets = DEFAULT_DISTRIBUTION_TARGETS,
} = {}) {
  const { merged, conflicts, missingSources } = await mergeSkills({ sourceOrder, excludedSkills });

  if (merged.size === 0) {
    throw new Error('No skills found in ~/.agents/skills or ~/.codex/skills.');
  }

  const skillNames = await syncCanonical(merged, { canonicalDir, excludedEntries });
  await syncDistributions(skillNames, { canonicalDir, distributionTargets });

  return {
    skillNames,
    conflicts,
    missingSources,
    canonicalDir,
    distributionTargets,
  };
}

async function main() {
  const result = await runSync();
  process.stdout.write(`Synced ${result.skillNames.length} skills.\n`);
  process.stdout.write(`Canonical: ${result.canonicalDir}\n`);
  process.stdout.write(`Distributed copies: ${result.distributionTargets.length} target folders\n`);

  if (result.conflicts.length > 0) {
    process.stdout.write(`Conflicts resolved (${result.conflicts.length}) with ~/.agents precedence:\n`);
    for (const conflict of result.conflicts.sort((a, b) => a.name.localeCompare(b.name))) {
      process.stdout.write(`- ${conflict.name}: kept ${conflict.keptFrom}, replaced ${conflict.replacedFrom}\n`);
    }
  }

  if (result.missingSources.length > 0) {
    process.stdout.write('Missing source directories (skipped):\n');
    for (const sourceDir of result.missingSources) {
      process.stdout.write(`- ${sourceDir}\n`);
    }
  }
}

const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (executedPath && executedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`Failed to sync skills: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  });
}
