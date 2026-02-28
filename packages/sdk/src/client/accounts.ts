import { PublicKey } from '@solana/web3.js';

export const BLACKLIST_SEED = Buffer.from('blacklist');
export const STABLECOIN_STATE_SEED = Buffer.from('stablecoin_state');
export const ROLES_CONFIG_SEED = Buffer.from('roles_config');
export const MINTER_QUOTA_SEED = Buffer.from('minter_quota');

/** Derive the StablecoinState PDA for a given mint. */
export function deriveStablecoinState(
    mint: PublicKey,
    programId: PublicKey,
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [STABLECOIN_STATE_SEED, mint.toBuffer()],
        programId,
    );
}

/** Derive the RolesConfig PDA for a given mint. */
export function deriveRolesConfig(
    mint: PublicKey,
    programId: PublicKey,
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [ROLES_CONFIG_SEED, mint.toBuffer()],
        programId,
    );
}

/** Derive the MinterQuota PDA for a given (mint, minter) pair. */
export function deriveMinterQuota(
    mint: PublicKey,
    minter: PublicKey,
    programId: PublicKey,
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [MINTER_QUOTA_SEED, mint.toBuffer(), minter.toBuffer()],
        programId,
    );
}

/** Derive the BlacklistEntry PDA for a given (mint, address) pair. */
export function deriveBlacklistEntry(
    mint: PublicKey,
    address: PublicKey,
    programId: PublicKey,
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [BLACKLIST_SEED, mint.toBuffer(), address.toBuffer()],
        programId,
    );
}
