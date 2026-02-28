import { PresetConfig } from './types';

/**
 * SSS-1: Minimal Stablecoin
 * Mint authority + freeze authority + metadata.
 * No permanent delegate, no transfer hook, no confidential transfers.
 * Compliance is reactive (freeze accounts as needed).
 */
export const SSS_1: PresetConfig = {
  enablePermanentDelegate: false,
  enableTransferHook: false,
  defaultAccountFrozen: false,
  enableConfidentialTransfers: false,
  confidentialTransferAutoApprove: false,
};

/**
 * SSS-2: Compliant Stablecoin
 * SSS-1 + permanent delegate + transfer hook + blacklist enforcement.
 * For USDC/USDT-class regulated tokens. Every transfer checked on-chain.
 */
export const SSS_2: PresetConfig = {
  enablePermanentDelegate: true,
  enableTransferHook: true,
  defaultAccountFrozen: false,
  enableConfidentialTransfers: false,
  confidentialTransferAutoApprove: false,
};

/**
 * SSS-3: Private Stablecoin
 * SSS-1 + confidential transfers via ElGamal encryption.
 * Transfer amounts are encrypted. Optional auditor can decrypt.
 */
export const SSS_3: PresetConfig = {
  enablePermanentDelegate: false,
  enableTransferHook: false,
  defaultAccountFrozen: false,
  enableConfidentialTransfers: true,
  confidentialTransferAutoApprove: false,
};

export const Presets = {
  SSS_1,
  SSS_2,
  SSS_3,
} as const;

export type PresetName = keyof typeof Presets;