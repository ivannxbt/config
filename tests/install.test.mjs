import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { CONFIGS, executeInstall, parseArgs, validateDestination } from '../scripts/install.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(repoRoot, 'configs.manifest.json');
const codexTemplatePath = path.join(repoRoot, '.codex', 'config.toml.template');
const binPath = path.join(repoRoot, 'bin', 'ai-config.mjs');
const execFileAsync = promisify(execFile);

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

function expectedTomlHome() {
  return os.homedir().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

test('config list includes every supported top-level config', () => {
  const manifestConfigs = JSON.parse(fssync.readFileSync(manifestPath, 'utf8'));
  assert.deepEqual(CONFIGS, manifestConfigs);
});

test('manifest-backed config directories exist in repo', () => {
  for (const config of CONFIGS) {
    const configPath = path.join(repoRoot, config.key);
    assert.equal(fssync.existsSync(configPath), true, `${config.key} should exist`);
    assert.equal(fssync.statSync(configPath).isDirectory(), true, `${config.key} should be a directory`);
  }
});

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

test('parseArgs defaults destination to the current home directory', () => {
  const parsed = parseArgs([]);
  assert.equal(parsed.destination, os.homedir());
});

test('package metadata exposes a public npx cli and bundled config assets', () => {
  const pkg = JSON.parse(fssync.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  assert.equal(pkg.name, '@ivannxbt/ai-config');
  assert.equal(pkg.publishConfig.access, 'public');
  assert.equal(pkg.bin['ai-config'], './bin/ai-config.mjs');
  assert.ok(pkg.files.includes('scripts'));
  assert.ok(pkg.files.includes('configs.manifest.json'));
  for (const config of CONFIGS) {
    assert.ok(pkg.files.includes(config.key), `${config.key} should be packaged`);
  }
});

test('validateDestination allows home directory installs', () => {
  const home = os.homedir();
  assert.equal(validateDestination(home, path.join(home, 'other-repo')), path.resolve(home));
});

test('validateDestination rejects source repository path', async () => {
  const root = await makeTempDir('config-safety-');
  assert.throws(() => validateDestination(root, root), /source repository/i);
});

test('cli help is available through the publishable bin', async () => {
  const { stdout } = await execFileAsync(process.execPath, [binPath, '--help'], {
    cwd: repoRoot,
  });

  assert.match(stdout, /Usage: ai-config/i);
  assert.match(stdout, /--all/);
});

test('cli dry-run install works through the publishable bin', async () => {
  const destination = await makeTempDir('config-cli-dry-run-');
  const { stdout } = await execFileAsync(
    process.execPath,
    [binPath, '--all', '--dry-run', '--yes', destination],
    { cwd: repoRoot },
  );

  assert.match(stdout, /Destination:/);
  assert.match(stdout, /\[dry-run\] would copy \.agent/);
  assert.match(stdout, /Installation complete\./);
});

test('cli dry-run defaults destination to home when omitted', async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [binPath, '--all', '--dry-run', '--yes'],
    { cwd: repoRoot },
  );

  assert.match(stdout, new RegExp(`Destination: ${path.resolve(os.homedir()).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
});

test('executeInstall copies config and creates backup for existing destination', async () => {
  const { repoRoot, destination } = await setupRepoAndDestination();
  await fs.mkdir(path.join(repoRoot, '.agent'), { recursive: true });
  await fs.writeFile(path.join(repoRoot, '.agent', 'source.txt'), 'new-content', 'utf8');

  await fs.mkdir(path.join(destination, '.agent'), { recursive: true });
  await fs.writeFile(path.join(destination, '.agent', 'source.txt'), 'old-content', 'utf8');

  const summary = await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.agent'],
    link: false,
    dryRun: false,
    backup: true,
  });

  const replaced = await fs.readFile(path.join(destination, '.agent', 'source.txt'), 'utf8');
  assert.equal(replaced, 'new-content');
  assert.ok(summary.backupDirectory);

  const backupRootEntries = await fs.readdir(destination);
  const backupDirectory = backupRootEntries.find((entry) => entry.startsWith('.config-backup-'));
  assert.ok(backupDirectory);

  const backupFile = path.join(destination, backupDirectory, '.agent', 'source.txt');
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
  await fs.mkdir(path.join(repoRoot, '.github'), { recursive: true });
  await fs.writeFile(path.join(repoRoot, '.github', 'source.txt'), 'new-content', 'utf8');

  await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.github'],
    link: true,
    dryRun: false,
    backup: true,
  });

  const second = await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.github'],
    link: true,
    dryRun: false,
    backup: true,
  });

  assert.deepEqual(second.linked, []);
  assert.deepEqual(second.skipped, ['.github']);
});

test('executeInstall renders Codex skills config in copy mode', async () => {
  const { repoRoot, destination } = await setupRepoAndDestination();
  await fs.mkdir(path.join(repoRoot, '.codex'), { recursive: true });
  await fs.writeFile(
    path.join(repoRoot, '.codex', 'config.toml.template'),
    '[[skills.config]]\npath = "{{HOME}}/.agents/skills/example/SKILL.md"\nenabled = false\n',
    'utf8',
  );
  await fs.writeFile(path.join(repoRoot, '.codex', 'README.txt'), 'codex-assets', 'utf8');

  const summary = await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.codex'],
    link: false,
    dryRun: false,
    backup: true,
  });

  assert.deepEqual(summary.installed, ['.codex']);

  const rendered = await fs.readFile(path.join(destination, '.codex', 'config.toml'), 'utf8');
  assert.ok(rendered.includes(`path = "${expectedTomlHome()}/.agents/skills/example/SKILL.md"`));

  const copiedAsset = await fs.readFile(path.join(destination, '.codex', 'README.txt'), 'utf8');
  assert.equal(copiedAsset, 'codex-assets');

  await assert.rejects(fs.readFile(path.join(destination, '.codex', 'config.toml.template'), 'utf8'));
});

test('executeInstall renders LangChain-family Codex skills from template entries', async () => {
  const { repoRoot, destination } = await setupRepoAndDestination();
  await fs.mkdir(path.join(repoRoot, '.codex'), { recursive: true });
  await fs.writeFile(
    path.join(repoRoot, '.codex', 'config.toml.template'),
    [
      '[[skills.config]]',
      'path = "{{HOME}}/.agents/skills/framework-selection/SKILL.md"',
      'enabled = false',
      '',
      '[[skills.config]]',
      'path = "{{HOME}}/.agents/skills/langgraph-fundamentals/SKILL.md"',
      'enabled = false',
      '',
      '[[skills.config]]',
      'path = "{{HOME}}/.agents/skills/deep-agents-core/SKILL.md"',
      'enabled = false',
      '',
    ].join('\n'),
    'utf8',
  );

  await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.codex'],
    link: false,
    dryRun: false,
    backup: true,
  });

  const rendered = await fs.readFile(path.join(destination, '.codex', 'config.toml'), 'utf8');
  assert.ok(rendered.includes(`path = "${expectedTomlHome()}/.agents/skills/framework-selection/SKILL.md"`));
  assert.ok(rendered.includes(`path = "${expectedTomlHome()}/.agents/skills/langgraph-fundamentals/SKILL.md"`));
  assert.ok(rendered.includes(`path = "${expectedTomlHome()}/.agents/skills/deep-agents-core/SKILL.md"`));
});

test('executeInstall renders Codex skills config in link mode without creating a symlink', async () => {
  const { repoRoot, destination } = await setupRepoAndDestination();
  await fs.mkdir(path.join(repoRoot, '.codex'), { recursive: true });
  await fs.writeFile(
    path.join(repoRoot, '.codex', 'config.toml.template'),
    '[[skills.config]]\npath = "{{HOME}}/.codex/skills/example/SKILL.md"\nenabled = false\n',
    'utf8',
  );

  const summary = await executeInstall({
    repoRoot,
    destination,
    selectedKeys: ['.codex'],
    link: true,
    dryRun: false,
    backup: true,
  });

  assert.deepEqual(summary.linked, []);
  assert.deepEqual(summary.installed, ['.codex']);
  assert.ok(summary.warnings.some((warning) => warning.includes('rendered locally even in link mode')));

  const stats = await fs.lstat(path.join(destination, '.codex'));
  assert.equal(stats.isSymbolicLink(), false);

  const rendered = await fs.readFile(path.join(destination, '.codex', 'config.toml'), 'utf8');
  assert.ok(rendered.includes(`path = "${expectedTomlHome()}/.codex/skills/example/SKILL.md"`));
});

test('committed Codex template avoids repo-specific absolute paths', async () => {
  const template = await fs.readFile(codexTemplatePath, 'utf8');
  assert.doesNotMatch(template, /\/Proyectos\//);
  assert.doesNotMatch(template, /nexxo-web/);
  assert.doesNotMatch(template, /portfolio/);
});
