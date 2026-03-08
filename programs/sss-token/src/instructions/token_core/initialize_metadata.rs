use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_interface::Mint;

use crate::{errors::SssError, events::MetadataInitialized, state::StablecoinState};

/// Initialize on-mint Token-2022 metadata for an already-initialized stablecoin.
///
/// # Current Status: NO-OP
///
/// This instruction is currently a no-op due to Solana runtime limitations.
/// Token-2022 metadata initialization requires reallocating the mint account,
/// which is not supported via CPI (even across transaction boundaries).
///
/// # Metadata Storage
///
/// Token metadata (name, symbol, URI) is stored in the `StablecoinState` PDA
/// and can be queried from there. The MetadataPointer extension points to the
/// mint account, but the actual on-mint metadata fields remain uninitialized.
///
/// # Who can call this?
///
/// Only the `master_authority` stored in `roles_config`.
///
/// # Future Work
///
/// If Solana adds support for CPI realloc, this instruction can be updated
/// to actually initialize the on-mint metadata.
#[derive(Accounts)]
pub struct InitializeMetadata<'info> {
    /// Must be master authority (validated against roles_config).
    /// Also serves as payer for the mint account realloc.
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The stablecoin mint — must already exist (created by `initialize`).
    #[account(
        mut,
        constraint = mint.key() == stablecoin_state.mint @ SssError::InvalidMint,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// The stablecoin_state PDA — holds name/symbol/uri and signs the CPI.
    #[account(
        seeds = [b"stablecoin_state", mint.key().as_ref()],
        bump = stablecoin_state.bump,
    )]
    pub stablecoin_state: Account<'info, StablecoinState>,

    /// roles_config PDA — used to verify master_authority.
    #[account(
        seeds = [b"roles_config", mint.key().as_ref()],
        bump = roles_config.bump,
        constraint = roles_config.master_authority == authority.key() @ SssError::Unauthorized,
    )]
    pub roles_config: Account<'info, crate::state::RolesConfig>,

    pub token_program: Program<'info, Token2022>,

    /// Required by Token-2022 metadata instruction for realloc.
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeMetadata>) -> Result<()> {
    let state = &ctx.accounts.stablecoin_state;
    let mint_key = ctx.accounts.mint.key();

    // This is currently a no-op due to Solana CPI realloc limitations.
    // Metadata is stored in StablecoinState and can be queried from there.
    
    // Emit event for API compatibility
    emit!(MetadataInitialized {
        mint: mint_key,
        name: state.name.clone(),
        symbol: state.symbol.clone(),
        uri: state.uri.clone(),
        authority: ctx.accounts.authority.key(),
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
