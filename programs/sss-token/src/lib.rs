use anchor_lang::prelude::*;

pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

pub use instructions::*;

pub use instructions::{
    token_core::{
        initialize::Initialize,
        mint::MintTokens,
        burn::Burn,
        get_supply::GetSupply,
    },
    account::{
        freeze_account::FreezeAccount,
        thaw_account::ThawAccount,
    },
    admin::{
        pause::Pause,
        unpause::Unpause,
        update_roles::UpdateRoles,
        transfer_authority::TransferAuthority,
    },
    minter::{
        add_minter::AddMinter,
        remove_minter::RemoveMinter,
        update_minter::UpdateMinter,
    },
    sss2::{
        add_to_blacklist::AddToBlacklist,
        remove_from_blacklist::RemoveFromBlacklist,
        seize::Seize,
    },
    sss3::{
        approve_account::ApproveAccount,
        enable_confidential_credits::EnableConfidentialCredits,
        disable_confidential_credits::DisableConfidentialCredits,
    },
};

declare_id!("EsfnG79GeuaxGxnttbJ2kHYRs8CwP5RNNMbr6a3MiZaK");

#[program]
pub mod sss_token {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, config: StablecoinConfig) -> Result<()> {
        instructions::token_core::initialize::handler(ctx, config)
    }

    pub fn mint(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
        instructions::token_core::mint::handler(ctx, amount)
    }

    pub fn burn(ctx: Context<Burn>, amount: u64) -> Result<()> {
        instructions::token_core::burn::handler(ctx, amount)
    }

    pub fn get_supply(ctx: Context<GetSupply>) -> Result<u64> {
        instructions::token_core::get_supply::handler(ctx)
    }

    pub fn freeze_account(ctx: Context<FreezeAccount>) -> Result<()> {
        instructions::account::freeze_account::handler(ctx)
    }

    pub fn thaw_account(ctx: Context<ThawAccount>) -> Result<()> {
        instructions::account::thaw_account::handler(ctx)
    }

    pub fn pause(ctx: Context<Pause>, reason: Option<String>) -> Result<()> {
        instructions::admin::pause::handler(ctx, reason)
    }

    pub fn unpause(ctx: Context<Unpause>) -> Result<()> {
        instructions::admin::unpause::handler(ctx)
    }

    pub fn update_minter(
        ctx: Context<UpdateMinter>,
        quota: u64,
        active: bool,
    ) -> Result<()> {
        instructions::minter::update_minter::handler(ctx, quota, active)
    }

    pub fn add_minter(ctx: Context<AddMinter>, quota: u64) -> Result<()> {
        instructions::minter::add_minter::handler(ctx, quota)
    }

    pub fn remove_minter(ctx: Context<RemoveMinter>) -> Result<()> {
        instructions::minter::remove_minter::handler(ctx)
    }

    pub fn update_roles(ctx: Context<UpdateRoles>, new_roles: RolesUpdate) -> Result<()> {
        instructions::admin::update_roles::handler(ctx, new_roles)
    }

    pub fn transfer_authority(ctx: Context<TransferAuthority>) -> Result<()> {
        instructions::admin::transfer_authority::handler(ctx)
    }

    pub fn add_to_blacklist(
        ctx: Context<AddToBlacklist>,
        reason: String,
    ) -> Result<()> {
        instructions::sss2::add_to_blacklist::handler(ctx, reason)
    }

    pub fn remove_from_blacklist(ctx: Context<RemoveFromBlacklist>) -> Result<()> {
        instructions::sss2::remove_from_blacklist::handler(ctx)
    }

    pub fn seize(ctx: Context<Seize>, amount: u64) -> Result<()> {
        instructions::sss2::seize::handler(ctx, amount)
    }

    // ========== SSS-3: Privacy Features ==========

    pub fn approve_account(ctx: Context<ApproveAccount>) -> Result<()> {
        instructions::sss3::approve_account::handler(ctx)
    }

    pub fn enable_confidential_credits(ctx: Context<EnableConfidentialCredits>) -> Result<()> {
        instructions::sss3::enable_confidential_credits::handler(ctx)
    }

    pub fn disable_confidential_credits(ctx: Context<DisableConfidentialCredits>) -> Result<()> {
        instructions::sss3::disable_confidential_credits::handler(ctx)
    }
}

pub use instructions::token_core::initialize::StablecoinConfig;
pub use instructions::admin::update_roles::RolesUpdate;