import { PublicKey, Keypair } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { deriveBlacklistEntry, deriveRolesConfig, deriveStablecoinState } from '../client/accounts';
import { BlacklistEntry } from '../types';

export class ComplianceModule {
    constructor(
        private readonly program: Program,
        private readonly mint: PublicKey,
    ) { }

    /**
     * Add an address to the on-chain blacklist. SSS-2 only.
     * After this call, any transfer to/from this address will be rejected
     * by the transfer hook program.
     */
    async blacklistAdd(
        address: PublicKey,
        reason: string,
        blacklister: Keypair,
    ): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);
        const [entryPda] = deriveBlacklistEntry(this.mint, address, this.program.programId);

        return (this.program.methods as any)
            .addToBlacklist(reason)
            .accounts({
                blacklister: blacklister.publicKey,
                stablecoinState: statePda,
                rolesConfig: rolesPda,
                target: address,
                blacklistEntry: entryPda,
            })
            .signers([blacklister])
            .rpc();
    }

    /**
     * Remove an address from the blacklist. SSS-2 only.
     * The blacklist PDA is closed and rent returned to the blacklister.
     */
    async blacklistRemove(address: PublicKey, blacklister: Keypair): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);
        const [entryPda] = deriveBlacklistEntry(this.mint, address, this.program.programId);

        return (this.program.methods as any)
            .removeFromBlacklist()
            .accounts({
                blacklister: blacklister.publicKey,
                stablecoinState: statePda,
                rolesConfig: rolesPda,
                target: address,
                blacklistEntry: entryPda,
            })
            .signers([blacklister])
            .rpc();
    }

    /**
     * Seize tokens from an account into the treasury via permanent delegate. SSS-2 only.
     */
    async seize(options: {
        fromTokenAccount: PublicKey;
        toTokenAccount: PublicKey;
        amount: bigint;
        seizer: Keypair;
    }): Promise<string> {
        const [statePda] = deriveStablecoinState(this.mint, this.program.programId);
        const [rolesPda] = deriveRolesConfig(this.mint, this.program.programId);

        return (this.program.methods as any)
            .seize(new BN(options.amount.toString()))
            .accounts({
                seizer: options.seizer.publicKey,
                stablecoinState: statePda,
                rolesConfig: rolesPda,
                mint: this.mint,
                fromTokenAccount: options.fromTokenAccount,
                toTokenAccount: options.toTokenAccount,
                tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .signers([options.seizer])
            .rpc();
    }

    /** Check if a given address is currently blacklisted. */
    async isBlacklisted(address: PublicKey): Promise<boolean> {
        const [entryPda] = deriveBlacklistEntry(this.mint, address, this.program.programId);
        const info = await this.program.provider.connection.getAccountInfo(entryPda);
        return info !== null && info.lamports > 0;
    }

    /** Fetch the full blacklist entry details for an address. */
    async getBlacklistEntry(address: PublicKey): Promise<BlacklistEntry | null> {
        const [entryPda] = deriveBlacklistEntry(this.mint, address, this.program.programId);
        try {
            const entry = await (this.program.account as any).blacklistEntry.fetch(entryPda);
            return {
                mint: entry.mint,
                address: entry.address,
                reason: entry.reason,
                timestamp: BigInt(entry.timestamp.toString()),
            };
        } catch {
            return null;
        }
    }
}
