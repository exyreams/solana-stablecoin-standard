use anchor_lang::prelude::*;

pub mod errors;
pub mod execute;
pub mod initialize_extra_account_meta_list;

use execute::*;
use initialize_extra_account_meta_list::*;

declare_id!("HookXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

#[program]
pub mod transfer_hook {
    use super::*;

    /// Called once after the SSS-2 mint is created.
    /// Writes the ExtraAccountMetaList PDA so Token-2022 knows which extra
    /// accounts to pass to `execute` on every transfer.
    pub fn initialize_extra_account_meta_list(
        ctx: Context<InitializeExtraAccountMetaList>,
    ) -> Result<()> {
        initialize_extra_account_meta_list::handler(ctx)
    }

    /// Called by Token-2022 on every transfer.
    /// Checks that neither the source nor the destination wallet is blacklisted.
    pub fn execute(ctx: Context<Execute>, amount: u64) -> Result<()> {
        execute::handler(ctx, amount)
    }
}
