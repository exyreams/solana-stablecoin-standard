use anchor_lang::prelude::*;
use crate::{
    errors::SssError,
    events::{AuthorityTransferCompleted, AuthorityTransferInitiated},
    state::{RolesConfig, StablecoinState},
};

#[derive(Accounts)]
pub struct TransferAuthority<'info> {
    pub caller: Signer<'info>,

    #[account(seeds = [b"stablecoin_state", stablecoin_state.mint.as_ref()], bump = stablecoin_state.bump)]
    pub stablecoin_state: Account<'info, StablecoinState>,

    #[account(
        mut,
        seeds = [b"roles_config", stablecoin_state.mint.as_ref()],
        bump = roles_config.bump,
    )]
    pub roles_config: Account<'info, RolesConfig>,

    /// CHECK: the new master authority being proposed or accepted.
    pub new_master: UncheckedAccount<'info>,
}

/// Two-step authority transfer.
///
/// Step 1 — current master calls this: sets `pending_master = new_master`.
/// Step 2 — pending master calls this: finalizes the transfer.
pub fn handler(ctx: Context<TransferAuthority>) -> Result<()> {
    let roles = &mut ctx.accounts.roles_config;
    let caller = ctx.accounts.caller.key();
    let new_master = ctx.accounts.new_master.key();
    let mint = ctx.accounts.stablecoin_state.mint;
    let clock = Clock::get()?;

    if caller == roles.master_authority {
        // Step 1: initiate
        roles.pending_master = Some(new_master);
        emit!(AuthorityTransferInitiated {
            mint,
            current_master: caller,
            pending_master: new_master,
            timestamp: clock.unix_timestamp,
        });
    } else if roles.pending_master == Some(caller) {
        // Step 2: accept
        roles.master_authority = caller;
        roles.pending_master = None;
        emit!(AuthorityTransferCompleted {
            mint,
            new_master: caller,
            timestamp: clock.unix_timestamp,
        });
    } else {
        return err!(SssError::NotPendingMaster);
    }

    Ok(())
}
