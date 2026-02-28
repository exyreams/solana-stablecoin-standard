import { Command } from 'commander';
import { Connection, PublicKey } from '@solana/web3.js';
import ora from 'ora';
import { SolanaStablecoin, Presets } from '@stbr/sss-token-sdk';
import { loadKeypair } from '../utils/keypair';
import { success, printTxLink, error } from '../utils/display';

export function initCommand(): Command {
    const cmd = new Command('init');
    cmd
        .description('Initialize a new stablecoin mint')
        .option('--preset <preset>', 'Preset to use: sss-1 or sss-2', 'sss-1')
        .option('--custom <file>', 'Path to custom TOML/JSON config file')
        .requiredOption('--name <name>', 'Token name')
        .requiredOption('--symbol <symbol>', 'Token symbol')
        .option('--decimals <n>', 'Decimal places', '6')
        .option('--uri <uri>', 'Metadata URI', '')
        .action(async (opts, cmd) => {
            const globals = cmd.parent!.opts();
            const spinner = ora('Initializing stablecoin...').start();
            try {
                const authority = loadKeypair(globals.keypair);
                const connection = new Connection(globals.url, 'confirmed');
                const preset = opts.preset === 'sss-2' ? Presets.SSS_2 : Presets.SSS_1;

                const stable = await SolanaStablecoin.create(connection, {
                    preset,
                    name: opts.name,
                    symbol: opts.symbol,
                    decimals: parseInt(opts.decimals),
                    uri: opts.uri,
                    authority,
                });

                spinner.succeed('Stablecoin initialized!');
                success(`Mint address: ${stable.mint.toBase58()}`);
                success(`Preset:       ${opts.preset.toUpperCase()}`);
                console.log('\nSet this as your default mint:');
                console.log(`  export STABLECOIN_MINT=${stable.mint.toBase58()}`);
            } catch (err: any) {
                spinner.fail('Initialization failed');
                error(err.message);
                process.exit(1);
            }
        });
    return cmd;
}
