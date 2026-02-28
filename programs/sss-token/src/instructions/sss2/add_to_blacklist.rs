use anchor_lang::prelude::*;
use crate::{
    errors::SssError,
    events::AddedToBlacklist,
    state::{BlacklistEntry, RolesConfig, StablecoinState},
};

#[derive(Accounts)]
#[instruction(reason: String)]
pub struct AddToBlacklist<'info> {
    #[account(mut)]
    pub blacklister: Signer<'info>,

    #[account(seeds = [b"stablecoin_state", stablecoin_state.mint.as_ref()], bump = stablecoin_state.bump)]
    pub stablecoin_state: Account<'info, StablecoinState>,

    #[account(seeds = [b"roles_config", stablecoin_state.mint.as_ref()], bump = roles_config.bump)]
    pub roles_config: Account<'info, RolesConfig>,

    /// CHECK: the address being blacklisted.
    pub target: UncheckedAccount<'info>,

    /// Blacklist entry PDA — created by this call.
    #[account(
        init,
        payer = blacklister,
        space = BlacklistEntry::LEN,
        seeds = [BlacklistEntry::SEED, stablecoin_state.mint.as_ref(), target.key().as_ref()],
        bump,
    )]
    pub blacklist_entry: Account<'info, BlacklistEntry>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AddToBlacklist>, reason: String) -> Result<()> {
    let state = &ctx.accounts.stablecoin_state;
    let roles = &ctx.accounts.roles_config;

    require!(state.enable_transfer_hook, SssError::ComplianceNotEnabled);
    require!(
        ctx.accounts.blacklister.key() == roles.blacklister
            || ctx.accounts.blacklister.key() == roles.master_authority,
        SssError::NotBlacklister
    );

    let clock = Clock::get()?;
    let entry = &mut ctx.accounts.blacklist_entry;
    entry.mint = state.mint;
    entry.address = ctx.accounts.target.key();
    entry.reason = reason.chars().take(128).collect();
    entry.timestamp = clock.unix_timestamp;
    entry.bump = ctx.bumps.blacklist_entry;

    emit!(AddedToBlacklist {
        mint: state.mint,
        address: ctx.accounts.target.key(),
        reason: entry.reason.clone(),
        blacklister: ctx.accounts.blacklister.key(),
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
