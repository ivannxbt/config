import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { runSync } from '../scripts/sync-global-skills.mjs';

async function makeTempDir(prefix) {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

async function writeSkill(root, name, files) {
  for (const [relativePath, content] of Object.entries(files)) {
    const target = path.join(root, name, relativePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, 'utf8');
  }
}

function buildSources(root) {
  return [
    {
      id: 'codex',
      skillsDir: path.join(root, '.codex', 'skills'),
      winsConflicts: false,
    },
    {
      id: 'agents',
      skillsDir: path.join(root, '.agents', 'skills'),
      winsConflicts: true,
    },
  ];
}

function buildTargets(root) {
  return [
    path.join(root, '.agent', 'skills'),
    path.join(root, '.claude', 'skills'),
    path.join(root, '.gemini', 'skills'),
    path.join(root, '.cursor', 'skills'),
    path.join(root, '.github', 'skills'),
    path.join(root, '.codex', 'skills'),
  ];
}

test('runSync applies agents precedence and writes full directory copies', async () => {
  const root = await makeTempDir('skills-sync-');
  const sources = buildSources(root);
  const canonicalDir = path.join(root, 'repo', '.agents', 'skills');
  const distributionTargets = buildTargets(path.join(root, 'repo'));

  await writeSkill(sources[0].skillsDir, 'shared-skill', {
    'SKILL.md': 'codex version',
    'notes.txt': 'codex notes',
  });
  await writeSkill(sources[1].skillsDir, 'shared-skill', {
    'SKILL.md': 'agents version',
    'notes.txt': 'agents notes',
  });
  await writeSkill(sources[1].skillsDir, 'agents-only', {
    'SKILL.md': 'agents only skill',
  });

  const result = await runSync({
    sourceOrder: sources,
    canonicalDir,
    distributionTargets,
  });

  assert.equal(result.skillNames.length, 2);
  assert.ok(result.conflicts.some((entry) => entry.name === 'shared-skill'));

  const canonicalSkill = path.join(canonicalDir, 'shared-skill', 'SKILL.md');
  assert.equal(await fs.readFile(canonicalSkill, 'utf8'), 'agents version');

  const distributedSkillPath = path.join(distributionTargets[0], 'shared-skill');
  const distributedStat = await fs.stat(distributedSkillPath);
  assert.equal(distributedStat.isDirectory(), true);
  assert.equal(await fs.readFile(path.join(distributedSkillPath, 'SKILL.md'), 'utf8'), 'agents version');
});

test('runSync excludes metadata artifacts from canonical and distributed copies', async () => {
  const root = await makeTempDir('skills-sync-meta-');
  const sources = buildSources(root);
  const canonicalDir = path.join(root, 'repo', '.agents', 'skills');
  const distributionTargets = buildTargets(path.join(root, 'repo'));

  await writeSkill(sources[1].skillsDir, 'meta-skill', {
    'SKILL.md': 'metadata test',
    '.clawdhub/origin.json': '{"source":"test"}',
    '.DS_Store': 'noise',
  });

  await runSync({
    sourceOrder: sources,
    canonicalDir,
    distributionTargets,
  });

  await assert.rejects(fs.stat(path.join(canonicalDir, 'meta-skill', '.clawdhub')), { code: 'ENOENT' });
  await assert.rejects(fs.stat(path.join(canonicalDir, 'meta-skill', '.DS_Store')), { code: 'ENOENT' });
  await assert.rejects(
    fs.stat(path.join(distributionTargets[3], 'meta-skill', '.clawdhub', 'origin.json')),
    { code: 'ENOENT' },
  );
});

test('runSync exact mirror removes deleted skills on rerun', async () => {
  const root = await makeTempDir('skills-sync-delete-');
  const sources = buildSources(root);
  const canonicalDir = path.join(root, 'repo', '.agents', 'skills');
  const distributionTargets = buildTargets(path.join(root, 'repo'));

  await writeSkill(sources[1].skillsDir, 'stale-skill', {
    'SKILL.md': 'first version',
  });

  await runSync({
    sourceOrder: sources,
    canonicalDir,
    distributionTargets,
  });

  await fs.rm(path.join(sources[1].skillsDir, 'stale-skill'), { recursive: true, force: true });

  await writeSkill(sources[1].skillsDir, 'fresh-skill', {
    'SKILL.md': 'fresh version',
  });

  await runSync({
    sourceOrder: sources,
    canonicalDir,
    distributionTargets,
  });

  await assert.rejects(fs.stat(path.join(canonicalDir, 'stale-skill')), { code: 'ENOENT' });
  await assert.rejects(fs.stat(path.join(distributionTargets[5], 'stale-skill')), { code: 'ENOENT' });
  assert.equal(await fs.readFile(path.join(canonicalDir, 'fresh-skill', 'SKILL.md'), 'utf8'), 'fresh version');
});
