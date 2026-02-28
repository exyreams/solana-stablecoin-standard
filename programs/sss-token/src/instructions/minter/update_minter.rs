use anchor_lang::prelude::*;
use crate::state::{MinterQuota, StablecoinState, RolesConfig};

#[derive(Accounts)]
pub struct UpdateMinter<'info> {
    pub authority: Signer<'info>,

    #[account(
        seeds = [b"stablecoin_state", stablecoin_state.mint.as_ref()],
        bump = stablecoin_state.bump,
    )]
    pub stablecoin_state: Account<'info, StablecoinState>,

    #[account(
        seeds = [b"roles_config", stablecoin_state.mint.as_ref()],
        bump = roles_config.bump,
        constraint = roles_config.master_authority == authority.key(),
    )]
    pub roles_config: Account<'info, RolesConfig>,

    /// CHECK: The minter wallet whose quota is being updated.
    pub minter: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [MinterQuota::SEED, stablecoin_state.mint.as_ref(), minter.key().as_ref()],
        bump = minter_quota.bump,
    )]
    pub minter_quota: Account<'info, MinterQuota>,
}

pub fn handler(ctx: Context<UpdateMinter>, quota: u64, active: bool) -> Result<()> {
    let q = &mut ctx.accounts.minter_quota;
    q.quota = quota;
    q.active = active;
    Ok(())
}