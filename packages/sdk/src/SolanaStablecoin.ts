import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
    Program,
    AnchorProvider,
    Wallet,
    BN,
} from '@coral-xyz/anchor';
import {
    TOKEN_2022_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';

import { CreateOptions, RolesUpdate, MinterQuotaOptions, StablecoinStatus } from './types';
import { Presets } from './presets';
import { ComplianceModule } from './compliance/ComplianceModule';
import { deriveStablecoinState, deriveRolesConfig, deriveMinterQuota } from './client/accounts';

// IDL will be auto-imported from the Anchor build output
// eslint-disable-next-line @typescript-eslint/no-var-requires
const IDL = require('../../target/idl/sss_token.json');

export class SolanaStablecoin {
    private program: Program;
    private connection: Connection;
    private authority: Keypair;

    public readonly mint: PublicKey;
    public readonly compliance: ComplianceModule;

    private constructor(
        program: Program,
        connection: Connection,
        authority: Keypair,
        mint: PublicKey,
    ) {
        this.program = program;
        this.connection = connection;
        this.authority = authority;
        this.mint = mint;
        this.compliance = new ComplianceModule(program, mint);
    }

    // ── Factory ────────────────────────────────────────────────────────────────

    /**
     * Create a new stablecoin from a preset or custom config.
     *
     * @example
     * // SSS-2 preset
     * const stable = await SolanaStablecoin.create(connection, {
     *   preset: Presets.SSS_2,
     *   name: 'My Stablecoin',
     *   symbol: 'MYUSD',
     *   authority: adminKeypair,
     * });
     *
     * // Custom config
     * const custom = await SolanaStablecoin.create(connection, {
     *   name: 'Custom',
     *   symbol: 'CUSD',
     *   extensions: { permanentDelegate: true, transferHook: false },
     *   authority: adminKeypair,
     * });
     */
    static async create(
        connection: Connection,
        options: CreateOptions & { authority: Keypair; programId?: PublicKey },
    ): Promise<SolanaStablecoin> {
        const programId = options.programId ?? new PublicKey(IDL.metadata.address);
        const wallet = new Wallet(options.authority);
        const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
        const program = new Program(IDL, programId, provider);

        const preset = options.preset ?? Presets.SSS_1;
        const ext = options.extensions ?? {};

        // Generate a new mint keypair
        const mintKeypair = Keypair.generate();

        const config = {
            name: options.name,
            symbol: options.symbol,
            uri: options.uri ?? '',
            decimals: options.decimals ?? 6,
            enablePermanentDelegate: ext.permanentDelegate ?? preset.enablePermanentDelegate,
            enableTransferHook: ext.transferHook ?? preset.enableTransferHook,
            defaultAccountFrozen: ext.defaultAccountFrozen ?? preset.defaultAccountFrozen,
            transferHookProgramId: options.transferHookProgramId ?? null,
        };

        // Convert camelCase to the snake_case expected by Anchor IDL
        await (program.methods as any)
            .initialize({
                name: config.name,
                symbol: config.symbol,
                uri: config.uri,
                decimals: config.decimals,
                enablePermanentDelegate: config.enablePermanentDelegate,
                enableTransferHook: config.enableTransferHook,
                defaultAccountFrozen: config.defaultAccountFrozen,
                transferHookProgramId: config.transferHookProgramId,
            })
            .accounts({
                authority: options.authority.publicKey,
                mint: mintKeypair.publicKey,
                tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .signers([mintKeypair])
            .rpc();

        return new SolanaStablecoin(program, connection, options.authority, mintKeypair.publicKey);
    }

    /**
     * Load an existing stablecoin by mint address.
     */
    static async load(
        connection: Connection,
        mint: PublicKey,
        authority: Keypair,
        programId?: PublicKey,
    ): Promise<SolanaStablecoin> {
        const id = programId ?? new PublicKey(IDL.metadata.address);
        const wallet = new Wallet(authority);
        const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
        const program = new Program(IDL, id, provider);
        return new SolanaStablecoin(program, connection, authority, mint);
    }

    // ── Core Operations ────────────────────────────────────────────────────────

    async mint(options: { recipient: PublicKey; amount: bigint; minter?: Keypair }): Promise<string> {
        const minter = options.minter ?? this.authority;
        const ata = await getOrCreateAssociatedTokenAccount(
            this.connection,
            this.authority,
            this.mint,
            options.recipient,
            false,
            'confirmed',
            {},
            TOKEN_2022_PROGRAM_ID,
        );

        const [minterQuotaPda] = deriveMinterQuota(this.mint, minter.publicKey, this.program.programId);
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);

        return (this.program.methods as any)
            .mint(new BN(options.amount.toString()))
            .accounts({
                minter: minter.publicKey,
                stablecoinState: statePda,
                rolesConfig: rolesPda,
                minterQuota: minterQuotaPda,
                mint: this.mint,
                recipientTokenAccount: ata.address,
                tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .signers([minter])
            .rpc();
    }

    async burn(options: { fromTokenAccount: PublicKey; amount: bigint; burner?: Keypair }): Promise<string> {
        const burner = options.burner ?? this.authority;
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);

        return (this.program.methods as any)
            .burn(new BN(options.amount.toString()))
            .accounts({
                burner: burner.publicKey,
                stablecoinState: statePda,
                rolesConfig: rolesPda,
                mint: this.mint,
                fromTokenAccount: options.fromTokenAccount,
                tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .signers([burner])
            .rpc();
    }

    async freeze(tokenAccount: PublicKey): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);

        return (this.program.methods as any)
            .freezeAccount()
            .accounts({
                authority: this.authority.publicKey,
                stablecoinState: statePda,
                rolesConfig: rolesPda,
                mint: this.mint,
                targetAccount: tokenAccount,
                tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .signers([this.authority])
            .rpc();
    }

    async thaw(tokenAccount: PublicKey): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);

        return (this.program.methods as any)
            .thawAccount()
            .accounts({
                authority: this.authority.publicKey,
                stablecoinState: statePda,
                rolesConfig: rolesPda,
                mint: this.mint,
                targetAccount: tokenAccount,
                tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .signers([this.authority])
            .rpc();
    }

    async pause(): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);
        return (this.program.methods as any)
            .pause()
            .accounts({ pauser: this.authority.publicKey, stablecoinState: statePda, rolesConfig: rolesPda })
            .signers([this.authority])
            .rpc();
    }

    async unpause(): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);
        return (this.program.methods as any)
            .unpause()
            .accounts({ pauser: this.authority.publicKey, stablecoinState: statePda, rolesConfig: rolesPda })
            .signers([this.authority])
            .rpc();
    }

    async updateRoles(updates: RolesUpdate): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);
        return (this.program.methods as any)
            .updateRoles({
                minter: updates.minter ?? null,
                burner: updates.burner ?? null,
                pauser: updates.pauser ?? null,
                blacklister: updates.blacklister ?? null,
                seizer: updates.seizer ?? null,
            })
            .accounts({ authority: this.authority.publicKey, stablecoinState: statePda, rolesConfig: rolesPda })
            .signers([this.authority])
            .rpc();
    }

    async updateMinter(options: { minter: PublicKey } & MinterQuotaOptions): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);
        const [quotaPda] = deriveMinterQuota(this.mint, options.minter, this.program.programId);

        return (this.program.methods as any)
            .updateMinter(new BN(options.quota.toString()), options.active)
            .accounts({
                authority: this.authority.publicKey,
                stablecoinState: statePda,
                rolesConfig: rolesPda,
                minter: options.minter,
                minterQuota: quotaPda,
            })
            .signers([this.authority])
            .rpc();
    }

    // ── Queries ────────────────────────────────────────────────────────────────

    async getStatus(): Promise<StablecoinStatus> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const state = await (this.program.account as any).stablecoinState.fetch(statePda);
        return {
            mint: state.mint,
            name: state.name,
            symbol: state.symbol,
            decimals: state.decimals,
            paused: state.paused,
            enablePermanentDelegate: state.enablePermanentDelegate,
            enableTransferHook: state.enableTransferHook,
        };
    }

    async getTotalSupply(): Promise<bigint> {
        const info = await this.connection.getTokenSupply(this.mint);
        return BigInt(info.value.amount);
    }
}
