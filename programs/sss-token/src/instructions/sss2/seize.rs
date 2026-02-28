use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

use crate::{errors::SssError, events::TokensSeized, state::{RolesConfig, StablecoinState}};

/// Seize tokens from any account using the permanent delegate authority.
///
/// # Design Notes
///
/// **No blacklist check required:**  Seizure may target accounts that are not
/// blacklisted (e.g., court orders, regulatory directives).  Blacklisting and
/// seizure are independent compliance tools.  If an operator wants to
/// blacklist-then-seize, they issue two separate instructions.
///
/// **No pause check:**  Seizure must remain operational even when the
/// stablecoin is paused.  During a security incident the operator may need to
/// pause minting/burning while still moving funds to a treasury.
#[derive(Accounts)]
pub struct Seize<'info> {
    /// The human operator who triggered the seize — must hold the `seizer` role.
    /// This is a permission guard only; the actual CPI signer is the stablecoin_state PDA.
    pub seizer: Signer<'info>,

    /// The stablecoin_state PDA is the registered permanent delegate of the mint.
    /// It signs the transfer_checked CPI using PDA seeds.
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

    /// The mint whose permanent delegate is the stablecoin_state PDA.
    #[account(mut, constraint = mint.key() == stablecoin_state.mint @ SssError::Unauthorized)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// Token account being seized from (does not need owner's signature).
    #[account(mut, token::mint = mint)]
    pub from_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Treasury / destination token account.
    #[account(mut, token::mint = mint)]
    pub to_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
}

pub fn handler(ctx: Context<Seize>, amount: u64) -> Result<()> {
    let state = &ctx.accounts.stablecoin_state;
    let roles = &ctx.accounts.roles_config;

    // Guard: SSS-2 permanent delegate must be enabled
    require!(state.enable_permanent_delegate, SssError::ComplianceNotEnabled);
    require!(
        ctx.accounts.seizer.key() == roles.seizer
            || ctx.accounts.seizer.key() == roles.master_authority,
        SssError::NotSeizer
    );

    // The stablecoin_state PDA was registered as the mint's permanent delegate
    // during `initialize`. We use new_with_signer so the PDA counter-signs the CPI.
    let mint_key = ctx.accounts.mint.key();
    let bump = state.bump;
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"stablecoin_state",
        mint_key.as_ref(),
        &[bump],
    ]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.from_token_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            // The PDA is the permanent delegate — it has authority over any token account.
            authority: ctx.accounts.stablecoin_state.to_account_info(),
        },
        signer_seeds,
    );
    transfer_checked(cpi_ctx, amount, state.decimals)?;

    emit!(TokensSeized {
        mint: state.mint,
        from: ctx.accounts.from_token_account.key(),
        to: ctx.accounts.to_token_account.key(),
        amount,
        seizer: ctx.accounts.seizer.key(),
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}