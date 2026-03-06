import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { executeInstall, parseArgs, validateDestination } from '../scripts/install.mjs';

async function makeTempDir(prefix) {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

async function setupRepoAndDestination() {
  const root = await makeTempDir('config-installer-');
  const repoRoot = path.join(root, 'repo');
  const destination = path.join(root, 'dest');
  await fs.mkdir(repoRoot, { recursive: true });
  await fs.mkdir(destination, { recursive: true });
  return { root, repoRoot, destination };
}

test('parseArgs handles primary flags and destination', () => {
  const parsed = parseArgs(['--all', '--link', '--yes', '--dry-run', '--force', '--no-backup', 'C:\\tmp']);
  assert.equal(parsed.all, true);
  assert.equal(parsed.link, true);
  assert.equal(parsed.yes, true);
  assert.equal(parsed.dryRun, true);
  assert.equal(parsed.force, true);
  assert.equal(parsed.backup, false);
  assert.equal(parsed.destination, 'C:\\tmp');
});

test('validateDestination rejects home directory', () => {
  const home = os.homedir();
  assert.throws(() => validateDestination(home, path.join(home, 'other-repo')), /home directory/i);
});

test('validateDestination rejects source repository path', async () => {
  const root = await makeTempDir('config-safety-');
  assert.throws(() => validateDestination(root, root), /source repository/i);
});

test('executeInstall copies config and creates backup for existing destination', async () => {
  const { repoRoot, destination } = await setupRepoAndDestination();
  await fs.mkdir(path.join(repoRoot, '.agents'), { recursive: true });
  await fs.writeFile(path.join(repoRoot, '.agents', 'source.txt'), 'new-content', 'utf8');

  await fs.mkdir(path.join(destination, '.agents'), { recursive: true });
  await fs.writeFile(path.join(destination, '.agents', 'source.txt'), 'old-content', 'utf8');

  const summary = await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.agents'],
    link: false,
    dryRun: false,
    backup: true,
  });

  const replaced = await fs.readFile(path.join(destination, '.agents', 'source.txt'), 'utf8');
  assert.equal(replaced, 'new-content');
  assert.ok(summary.backupDirectory);

  const backupRootEntries = await fs.readdir(destination);
  const backupDirectory = backupRootEntries.find((entry) => entry.startsWith('.config-backup-'));
  assert.ok(backupDirectory);

  const backupFile = path.join(destination, backupDirectory, '.agents', 'source.txt');
  const backupContent = await fs.readFile(backupFile, 'utf8');
  assert.equal(backupContent, 'old-content');
});

test('executeInstall dry-run does not modify destination files', async () => {
  const { repoRoot, destination } = await setupRepoAndDestination();
  await fs.mkdir(path.join(repoRoot, '.agents'), { recursive: true });
  await fs.writeFile(path.join(repoRoot, '.agents', 'source.txt'), 'new-content', 'utf8');

  await fs.mkdir(path.join(destination, '.agents'), { recursive: true });
  await fs.writeFile(path.join(destination, '.agents', 'source.txt'), 'old-content', 'utf8');

  await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.agents'],
    link: false,
    dryRun: true,
    backup: true,
  });

  const current = await fs.readFile(path.join(destination, '.agents', 'source.txt'), 'utf8');
  assert.equal(current, 'old-content');

  const entries = await fs.readdir(destination);
  const backupDirectory = entries.find((entry) => entry.startsWith('.config-backup-'));
  assert.equal(backupDirectory, undefined);
});

test('executeInstall link mode is idempotent when target already linked', async () => {
  const { repoRoot, destination } = await setupRepoAndDestination();
  await fs.mkdir(path.join(repoRoot, '.agents'), { recursive: true });
  await fs.writeFile(path.join(repoRoot, '.agents', 'source.txt'), 'new-content', 'utf8');

  await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.agents'],
    link: true,
    dryRun: false,
    backup: true,
  });

  const second = await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.agents'],
    link: true,
    dryRun: false,
    backup: true,
  });

  assert.deepEqual(second.linked, []);
  assert.deepEqual(second.skipped, ['.agents']);
});
