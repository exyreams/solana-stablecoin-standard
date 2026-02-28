use anchor_lang::prelude::*;
use crate::{errors::SssError, state::{MinterQuota, RolesConfig, StablecoinState}};

#[derive(Accounts)]
pub struct RemoveMinter<'info> {
    /// Must be master authority.
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [b"stablecoin_state", stablecoin_state.mint.as_ref()],
        bump = stablecoin_state.bump,
    )]
    pub stablecoin_state: Account<'info, StablecoinState>,

    #[account(
        seeds = [b"roles_config", stablecoin_state.mint.as_ref()],
        bump = roles_config.bump,
    )]
    pub roles_config: Account<'info, RolesConfig>,

    /// CHECK: the minter being removed.
    pub minter: UncheckedAccount<'info>,

    /// Close the minter quota PDA (rent returned to authority).
    #[account(
        mut,
        close = authority,
        seeds = [MinterQuota::SEED, stablecoin_state.mint.as_ref(), minter.key().as_ref()],
        bump = minter_quota.bump,
    )]
    pub minter_quota: Account<'info, MinterQuota>,
}

pub fn handler(ctx: Context<RemoveMinter>) -> Result<()> {
    require!(
        ctx.accounts.authority.key() == ctx.accounts.roles_config.master_authority,
        SssError::Unauthorized
    );

    // Account closed via `close = authority` constraint above.
    Ok(())
}
