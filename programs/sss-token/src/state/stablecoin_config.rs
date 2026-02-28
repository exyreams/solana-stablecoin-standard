use anchor_lang::prelude::*;

/// Central configuration stored on-chain for the stablecoin.
/// Initialized once; most fields are immutable after init (except paused/roles).
#[account]
#[derive(Default)]
pub struct StablecoinState {
    /// The mint address this config governs.
    pub mint: Pubkey,
    /// Human-readable name (e.g. "My Stablecoin").
    pub name: String,
    /// Ticker symbol (e.g. "MYUSD").
    pub symbol: String,
    /// Number of decimal places.
    pub decimals: u8,
    /// Token-2022 metadata URI.
    pub uri: String,

    // ── SSS-2 feature flags (set at init, immutable after) ──────────────
    /// Whether the permanent delegate extension is enabled (SSS-2).
    pub enable_permanent_delegate: bool,
    /// Whether the transfer hook extension is enabled (SSS-2).
    pub enable_transfer_hook: bool,
    /// Whether newly created token accounts start frozen (SSS-2).
    pub default_account_frozen: bool,

    // ── Runtime state ────────────────────────────────────────────────────
    /// Whether minting/burning is paused globally.
    pub paused: bool,
    /// Total supply tracking (updated on mint/burn).
    pub total_supply: u64,
    /// PDA bump.
    pub bump: u8,
}

impl StablecoinState {
    /// Account discriminator + fields.
    /// String fields: name (max 32), symbol (max 10), uri (max 200).
    pub const LEN: usize = 8   // discriminator
        + 32                   // mint
        + 4 + 32               // name (len prefix + max 32 bytes)
        + 4 + 10               // symbol
        + 1                    // decimals
        + 4 + 200              // uri
        + 1                    // enable_permanent_delegate
        + 1                    // enable_transfer_hook
        + 1                    // default_account_frozen
        + 1                    // paused
        + 8                    // total_supply
        + 1;                   // bump
}
