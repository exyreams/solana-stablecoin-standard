import { Command } from 'commander';
import { Connection, PublicKey } from '@solana/web3.js';
import ora from 'ora';
import { SolanaStablecoin } from '@stbr/sss-token-sdk';
import { loadKeypair } from '../utils/keypair';
import { success, printTxLink, error, printTable } from '../utils/display';

export function blacklistCommand(): Command {
    const cmd = new Command('blacklist');
    cmd.description('Manage the SSS-2 on-chain blacklist');

    // blacklist add
    cmd
        .command('add <address>')
        .description('Add an address to the blacklist (SSS-2 only)')
        .requiredOption('--reason <reason>', 'Reason for blacklisting (e.g. OFAC match)')
        .action(async (address, opts, cmd) => {
            const globals = cmd.parent!.parent!.opts();
            const spinner = ora(`Blacklisting ${address}...`).start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const sig = await stable.compliance.blacklistAdd(
                    new PublicKey(address),
                    opts.reason,
                    authority,
                );
                spinner.succeed(`Address blacklisted: ${address}`);
                success(`Reason: ${opts.reason}`);
                printTxLink(sig);
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });

    // blacklist remove
    cmd
        .command('remove <address>')
        .description('Remove an address from the blacklist (SSS-2 only)')
        .action(async (address, opts, cmd) => {
            const globals = cmd.parent!.parent!.opts();
            const spinner = ora(`Removing ${address} from blacklist...`).start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const sig = await stable.compliance.blacklistRemove(new PublicKey(address), authority);
                spinner.succeed(`Address removed from blacklist: ${address}`);
                printTxLink(sig);
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });

    // blacklist check
    cmd
        .command('check <address>')
        .description('Check if an address is blacklisted')
        .action(async (address, opts, cmd) => {
            const globals = cmd.parent!.parent!.opts();
            const spinner = ora(`Checking ${address}...`).start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const entry = await stable.compliance.getBlacklistEntry(new PublicKey(address));
                spinner.stop();
                if (entry) {
                    printTable(
                        ['Field', 'Value'],
                        [
                            ['Status', '🔴 BLACKLISTED'],
                            ['Address', entry.address.toBase58()],
                            ['Reason', entry.reason],
                            ['Since', new Date(Number(entry.timestamp) * 1000).toISOString()],
                        ],
                    );
                } else {
                    success(`✅ ${address} is NOT blacklisted`);
                }
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });

    // seize
    cmd
        .command('seize <fromTokenAccount>')
        .description('Seize tokens from an account to treasury (SSS-2 only)')
        .requiredOption('--to <tokenAccount>', 'Treasury token account to receive seized funds')
        .requiredOption('--amount <amount>', 'Amount to seize')
        .action(async (fromTokenAccount, opts, cmd) => {
            const globals = cmd.parent!.parent!.opts();
            const spinner = ora(`Seizing tokens from ${fromTokenAccount}...`).start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const status = await stable.getStatus();
                const rawAmount = BigInt(Math.round(parseFloat(opts.amount) * 10 ** status.decimals));
                const sig = await stable.compliance.seize({
                    fromTokenAccount: new PublicKey(fromTokenAccount),
                    toTokenAccount: new PublicKey(opts.to),
                    amount: rawAmount,
                    seizer: authority,
                });
                spinner.succeed(`Seized ${opts.amount} ${status.symbol}`);
                printTxLink(sig);
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });

    return cmd;
}
