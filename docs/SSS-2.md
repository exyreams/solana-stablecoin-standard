# SSS-2: Compliant Stablecoin Standard

**Status:** Final  
**Category:** Compliance Layer (extends SSS-1)

---

## Summary

SSS-2 is the **regulated stablecoin** standard for USDC/USDT-class tokens where regulators expect:

- **On-chain blacklist enforcement** — every transfer is checked
- **Token seizure capability** — permanent delegate allows pulling tokens from any account
- **Proactive compliance** — transfers are rejected at the protocol level, not just flagged

SSS-2 is a strict superset of SSS-1. All SSS-1 instructions are available plus the compliance module.

---

## Token-2022 Extensions Added (vs SSS-1)

| Extension | Purpose |
|---|---|
| `PermanentDelegate` | Allows the seizer to transfer tokens from any account |
| `TransferHook` | Every transfer invokes the `transfer-hook` program |

---

## Transfer Hook Program

The `transfer-hook` program runs on **every token transfer**. It checks whether the source or destination wallet owner has an active `BlacklistEntry` PDA. If either exists, the transfer fails with:

- `SourceBlacklisted` — sender is blacklisted
- `DestinationBlacklisted` — recipient is blacklisted

This check is **unforgeable and automatic** — it cannot be bypassed at the application layer.

---

## Additional Accounts

### `BlacklistEntry` PDA
Seeds: `["blacklist", mint, address]`

| Field | Type | Description |
|---|---|---|
| `mint` | `Pubkey` | The mint this entry applies to |
| `address` | `Pubkey` | The blacklisted wallet |
| `reason` | `String` | Reason string (max 128 chars) |
| `timestamp` | `i64` | Unix timestamp of blacklisting |

Existence of this PDA = address is blacklisted. Closing it = address is cleared.

---

## Additional Instructions (SSS-2 only)

| Instruction | Auth | Description |
|---|---|---|
| `add_to_blacklist` | blacklister / master | Creates `BlacklistEntry` PDA |
| `remove_from_blacklist` | blacklister / master | Closes `BlacklistEntry` PDA (reclaims rent) |
| `seize` | seizer / master | Transfers tokens via permanent delegate |

All three instructions **fail gracefully** if `enable_transfer_hook` / `enable_permanent_delegate` was not set during initialization.

---

## Additional Roles (SSS-2)

| Role | Description |
|---|---|
| `blacklister` | Can add/remove blacklist entries |
| `seizer` | Can seize tokens into treasury |

---

## Initialization

```bash
sss-token init --preset sss-2 --name "Compliant Dollar" --symbol "CUSD"
```

```ts
const stable = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_2,
  name: 'Compliant Dollar',
  symbol: 'CUSD',
  authority: adminKeypair,
});
```

---

## Compliance Workflow

```
1. Sanctions screening identifies address X
2. sss-token blacklist add <X> --reason "OFAC match"
   → Creates BlacklistEntry PDA on-chain
3. Any transfer to/from X now fails automatically (transfer hook)
4. Optionally: sss-token seize <X-token-account> --to <treasury>
5. sss-token blacklist remove <X>  (if cleared)
   → Closes PDA, reclaims rent
```
