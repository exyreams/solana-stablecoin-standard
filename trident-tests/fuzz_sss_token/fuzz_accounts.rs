use trident_fuzz::fuzzing::*;

/// Storage for all account addresses used in fuzz testing.
///
/// This struct serves as a centralized repository for account addresses,
/// enabling their reuse across different instruction flows and test scenarios.
///
/// Docs: https://ackee.xyz/trident/docs/latest/trident-api-macro/trident-types/fuzz-accounts/
#[derive(Default)]
pub struct AccountAddresses {
    pub authority: AddressStorage,

    pub stablecoin_state: AddressStorage,

    pub roles_config: AddressStorage,

    pub minter: AddressStorage,

    pub minter_quota: AddressStorage,

    pub system_program: AddressStorage,

    pub blacklister: AddressStorage,

    pub target: AddressStorage,

    pub blacklist_entry: AddressStorage,

    pub mint: AddressStorage,

    pub token_account: AddressStorage,

    pub token_program: AddressStorage,

    pub burner: AddressStorage,

    pub from_token_account: AddressStorage,

    pub owner: AddressStorage,

    pub target_account: AddressStorage,

    pub rent: AddressStorage,

    pub recipient_token_account: AddressStorage,

    pub pauser: AddressStorage,

    pub seizer: AddressStorage,

    pub to_token_account: AddressStorage,

    pub caller: AddressStorage,
}
