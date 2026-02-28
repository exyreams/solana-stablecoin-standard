import { Command } from 'commander';
import { Connection, PublicKey } from '@solana/web3.js';
import ora from 'ora';
import { SolanaStablecoin } from '@stbr/sss-token-sdk';
import { loadKeypair } from '../utils/keypair';
import { success, printTxLink, error, printTable } from '../utils/display';

export function mintersCommand(): Command {
    const cmd = new Command('minters');
    cmd.description('Manage minters and their quotas');

    cmd
        .command('add <minterAddress>')
        .description('Register a new minter with an optional quota (0 = unlimited)')
        .option('--quota <amount>', 'Max tokens this minter can mint (0 = unlimited)', '0')
        .action(async (minterAddress, opts, cmd) => {
            const globals = cmd.parent!.parent!.opts();
            const spinner = ora('Adding minter...').start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const status = await stable.getStatus();
                const rawQuota = BigInt(Math.round(parseFloat(opts.quota) * 10 ** status.decimals));
                const sig = await stable.updateMinter({
                    minter: new PublicKey(minterAddress),
                    quota: rawQuota,
                    active: true,
                });
                spinner.succeed(`Minter added: ${minterAddress}`);
                printTxLink(sig);
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });

    cmd
        .command('remove <minterAddress>')
        .description('Deactivate a minter')
        .action(async (minterAddress, opts, cmd) => {
            const globals = cmd.parent!.parent!.opts();
            const spinner = ora('Removing minter...').start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const sig = await stable.updateMinter({
                    minter: new PublicKey(minterAddress),
                    quota: 0n,
                    active: false,
                });
                spinner.succeed(`Minter deactivated: ${minterAddress}`);
                printTxLink(sig);
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });

    return cmd;
}

export function holdersCommand(): Command {
    const cmd = new Command('holders');
    cmd
        .description('List token holders')
        .option('--min-balance <amount>', 'Minimum balance filter', '0')
        .action(async (opts, cmd) => {
            const globals = cmd.parent!.opts();
            const spinner = ora('Fetching holders...').start();
            try {
                const connection = new Connection(globals.url, 'confirmed');
                const mint = new PublicKey(globals.mint);
                const { TOKEN_2022_PROGRAM_ID } = await import('@solana/spl-token');
                const accounts = await connection.getTokenAccountsByOwner(mint, {
                    programId: TOKEN_2022_PROGRAM_ID,
                });
                spinner.stop();
                const rows = accounts.value.map((a) => [
                    a.pubkey.toBase58(),
                    a.account.lamports.toString(),
                ]);
                printTable(['Token Account', 'Lamports (raw)'], rows.length ? rows : [['No holders found', '']]);
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });
    return cmd;
}

export function auditLogCommand(): Command {
    const cmd = new Command('audit-log');
    cmd
        .description('Display on-chain audit log via program event logs')
        .option('--action <type>', 'Filter by action type (mint|burn|freeze|blacklist)')
        .option('--limit <n>', 'Max events to show', '50')
        .action(async (opts, cmd) => {
            const globals = cmd.parent!.opts();
            const spinner = ora('Fetching audit log...').start();
            try {
                const connection = new Connection(globals.url, 'confirmed');
                const mint = new PublicKey(globals.mint);
                // Fetch recent signatures for the mint account
                const sigs = await connection.getSignaturesForAddress(mint, { limit: parseInt(opts.limit) });
                spinner.stop();
                const rows = sigs.map((s) => [
                    s.signature.slice(0, 20) + '...',
                    s.blockTime ? new Date(s.blockTime * 1000).toISOString() : 'N/A',
                    s.err ? 'FAILED' : 'OK',
                ]);
                printTable(['Signature', 'Time', 'Status'], rows);
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });
    return cmd;
}
