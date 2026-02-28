use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};
use crate::errors::HookError;

/// BlacklistEntry discriminator — must match the one in sss-token.
/// We check for PDA existence only; if the account has 0 lamports it doesn't exist.
const BLACKLIST_SEED: &[u8] = b"blacklist";

#[derive(Accounts)]
pub struct Execute<'info> {
    /// Source token account.
    pub source_token: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Mint.
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// Destination token account.
    pub destination_token: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Source owner (wallet).
    /// CHECK: Used only for PDA derivation / blacklist lookup.
    pub owner: UncheckedAccount<'info>,

    // Extra accounts injected by ExtraAccountMetaList:

    /// Blacklist entry PDA for the source owner (may or may not exist).
    /// CHECK: We check lamports to determine existence.
    pub source_blacklist_entry: UncheckedAccount<'info>,

    /// Blacklist entry PDA for the destination owner.
    /// CHECK: We check lamports to determine existence.
    pub destination_blacklist_entry: UncheckedAccount<'info>,
}

pub fn handler(ctx: Context<Execute>, _amount: u64) -> Result<()> {
    let source_entry = &ctx.accounts.source_blacklist_entry;
    let dest_entry = &ctx.accounts.destination_blacklist_entry;

    // An account exists on-chain if it has > 0 lamports.
    // If the blacklist PDA exists, the transfer is blocked.
    require!(
        source_entry.lamports() == 0,
        HookError::SourceBlacklisted
    );

    require!(
        dest_entry.lamports() == 0,
        HookError::DestinationBlacklisted
    );

    Ok(())
}
