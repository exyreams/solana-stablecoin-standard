use anchor_lang::prelude::*;
use crate::{errors::SssError, state::{MinterQuota, RolesConfig, StablecoinState}};

#[derive(Accounts)]
pub struct AddMinter<'info> {
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

    /// CHECK: the minter being added.
    pub minter: UncheckedAccount<'info>,

    /// Minter quota PDA — created here.
    #[account(
        init,
        payer = authority,
        space = MinterQuota::LEN,
        seeds = [MinterQuota::SEED, stablecoin_state.mint.as_ref(), minter.key().as_ref()],
        bump,
    )]
    pub minter_quota: Account<'info, MinterQuota>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AddMinter>, quota: u64) -> Result<()> {
    require!(
        ctx.accounts.authority.key() == ctx.accounts.roles_config.master_authority,
        SssError::Unauthorized
    );

    let q = &mut ctx.accounts.minter_quota;
    q.mint = ctx.accounts.stablecoin_state.mint;
    q.minter = ctx.accounts.minter.key();
    q.quota = quota;
    q.minted = 0;
    q.active = true;
    q.bump = ctx.bumps.minter_quota;

    Ok(())
}
