#!/usr/bin/env node

import { runCli } from '../scripts/install.mjs';

runCli().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[ERROR] ${message}\n`);
  process.exit(1);
});
