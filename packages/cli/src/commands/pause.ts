import { Command } from 'commander';
import { Connection, PublicKey } from '@solana/web3.js';
import ora from 'ora';
import { SolanaStablecoin } from '@stbr/sss-token-sdk';
import { loadKeypair } from '../utils/keypair';
import { success, printTxLink, error } from '../utils/display';

export function pauseCommand(): Command {
    const pause = new Command('pause');
    pause
        .description('Pause all minting and burning')
        .action(async (opts, cmd) => {
            const globals = cmd.parent!.opts();
            const spinner = ora('Pausing stablecoin...').start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const sig = await stable.pause();
                spinner.succeed('Stablecoin paused');
                printTxLink(sig);
            } catch (err: any) {
                spinner.fail(err.message);
                error(err.message);
                process.exit(1);
            }
        });

    const unpause = new Command('unpause');
    unpause
        .description('Resume minting and burning')
        .action(async (opts, cmd) => {
            const globals = cmd.parent!.opts();
            const spinner = ora('Unpausing stablecoin...').start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const sig = await stable.unpause();
                spinner.succeed('Stablecoin unpaused');
                printTxLink(sig);
            } catch (err: any) {
                spinner.fail(err.message);
                error(err.message);
                process.exit(1);
            }
        });

    // Return the pause command; unpause is registered separately
    // Store reference for index.ts to add unpause too.
    (pause as any)._unpause = unpause;
    return pause;
}
