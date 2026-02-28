use anchor_lang::{prelude::*, solana_program::program::invoke};
use anchor_spl::token_2022::Token2022;
use spl_token_2022::{
    extension::{
        ExtensionType,
        default_account_state,
        metadata_pointer,
    },
    instruction as token_instruction,
    state::{Mint as SplMint, AccountState},
};

use crate::{
    errors::SssError,
    events::StablecoinInitialized,
    state::{RolesConfig, StablecoinState},
};

/// Parameters passed by the caller at initialization time.
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct StablecoinConfig {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    pub enable_permanent_delegate: bool,
    pub enable_transfer_hook: bool,
    pub default_account_frozen: bool,
    pub transfer_hook_program_id: Option<Pubkey>,
}

#[derive(Accounts)]
#[instruction(config: StablecoinConfig)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Created manually via CPI so we can size it for the exact set of
    /// extensions requested.
    #[account(mut, signer)]
    pub mint: UncheckedAccount<'info>,

    #[account(
        init,
        payer = authority,
        space = StablecoinState::LEN,
        seeds = [b"stablecoin_state", mint.key().as_ref()],
        bump,
    )]
    pub stablecoin_state: Account<'info, StablecoinState>,

    #[account(
        init,
        payer = authority,
        space = RolesConfig::LEN,
        seeds = [b"roles_config", mint.key().as_ref()],
        bump,
    )]
    pub roles_config: Account<'info, RolesConfig>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<Initialize>, config: StablecoinConfig) -> Result<()> {
    require!(config.name.len() <= 32, SssError::NameTooLong);
    require!(config.symbol.len() <= 10, SssError::SymbolTooLong);
    require!(config.uri.len() <= 200, SssError::UriTooLong);

    if config.enable_transfer_hook {
        require!(
            config.transfer_hook_program_id.is_some(),
            SssError::MissingTransferHookProgram
        );
    }

    let clock = Clock::get()?;
    let authority_key = ctx.accounts.authority.key();
    let mint_key = ctx.accounts.mint.key();
    let token_program_id = Token2022::id();

    let mut extensions = vec![ExtensionType::MintCloseAuthority];
    extensions.push(ExtensionType::MetadataPointer);

    if config.enable_permanent_delegate {
        extensions.push(ExtensionType::PermanentDelegate);
    }
    if config.enable_transfer_hook {
        extensions.push(ExtensionType::TransferHook);
    }
    if config.default_account_frozen {
        extensions.push(ExtensionType::DefaultAccountState);
    }

    let space = ExtensionType::try_calculate_account_len::<SplMint>(&extensions)
        .map_err(|_| SssError::Overflow)?;
    let lamports = Rent::get()?.minimum_balance(space);

    anchor_lang::system_program::create_account(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::CreateAccount {
                from: ctx.accounts.authority.to_account_info(),
                to: ctx.accounts.mint.to_account_info(),
            },
        ),
        lamports,
        space as u64,
        &token_program_id,
    )?;

    let state_pda = ctx.accounts.stablecoin_state.key();

    invoke(
        &token_instruction::initialize_mint_close_authority(
            &token_program_id,
            &mint_key,
            Some(&authority_key),
        )?,
        &[ctx.accounts.mint.to_account_info()],
    )?;

    invoke(
        &metadata_pointer::instruction::initialize(
            &token_program_id,
            &mint_key,
            Some(authority_key),
            Some(mint_key),
        )?,
        &[ctx.accounts.mint.to_account_info()],
    )?;

    if config.default_account_frozen {
        invoke(
            &default_account_state::instruction::initialize_default_account_state(
                &token_program_id,
                &mint_key,
                &AccountState::Frozen,
            )?,
            &[ctx.accounts.mint.to_account_info()],
        )?;
    }

    if config.enable_permanent_delegate {
        invoke(
            &token_instruction::initialize_permanent_delegate(
                &token_program_id,
                &mint_key,
                &state_pda,
            )?,
            &[ctx.accounts.mint.to_account_info()],
        )?;
    }

    if config.enable_transfer_hook {
        let hook_program_id = config.transfer_hook_program_id.unwrap();
        invoke(
            &spl_token_2022::extension::transfer_hook::instruction::initialize(
                &token_program_id,
                &mint_key,
                Some(authority_key),
                Some(hook_program_id),
            )?,
            &[ctx.accounts.mint.to_account_info()],
        )?;
    }

    invoke(
        &token_instruction::initialize_mint2(
            &token_program_id,
            &mint_key,
            &state_pda,
            Some(&state_pda),
            config.decimals,
        )?,
        &[ctx.accounts.mint.to_account_info()],
    )?;

    let metadata_ix = spl_token_metadata_interface::instruction::initialize(
        &token_program_id,
        &mint_key,
        &authority_key,
        &mint_key,
        &authority_key,
        config.name.clone(),
        config.symbol.clone(),
        config.uri.clone(),
    );

    invoke(
        &metadata_ix,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.authority.to_account_info(),
        ],
    )?;

    let state = &mut ctx.accounts.stablecoin_state;
    state.mint = mint_key;
    state.name = config.name.clone();
    state.symbol = config.symbol.clone();
    state.uri = config.uri.clone();
    state.decimals = config.decimals;
    state.enable_permanent_delegate = config.enable_permanent_delegate;
    state.enable_transfer_hook = config.enable_transfer_hook;
    state.default_account_frozen = config.default_account_frozen;
    state.paused = false;
    state.total_supply = 0;
    state.bump = ctx.bumps.stablecoin_state;

    let roles = &mut ctx.accounts.roles_config;
    roles.master_authority = authority_key;
    roles.pending_master = None;
    roles.burner = authority_key;
    roles.pauser = authority_key;
    roles.blacklister = authority_key;
    roles.seizer = authority_key;
    roles.bump = ctx.bumps.roles_config;

    emit!(StablecoinInitialized {
        mint: mint_key,
        name: config.name,
        symbol: config.symbol,
        decimals: config.decimals,
        enable_permanent_delegate: config.enable_permanent_delegate,
        enable_transfer_hook: config.enable_transfer_hook,
        master_authority: authority_key,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}