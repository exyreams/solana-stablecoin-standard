#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init';
import { mintCommand } from './commands/mint';
import { burnCommand } from './commands/burn';
import { freezeCommand } from './commands/freeze';
import { thawCommand } from './commands/thaw';
import { pauseCommand } from './commands/pause';
import { statusCommand } from './commands/status';
import { mintersCommand } from './commands/minters';
import { holdersCommand } from './commands/holders';
import { auditLogCommand } from './commands/audit-log';
import { blacklistCommand } from './commands/blacklist';

const program = new Command();

program
    .name('sss-token')
    .description('Solana Stablecoin Standard — Admin CLI')
    .version('0.1.0')
    .option('-u, --url <url>', 'Solana RPC URL', process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com')
    .option('-k, --keypair <path>', 'Path to keypair file', process.env.SOLANA_KEYPAIR_PATH ?? '~/.config/solana/id.json')
    .option('-m, --mint <address>', 'Stablecoin mint address', process.env.STABLECOIN_MINT);

program.addCommand(initCommand());
program.addCommand(mintCommand());
program.addCommand(burnCommand());
program.addCommand(freezeCommand());
program.addCommand(thawCommand());
program.addCommand(pauseCommand());
program.addCommand(statusCommand());
program.addCommand(mintersCommand());
program.addCommand(holdersCommand());
program.addCommand(auditLogCommand());
program.addCommand(blacklistCommand());

program.parseAsync(process.argv).catch((err) => {
    console.error(err.message);
    process.exit(1);
});
