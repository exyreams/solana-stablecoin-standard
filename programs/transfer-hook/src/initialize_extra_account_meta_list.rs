use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;
use spl_tlv_account_resolution::{
    account::ExtraAccountMeta,
    seeds::Seed,
    state::ExtraAccountMetaList,
};

/// PDA seeds for the ExtraAccountMetaList account.
pub const EXTRA_ACCOUNT_META_LIST_SEEDS: &[u8] = b"extra-account-metas";

/// Accounts required to initialize the ExtraAccountMetaList for this hook.
/// Must be called once, immediately after the SSS-2 mint is created.
#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// ExtraAccountMetaList PDA — tells the Token-2022 runtime which extra accounts
    /// must be passed to this hook on every transfer.
    /// Seeds: ["extra-account-metas", mint]
    ///
    /// CHECK: Account size is computed from ExtraAccountMetaList::size_of and
    /// created by Anchor's init constraint.
    #[account(
        init,
        payer = payer,
        space = ExtraAccountMetaList::size_of(2).unwrap(),
        seeds = [EXTRA_ACCOUNT_META_LIST_SEEDS, mint.key().as_ref()],
        bump,
    )]
    pub extra_account_meta_list: UncheckedAccount<'info>,

    pub mint: Box<InterfaceAccount<'info, Mint>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeExtraAccountMetaList>) -> Result<()> {
    // The hook requires two extra accounts on every transfer:
    //
    //  [5] source_blacklist_entry  — BlacklistEntry PDA for the source wallet owner
    //  [6] destination_blacklist_entry — BlacklistEntry PDA for the dest wallet owner
    //
    // Standard Token-2022 hook account indices for the Execute instruction:
    //   0 = source_account (token account)
    //   1 = mint
    //   2 = destination_account (token account)
    //   3 = owner / authority (source wallet)
    //   4 = ExtraAccountMetaList PDA (this account)
    //
    // We use AccountKey seeds relative to the transfer accounts so the runtime
    // derives them automatically from the transfer context.

    let account_metas = vec![
        // Source blacklist entry: seeds = ["blacklist", mint, source_owner]
        ExtraAccountMeta::new_with_seeds(
            &[
                Seed::Literal { bytes: b"blacklist".to_vec() },
                Seed::AccountKey { index: 1 }, // mint (index 1)
                Seed::AccountKey { index: 3 }, // source token account owner (index 3)
            ],
            false, // is_signer
            false, // is_writable
        )?,
        // Destination blacklist entry: seeds = ["blacklist", mint, dest_owner]
        // We need to extract the owner from the destination token account (index 2)
        // TokenAccount owner is at offset 32 (after mint pubkey)
        ExtraAccountMeta::new_with_seeds(
            &[
                Seed::Literal { bytes: b"blacklist".to_vec() },
                Seed::AccountKey { index: 1 }, // mint
                Seed::AccountData { 
                    account_index: 2,  // destination token account
                    data_index: 32,    // owner field offset in TokenAccount
                    length: 32,        // Pubkey length
                },
            ],
            false,
            false,
        )?,
    ];

    // Write the ExtraAccountMetaList into the PDA's data.
    // No signer seeds needed here — Anchor already handled account creation above.
    ExtraAccountMetaList::init::<spl_transfer_hook_interface::instruction::ExecuteInstruction>(
        &mut ctx.accounts.extra_account_meta_list.try_borrow_mut_data()?,
        &account_metas,
    )?;

    Ok(())
}
