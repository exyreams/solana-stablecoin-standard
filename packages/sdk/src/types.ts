import { PublicKey } from '@solana/web3.js';

// ── Config Types ─────────────────────────────────────────────────────────────

export interface PresetConfig {
  enablePermanentDelegate: boolean;
  enableTransferHook: boolean;
  defaultAccountFrozen: boolean;
  enableConfidentialTransfers: boolean;
  confidentialTransferAutoApprove: boolean;
}

export interface CreateOptions {
  /** Use a pre-defined preset config (SSS_1, SSS_2, SSS_3). */
  preset?: PresetConfig;
  name: string;
  symbol: string;
  decimals?: number;
  uri?: string;

  // ── Direct extension flags (override preset or use standalone) ──────
  enablePermanentDelegate?: boolean;
  enableTransferHook?: boolean;
  defaultAccountFrozen?: boolean;
  enableConfidentialTransfers?: boolean;
  confidentialTransferAutoApprove?: boolean;

  // ── Extension-specific config ───────────────────────────────────────
  /** Transfer hook program ID (required for SSS-2). */
  transferHookProgramId?: PublicKey;
  /** Auditor ElGamal public key for confidential transfers (SSS-3). */
  auditorElGamalPubkey?: Buffer | Uint8Array | number[];

  // ── Deprecated — use top-level fields instead ───────────────────────
  extensions?: {
    permanentDelegate?: boolean;
    transferHook?: boolean;
    defaultAccountFrozen?: boolean;
  };
}

// ── Role Types ────────────────────────────────────────────────────────────────

/** Fields for update_roles instruction. All optional — only provided fields are updated. */
export interface RolesUpdate {
  burner?: PublicKey;
  pauser?: PublicKey;
  blacklister?: PublicKey;
  seizer?: PublicKey;
}

/** Parameters for update_minter instruction. */
export interface MinterUpdateOptions {
  minter: PublicKey;
  quota: bigint;
  active: boolean;
  resetMinted?: boolean;
}

// ── On-chain State Types ──────────────────────────────────────────────────────

export interface StablecoinStatus {
  version: number;
  mint: PublicKey;
  name: string;
  symbol: string;
  decimals: number;
  uri: string;
  paused: boolean;
  totalSupply: bigint;
  enablePermanentDelegate: boolean;
  enableTransferHook: boolean;
  defaultAccountFrozen: boolean;
  enableConfidentialTransfers: boolean;
  confidentialTransferAutoApprove: boolean;
}

export interface RolesStatus {
  masterAuthority: PublicKey;
  pendingMaster: PublicKey | null;
  burner: PublicKey;
  pauser: PublicKey;
  blacklister: PublicKey;
  seizer: PublicKey;
}

export interface MinterQuotaInfo {
  mint: PublicKey;
  minter: PublicKey;
  quota: bigint;
  minted: bigint;
  active: boolean;
}

export interface BlacklistEntry {
  mint: PublicKey;
  address: PublicKey;
  reason: string;
  timestamp: bigint;
}