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
/// # Permanent Delegate Bypass
///
/// When the transfer authority (index 3) matches the stablecoin_state PDA
/// (index 8), this is a permanent delegate operation (seize).  Blacklist
/// checks are skipped because the operator may need to seize tokens FROM
/// a blacklisted account.  The seize instruction in the sss-token program
/// enforces its own role-based access control (seizer / master_authority).
#[derive(Accounts)]
pub struct Execute<'info> {
    /// Source token account (index 0).
    pub source_token: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Mint (index 1).
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// Destination token account (index 2).
    pub destination_token: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Source token account authority — owner or delegate (index 3).
    /// Used to detect permanent delegate (seize) operations.
    /// CHECK: Passed by Token-2022 runtime.
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

    /// The stablecoin_state PDA (index 8, extra account #3).
    /// Used to identify permanent delegate (seize) operations.
    /// If authority == stablecoin_state, blacklist checks are skipped.
    /// CHECK: Resolved from ExtraAccountMetaList as external PDA of sss-token.
    pub stablecoin_state: UncheckedAccount<'info>,
}

pub fn execute_handler(ctx: Context<Execute>, _amount: u64) -> Result<()> {
    let authority_key = ctx.accounts.authority.key();
    let stablecoin_state_key = ctx.accounts.stablecoin_state.key();

    // If the transfer authority is the stablecoin_state PDA, this is a
    // permanent delegate operation (seize).  Seizure must bypass blacklist
    // checks — the operator may need to seize FROM a blacklisted account.
    // The seize instruction already enforces its own role-based access
    // control (seizer / master_authority), so this is safe.
    if authority_key == stablecoin_state_key {
        return Ok(());
    }

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