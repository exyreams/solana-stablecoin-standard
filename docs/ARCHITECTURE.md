# Architecture

## Layer Model

```
┌──────────────────────────────────────────────────────────┐
│  Layer 3 — Standard Presets                              │
│  SSS-1: Minimal Stablecoin                               │
│  SSS-2: Compliant Stablecoin                             │
├──────────────────────────────────────────────────────────┤
│  Layer 2 — Modules                                       │
│  Compliance Module (transfer hook, blacklist, delegate)  │
│  [SSS-3 — Privacy Module — experimental]                 │
├──────────────────────────────────────────────────────────┤
│  Layer 1 — Base SDK                                      │
│  Token-2022 mint · Role management · CLI · TS SDK        │
└──────────────────────────────────────────────────────────┘
```

## On-Chain Programs

### `sss-token` (main program)
Handles all state mutations: mint creation, role management, minting, burning, freezing, and SSS-2 compliance operations.

```
programs/sss-token/src/
  lib.rs               # Program entry, declare_id!, routing
  state/
    stablecoin_config  # Central config PDA
    roles_config       # Role assignments PDA
    minter_quota       # Per-minter quota PDA
  instructions/
    initialize         # Creates mint with Token-2022 extensions
    mint / burn        # Core token operations
    freeze / thaw      # Account freezing
    pause / unpause    # Global circuit breaker
    update_minter      # Quota management
    update_roles       # Role reassignment
    transfer_authority # Two-step authority transfer
    sss2/
      add_to_blacklist    # Creates BlacklistEntry PDA
      remove_from_blacklist  # Closes BlacklistEntry PDA
      seize              # Permanent delegate transfer
```

### `transfer-hook` (SSS-2 hook program)
Invoked by the Token-2022 runtime on every transfer. Checks for `BlacklistEntry` PDAs on source/destination. Requires `initialize_extra_account_meta_list` to be called once after mint creation.

## Data Flow

### Mint Flow (SSS-1)
```
Operator → CLI/SDK → sss-token::mint
  → check: not paused
  → check: caller == roles.minter
  → check: quota not exceeded
  → Token-2022 mint_to CPI
  → emit TokensMinted event
  → event-indexer picks up log
```

### Transfer Flow (SSS-2)
```
User → Token-2022 transfer_checked
  → Token-2022 invokes transfer-hook::execute
  → hook checks: source BlacklistEntry PDA lamports == 0
  → hook checks: destination BlacklistEntry PDA lamports == 0
  → if any PDA exists → REJECT (SourceBlacklisted / DestinationBlacklisted)
  → if both clear → ALLOW transfer
```

### Seize Flow (SSS-2)
```
Compliance team → CLI/SDK → sss-token::seize
  → check: enable_permanent_delegate == true
  → check: caller == roles.seizer
  → Token-2022 transfer_checked CPI (seizer as permanent delegate authority)
  → emit TokensSeized event
```

## Security Model

| Threat | Mitigation |
|---|---|
| Single key controls everything | Separate roles per operation |
| Accidental authority loss | Two-step transfer with pending_master |
| Blacklist bypass | Hook enforced by Token-2022 runtime, not app layer |
| SSS-2 ops on SSS-1 mint | `ComplianceNotEnabled` error guard on every SSS-2 instruction |
| Minter overissuance | `MinterQuota` PDA checked before every mint |
| Rug via mint | Pause + freeze available to designated roles only |
