#!/usr/bin/env node

import fs from 'node:fs/promises';
import fssync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const CONFIGS = [
  { key: '.agents', label: 'Generic AI agent instructions' },
  { key: '.claude', label: 'Claude AI configuration' },
  { key: '.cursor', label: 'Cursor editor rules' },
  { key: '.codex', label: 'OpenAI Codex configuration' },
  { key: '.gemini', label: 'Google Gemini CLI configuration' },
  { key: '.github', label: 'GitHub Copilot + templates' },
];

const isTty = Boolean(process.stdout.isTTY);
const COLORS = {
  reset: isTty ? '\x1b[0m' : '',
  blue: isTty ? '\x1b[34m' : '',
  green: isTty ? '\x1b[32m' : '',
  yellow: isTty ? '\x1b[33m' : '',
  red: isTty ? '\x1b[31m' : '',
};

function info(message) {
  process.stdout.write(`${COLORS.blue}[INFO]${COLORS.reset} ${message}\n`);
}

function ok(message) {
  process.stdout.write(`${COLORS.green}[OK]${COLORS.reset} ${message}\n`);
}

function warn(message) {
  process.stdout.write(`${COLORS.yellow}[WARN]${COLORS.reset} ${message}\n`);
}

function fail(message) {
  process.stderr.write(`${COLORS.red}[ERROR]${COLORS.reset} ${message}\n`);
}

function normalizeForCompare(value) {
  let normalized = path.normalize(path.resolve(value));
  if (process.platform === 'win32') {
    normalized = normalized.replace(/^\\\\\?\\/, '').toLowerCase();
  }
  return normalized;
}

function isRootPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const parsed = path.parse(resolved);
  return normalizeForCompare(resolved) === normalizeForCompare(parsed.root);
}

function isYes(input) {
  return /^y(es)?$/i.test((input || '').trim());
}

function nowStamp() {
  const date = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
}

export function parseArgs(argv) {
  const options = {
    all: false,
    link: false,
    yes: false,
    dryRun: false,
    force: false,
    backup: true,
    destination: '.',
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--all') {
      options.all = true;
    } else if (arg === '--link') {
      options.link = true;
    } else if (arg === '--yes' || arg === '-y') {
      options.yes = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--no-backup') {
      options.backup = false;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else if (options.destination !== '.') {
      throw new Error(`Unexpected argument: ${arg}`);
    } else {
      options.destination = arg;
    }
  }

  return options;
}

function showUsage() {
  process.stdout.write(`Usage: install [OPTIONS] [DESTINATION]

Install AI agent configurations into an existing destination folder.

Options:
  --all            Install all configurations without per-item prompts
  --link           Create symlinks (junctions on Windows) instead of copying
  --yes, -y        Skip final confirmation
  --dry-run        Print actions without modifying files
  --force          Allow non-interactive execution and overwrite existing configs
  --no-backup      Disable backup-before-replace behavior
  -h, --help       Show this help message

Examples:
  ./install.sh
  ./install.sh --all --yes ~/my-project
  ./install.sh --link --all --yes ~/my-project
  node scripts/install.mjs --all --dry-run /tmp/my-project
`);
}

async function pathExists(targetPath) {
  try {
    await fs.lstat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(targetPath) {
  try {
    const stats = await fs.stat(targetPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export function validateDestination(destination, repoRoot) {
  const resolvedDestination = path.resolve(destination);
  const resolvedRepoRoot = path.resolve(repoRoot);
  const resolvedHome = path.resolve(os.homedir());

  if (!fssync.existsSync(resolvedDestination)) {
    throw new Error(`Destination directory does not exist: ${destination}`);
  }

  if (!fssync.statSync(resolvedDestination).isDirectory()) {
    throw new Error(`Destination is not a directory: ${resolvedDestination}`);
  }

  if (isRootPath(resolvedDestination)) {
    throw new Error(`Refusing to install into filesystem root: ${resolvedDestination}`);
  }

  if (normalizeForCompare(resolvedDestination) === normalizeForCompare(resolvedHome)) {
    throw new Error(`Refusing to install into your home directory: ${resolvedDestination}`);
  }

  if (normalizeForCompare(resolvedDestination) === normalizeForCompare(resolvedRepoRoot)) {
    throw new Error(`Refusing to install into source repository: ${resolvedDestination}`);
  }

  return resolvedDestination;
}

async function resolveSelection(options, interactive, prompter) {
  if (options.all) {
    return CONFIGS.map((config) => config.key);
  }

  if (!interactive) {
    throw new Error('Non-interactive mode requires --all (or run in a TTY).');
  }

  const selected = [];
  for (const config of CONFIGS) {
    const answer = await prompter(`Install ${config.key} (${config.label})? [y/N]: `);
    if (isYes(answer)) {
      selected.push(config.key);
    }
  }
  return selected;
}

async function ensureBackupDirectory(backupDirectory, dryRun) {
  if (dryRun) {
    return;
  }
  await fs.mkdir(backupDirectory, { recursive: true });
}

async function backupExisting(destinationPath, backupDirectory, dryRun) {
  const targetName = path.basename(destinationPath);
  const backupPath = path.join(backupDirectory, targetName);
  const stats = await fs.lstat(destinationPath);

  if (dryRun) {
    info(`[dry-run] backup ${destinationPath} -> ${backupPath}`);
    return;
  }

  if (stats.isSymbolicLink()) {
    const linkTarget = await fs.readlink(destinationPath);
    await fs.writeFile(`${backupPath}.symlink.txt`, linkTarget, 'utf8');
    return;
  }

  await fs.cp(destinationPath, backupPath, { recursive: true, force: true });
}

function resolveLinkTarget(linkPath, linkValue) {
  if (path.isAbsolute(linkValue)) {
    return path.resolve(linkValue);
  }
  return path.resolve(path.dirname(linkPath), linkValue);
}

async function isLinkPointingTo(linkPath, expectedTarget) {
  let stats;
  try {
    stats = await fs.lstat(linkPath);
  } catch {
    return false;
  }

  if (!stats.isSymbolicLink()) {
    return false;
  }

  try {
    const linkValue = await fs.readlink(linkPath);
    const resolvedTarget = resolveLinkTarget(linkPath, linkValue);
    return normalizeForCompare(resolvedTarget) === normalizeForCompare(expectedTarget);
  } catch {
    return false;
  }
}

async function removePath(targetPath, dryRun) {
  if (dryRun) {
    info(`[dry-run] remove ${targetPath}`);
    return;
  }
  await fs.rm(targetPath, { recursive: true, force: true });
}

async function copyDirectory(sourcePath, destinationPath, dryRun) {
  if (dryRun) {
    info(`[dry-run] copy ${sourcePath} -> ${destinationPath}`);
    return;
  }
  await fs.cp(sourcePath, destinationPath, { recursive: true, force: true });
}

async function createDirectoryLink(sourcePath, destinationPath, dryRun) {
  if (dryRun) {
    info(`[dry-run] link ${destinationPath} -> ${sourcePath}`);
    return;
  }
  const linkType = process.platform === 'win32' ? 'junction' : 'dir';
  await fs.symlink(sourcePath, destinationPath, linkType);
}

export async function executeInstall({
  repoRoot,
  destination,
  selectedKeys,
  link,
  dryRun,
  backup,
}) {
  const normalizedSelected = new Set(selectedKeys);
  const summary = {
    installed: [],
    linked: [],
    skipped: [],
    warnings: [],
    backupDirectory: null,
  };

  const backupDirectory = path.join(destination, `.config-backup-${nowStamp()}`);
  let backupCreated = false;

  for (const config of CONFIGS) {
    if (!normalizedSelected.has(config.key)) {
      continue;
    }

    const sourcePath = path.join(repoRoot, config.key);
    const destinationPath = path.join(destination, config.key);
    const sourceExists = await isDirectory(sourcePath);

    if (!sourceExists) {
      const warning = `Source not found, skipping ${config.key}`;
      summary.warnings.push(warning);
      warn(warning);
      continue;
    }

    if (link) {
      const destinationExists = await pathExists(destinationPath);
      if (destinationExists) {
        const alreadyLinked = await isLinkPointingTo(destinationPath, sourcePath);
        if (alreadyLinked) {
          summary.skipped.push(config.key);
          info(`Already linked: ${config.key}`);
          continue;
        }
        if (backup) {
          if (!backupCreated) {
            await ensureBackupDirectory(backupDirectory, dryRun);
            backupCreated = true;
            summary.backupDirectory = backupDirectory;
            info(`${dryRun ? '[dry-run] would create' : 'Created'} backup directory: ${backupDirectory}`);
          }
          await backupExisting(destinationPath, backupDirectory, dryRun);
        }
        await removePath(destinationPath, dryRun);
      }

      await createDirectoryLink(sourcePath, destinationPath, dryRun);
      summary.linked.push(config.key);
      ok(`${dryRun ? '[dry-run] would link' : 'Linked'} ${config.key}`);
      continue;
    }

    const destinationExists = await pathExists(destinationPath);
    if (destinationExists && backup) {
      if (!backupCreated) {
        await ensureBackupDirectory(backupDirectory, dryRun);
        backupCreated = true;
        summary.backupDirectory = backupDirectory;
        info(`${dryRun ? '[dry-run] would create' : 'Created'} backup directory: ${backupDirectory}`);
      }
      await backupExisting(destinationPath, backupDirectory, dryRun);
    }

    if (destinationExists) {
      await removePath(destinationPath, dryRun);
    }
    await copyDirectory(sourcePath, destinationPath, dryRun);
    summary.installed.push(config.key);
    ok(`${dryRun ? '[dry-run] would copy' : 'Copied'} ${config.key}`);
  }

  return summary;
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    showUsage();
    return;
  }

  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDirectory, '..');
  const destination = validateDestination(options.destination, repoRoot);
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);

  if (!interactive && !options.force && !options.yes) {
    throw new Error('Non-interactive mode requires --force or --yes.');
  }

  if (options.force && !options.yes) {
    info('Using --force in non-interactive flow. Existing configs may be replaced.');
  }

  const rl = interactive
    ? readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
    : null;

  const prompt = async (message) => {
    if (!rl) {
      return '';
    }
    return rl.question(message);
  };

  try {
    info(`Source: ${repoRoot}`);
    info(`Destination: ${destination}`);
    info(`Mode: ${options.link ? 'link' : 'copy'}${options.dryRun ? ' (dry-run)' : ''}`);
    info(`Backup policy: ${options.backup ? 'enabled' : 'disabled'}`);

    const selectedKeys = await resolveSelection(options, interactive, prompt);
    if (selectedKeys.length === 0) {
      warn('No configuration selected. Nothing to do.');
      return;
    }

    if (!options.yes) {
      if (!interactive) {
        throw new Error('Final confirmation requires TTY. Use --yes for non-interactive execution.');
      }
      const confirmation = await prompt('Proceed with installation? [y/N]: ');
      if (!isYes(confirmation)) {
        info('Installation cancelled.');
        return;
      }
    }

    const summary = await executeInstall({
      repoRoot,
      destination,
      selectedKeys,
      link: options.link,
      dryRun: options.dryRun,
      backup: options.backup,
    });

    info('Installation complete.');
    if (summary.backupDirectory) {
      info(`Backups saved to: ${summary.backupDirectory}`);
    }
  } finally {
    if (rl) {
      rl.close();
    }
  }
}

const entryFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (entryFile && normalizeForCompare(fileURLToPath(import.meta.url)) === normalizeForCompare(entryFile)) {
  runCli().catch((error) => {
    fail(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
