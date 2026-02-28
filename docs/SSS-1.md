# SSS-1: Minimal Stablecoin Standard

**Status:** Final  
**Category:** Base Layer

---

## Summary

SSS-1 is the minimal viable stablecoin on Solana. It provides:

- Token-2022 mint with `freeze_authority` and `mint_authority`
- On-chain metadata (name, symbol, URI)
- Role-based access control (master, minter, burner, pauser)
- Per-minter quotas
- Global pause / unpause
- Two-step authority transfer

SSS-1 is suitable for **internal tokens, DAO treasuries, and ecosystem settlement**. Compliance is **reactive** — operators can freeze accounts after the fact.

---

## Token-2022 Extensions Used

| Extension | Purpose |
|---|---|
| `MintCloseAuthority` | Allow closing the mint if unused |
| `MetadataPointer` | Points to on-chain metadata |
| `TokenMetadata` | Stores name, symbol, URI on-chain |

---

## On-Chain Accounts

### `StablecoinState` PDA
Seeds: `["stablecoin_state", mint]`

| Field | Type | Description |
|---|---|---|
| `mint` | `Pubkey` | The mint address |
| `name` | `String` | Token name |
| `symbol` | `String` | Token symbol |
| `decimals` | `u8` | Decimal places |
| `uri` | `String` | Metadata URI |
| `paused` | `bool` | Global pause flag |

### `RolesConfig` PDA
Seeds: `["roles_config", mint]`

| Role | Description |
|---|---|
| `master_authority` | Full control; can update all roles |
| `minter` | Can call `mint` instruction |
| `burner` | Can call `burn` instruction |
| `pauser` | Can call `pause` / `unpause` |

### `MinterQuota` PDA
Seeds: `["minter_quota", mint, minter]`

Tracks per-minter quota limit and running total. `quota = 0` means unlimited.

---

## Instructions

| Instruction | Auth Required | Description |
|---|---|---|
| `initialize` | payer | Create mint + state + roles |
| `mint` | minter | Mint tokens (quota checked) |
| `burn` | burner | Burn tokens |
| `freeze_account` | master / minter | Freeze a token account |
| `thaw_account` | master / minter | Thaw a token account |
| `pause` | pauser / master | Disable mint + burn globally |
| `unpause` | pauser / master | Re-enable mint + burn |
| `update_minter` | master | Set minter quota / active flag |
| `update_roles` | master | Change role assignments |
| `transfer_authority` | master / pending | Two-step authority transfer |

---

## Initialization Parameters

```rust
pub struct StablecoinConfig {
    pub name: String,          // max 32 chars
    pub symbol: String,        // max 10 chars
    pub uri: String,           // max 200 chars
    pub decimals: u8,
    pub enable_permanent_delegate: bool,  // false for SSS-1
    pub enable_transfer_hook: bool,       // false for SSS-1
    pub default_account_frozen: bool,     // false for SSS-1
}
```

---

## Quick Start

```bash
sss-token init --preset sss-1 --name "My Dollar" --symbol "MYDOL" --decimals 6
```

```ts
const stable = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_1,
  name: 'My Dollar',
  symbol: 'MYDOL',
  authority: adminKeypair,
});
```
