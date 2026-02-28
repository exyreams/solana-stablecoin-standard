use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};
use crate::errors::HookError;

/// Transfer hook execution — called by Token-2022 on every transfer involving
/// the associated mint.
///
/// # Caller Verification
///
/// This handler does not explicitly verify that the caller is Token-2022.
/// Any account can invoke this instruction directly.  This is safe because
/// the handler is purely read-only: it checks whether blacklist PDAs exist
/// (lamports > 0) and either succeeds or returns an error.  No state is
/// modified, so a direct call has no side effects beyond consuming compute.
///
/// If future versions add state mutations, caller verification should be
/// added per SPL Transfer Hook Interface best practices:
/// ```ignore
/// spl_transfer_hook_interface::onchain::check_execution_account(
///     &ctx.accounts.extra_account_meta_list,
///     program_id,
/// )?;
/// ```
#[derive(Accounts)]
pub struct Execute<'info> {
    /// Source token account (index 0).
    pub source_token: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Mint (index 1).
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// Destination token account (index 2).
    pub destination_token: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Source token account authority — owner or delegate (index 3).
    /// CHECK: Passed by Token-2022 runtime; not used directly.
    pub authority: UncheckedAccount<'info>,

    /// ExtraAccountMetaList PDA (index 4).
    /// CHECK: Validated by the Token-2022 runtime before calling this hook.
    pub extra_account_meta_list: UncheckedAccount<'info>,

    /// The sss-token program (index 5, extra account #0).
    /// Needed so Token-2022 can derive blacklist PDAs owned by sss-token.
    /// CHECK: Resolved from the fixed pubkey stored in ExtraAccountMetaList.
    pub sss_token_program: UncheckedAccount<'info>,

    /// Blacklist entry PDA for the source wallet owner (index 6, extra account #1).
    /// Derived as PDA of sss-token: ["blacklist", mint, source_owner].
    /// CHECK: We only check lamports — nonzero means blacklisted.
    pub source_blacklist_entry: UncheckedAccount<'info>,

    /// Blacklist entry PDA for the destination wallet owner (index 7, extra account #2).
    /// Derived as PDA of sss-token: ["blacklist", mint, dest_owner].
    /// CHECK: We only check lamports — nonzero means blacklisted.
    pub destination_blacklist_entry: UncheckedAccount<'info>,
}

pub fn execute_handler(ctx: Context<Execute>, _amount: u64) -> Result<()> {
    let source_entry = &ctx.accounts.source_blacklist_entry;
    let dest_entry = &ctx.accounts.destination_blacklist_entry;

    // A PDA with lamports > 0 exists on-chain → the address is blacklisted.
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