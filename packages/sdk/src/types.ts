import { PublicKey } from '@solana/web3.js';

// ── Config Types ─────────────────────────────────────────────────────────────

export interface StablecoinConfig {
    name: string;
    symbol: string;
    uri: string;
    decimals: number;
    enablePermanentDelegate: boolean;
    enableTransferHook: boolean;
    defaultAccountFrozen: boolean;
    transferHookProgramId?: PublicKey;
}

export interface CreateOptions {
    /** Use a pre-defined preset config. */
    preset?: PresetConfig;
    /** Override individual fields from the preset. */
    name: string;
    symbol: string;
    decimals?: number;
    uri?: string;
    /** Custom extension flags (used when no preset is given). */
    extensions?: {
        permanentDelegate?: boolean;
        transferHook?: boolean;
        defaultAccountFrozen?: boolean;
    };
    transferHookProgramId?: PublicKey;
}

export interface PresetConfig {
    enablePermanentDelegate: boolean;
    enableTransferHook: boolean;
    defaultAccountFrozen: boolean;
}

// ── Role Types ────────────────────────────────────────────────────────────────

export interface RolesUpdate {
    minter?: PublicKey;
    burner?: PublicKey;
    pauser?: PublicKey;
    blacklister?: PublicKey;
    seizer?: PublicKey;
}

export interface MinterQuotaOptions {
    quota: bigint; // 0n = unlimited
    active: boolean;
}

// ── On-chain State Types ──────────────────────────────────────────────────────

export interface StablecoinStatus {
    mint: PublicKey;
    name: string;
    symbol: string;
    decimals: number;
    paused: boolean;
    enablePermanentDelegate: boolean;
    enableTransferHook: boolean;
}

export interface RolesStatus {
    masterAuthority: PublicKey;
    pendingMaster: PublicKey | null;
    minter: PublicKey;
    burner: PublicKey;
    pauser: PublicKey;
    blacklister: PublicKey;
    seizer: PublicKey;
}

export interface BlacklistEntry {
    mint: PublicKey;
    address: PublicKey;
    reason: string;
    timestamp: bigint;
}
