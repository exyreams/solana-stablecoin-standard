use anchor_lang::prelude::*;
use crate::state::StablecoinState;

#[derive(Accounts)]
pub struct GetSupply<'info> {
    #[account(
        seeds = [b"stablecoin_state", stablecoin_state.mint.as_ref()],
        bump = stablecoin_state.bump,
    )]
    pub stablecoin_state: Account<'info, StablecoinState>,
}

/// Returns the current total supply.
/// This is a view-only instruction that doesn't modify state.
pub fn handler(ctx: Context<GetSupply>) -> Result<u64> {
    Ok(ctx.accounts.stablecoin_state.total_supply)
}
