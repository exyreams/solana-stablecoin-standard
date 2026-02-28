import { PresetConfig } from './types';

/**
 * SSS-1: Minimal Stablecoin
 * Mint authority + freeze authority + metadata.
 * No permanent delegate, no transfer hook.
 * Compliance is reactive (freeze accounts as needed).
 */
export const SSS_1: PresetConfig = {
    enablePermanentDelegate: false,
    enableTransferHook: false,
    defaultAccountFrozen: false,
};

/**
 * SSS-2: Compliant Stablecoin
 * SSS-1 + permanent delegate + transfer hook + blacklist enforcement.
 * For USDC/USDT-class regulated tokens. Every transfer checked on-chain.
 */
export const SSS_2: PresetConfig = {
    enablePermanentDelegate: true,
    enableTransferHook: true,
    defaultAccountFrozen: true,
};

export const Presets = {
    SSS_1,
    SSS_2,
} as const;

export type PresetName = keyof typeof Presets;
