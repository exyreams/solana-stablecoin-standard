#!/usr/bin/env node
import { Command } from 'commander';
import {
  // Core operations
  initCommand,
  mintCommand,
  burnCommand,
  freezeCommand,
  thawCommand,
  pauseCommand,
  unpauseCommand,
  closeMintCommand,
  // Admin & management
  mintersCommand,
  rolesCommand,
  // Information & queries
  statusCommand,
  supplyCommand,
  holdersCommand,
  auditLogCommand,
  // Compliance (SSS-2)
  blacklistCommand,
  seizeCommand,
  hookCommand,
  // Privacy (SSS-3)
  privacyCommand,
  // Oracle
  oracleCommand,
  // TUI
  tuiCommand,
} from './commands';

const program = new Command();

program
  .name('sss-token')
  .description('Solana Stablecoin Standard — Admin CLI')
  .version('0.1.0')
  .option('-u, --url <url>', 'Solana RPC URL', process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com')
  .option('-k, --keypair <path>', 'Path to keypair file', process.env.SOLANA_KEYPAIR_PATH ?? '~/.config/solana/id.json')
  .option('-m, --mint <address>', 'Stablecoin mint address', process.env.STABLECOIN_MINT);

// ── Core operations ──────────────────────────────────────────────────────────
program.addCommand(initCommand());
program.addCommand(mintCommand());
program.addCommand(burnCommand());
program.addCommand(freezeCommand());
program.addCommand(thawCommand());
program.addCommand(pauseCommand());
program.addCommand(unpauseCommand());
program.addCommand(statusCommand());
program.addCommand(supplyCommand());
program.addCommand(closeMintCommand());

// ── Management ───────────────────────────────────────────────────────────────
program.addCommand(mintersCommand());
program.addCommand(rolesCommand());
program.addCommand(holdersCommand());
program.addCommand(auditLogCommand());

// ── SSS-2 compliance ─────────────────────────────────────────────────────────
program.addCommand(blacklistCommand());
program.addCommand(seizeCommand());
program.addCommand(hookCommand());

// ── SSS-3 privacy ────────────────────────────────────────────────────────────
program.addCommand(privacyCommand());

// ── Oracle ───────────────────────────────────────────────────────────────────
program.addCommand(oracleCommand());

// ── TUI ──────────────────────────────────────────────────────────────────────
program.addCommand(tuiCommand());

program.parseAsync(process.argv).catch((err) => {
  console.error(err.message);
  process.exit(1);
});