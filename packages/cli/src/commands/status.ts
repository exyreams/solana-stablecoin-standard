import { Command } from 'commander';
import { Connection, PublicKey } from '@solana/web3.js';
import ora from 'ora';
import { SolanaStablecoin } from '@stbr/sss-token-sdk';
import { loadKeypair } from '../utils/keypair';
import { printTable, info } from '../utils/display';

export function statusCommand(): Command {
    const cmd = new Command('status');
    cmd
        .description('Show stablecoin status and total supply')
        .action(async (opts, cmd) => {
            const globals = cmd.parent!.opts();
            const spinner = ora('Fetching status...').start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);

                const [status, supply] = await Promise.all([
                    stable.getStatus(),
                    stable.getTotalSupply(),
                ]);

                spinner.stop();
                const humanSupply = (Number(supply) / 10 ** status.decimals).toLocaleString();

                printTable(
                    ['Field', 'Value'],
                    [
                        ['Mint', status.mint.toBase58()],
                        ['Name', status.name],
                        ['Symbol', status.symbol],
                        ['Decimals', String(status.decimals)],
                        ['Total Supply', `${humanSupply} ${status.symbol}`],
                        ['Paused', status.paused ? '🔴 YES' : '🟢 NO'],
                        ['Permanent Delegate', status.enablePermanentDelegate ? 'Enabled (SSS-2)' : 'Disabled'],
                        ['Transfer Hook', status.enableTransferHook ? 'Enabled (SSS-2)' : 'Disabled'],
                    ],
                );
            } catch (err: any) {
                spinner.fail(err.message);
                process.exit(1);
            }
        });
    return cmd;
}
