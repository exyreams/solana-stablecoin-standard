import { Command } from 'commander';
import { Connection, PublicKey } from '@solana/web3.js';
import ora from 'ora';
import { SolanaStablecoin } from '@stbr/sss-token-sdk';
import { loadKeypair } from '../utils/keypair';
import { success, printTxLink, error } from '../utils/display';

export function burnCommand(): Command {
    const cmd = new Command('burn');
    cmd
        .description('Burn tokens from a token account')
        .argument('<amount>', 'Amount to burn')
        .requiredOption('--from <tokenAccount>', 'Token account to burn from')
        .action(async (amount, opts, cmd) => {
            const globals = cmd.parent!.opts();
            const spinner = ora(`Burning ${amount} tokens...`).start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const stable = await SolanaStablecoin.load(connection, new PublicKey(globals.mint), authority);
                const status = await stable.getStatus();
                const rawAmount = BigInt(Math.round(parseFloat(amount) * 10 ** status.decimals));

                const sig = await stable.burn({
                    fromTokenAccount: new PublicKey(opts.from),
                    amount: rawAmount,
                });

                spinner.succeed(`Burned ${amount} ${status.symbol}`);
                printTxLink(sig);
            } catch (err: any) {
                spinner.fail('Burn failed');
                error(err.message);
                process.exit(1);
            }
        });
    return cmd;
}
