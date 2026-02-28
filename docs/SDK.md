# SDK Reference

## Installation

```bash
npm install @stbr/sss-token-sdk
```

## `SolanaStablecoin.create()`

```ts
import { SolanaStablecoin, Presets } from '@stbr/sss-token-sdk';

// SSS-1 preset
const stable = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_1,
  name: 'My Dollar',
  symbol: 'MYDOL',
  decimals: 6,
  authority: adminKeypair,
});

// SSS-2 preset
const stable = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_2,
  name: 'Compliant Dollar',
  symbol: 'CUSD',
  authority: adminKeypair,
});

// Custom config
const stable = await SolanaStablecoin.create(connection, {
  name: 'Custom',
  symbol: 'CUSD',
  extensions: { permanentDelegate: true, transferHook: false },
  authority: adminKeypair,
});
```

## `SolanaStablecoin.load()`

```ts
// Load an existing stablecoin by mint address
const stable = await SolanaStablecoin.load(connection, mintPublicKey, authority);
```

## Core Methods

```ts
// Minting
await stable.mint({ recipient: PublicKey, amount: bigint });

// Burning
await stable.burn({ fromTokenAccount: PublicKey, amount: bigint });

// Freezing
await stable.freeze(tokenAccountPublicKey);
await stable.thaw(tokenAccountPublicKey);

// Pause circuit-breaker
await stable.pause();
await stable.unpause();

// Role management
await stable.updateRoles({ minter: newMinterPubkey });
await stable.updateMinter({ minter: PublicKey, quota: 1_000_000n, active: true });

// Queries
const status = await stable.getStatus();   // StablecoinStatus
const supply = await stable.getTotalSupply(); // bigint
```

## Compliance Module (SSS-2)

```ts
// Blacklisting
await stable.compliance.blacklistAdd(address, 'OFAC match', authority);
await stable.compliance.blacklistRemove(address, authority);

// Checking
const blocked = await stable.compliance.isBlacklisted(address);  // boolean
const entry   = await stable.compliance.getBlacklistEntry(address); // BlacklistEntry | null

// Token seizure
await stable.compliance.seize({
  fromTokenAccount,
  toTokenAccount: treasury,
  amount: 500_000_000n,
  seizer: authority,
});
```

## Presets

```ts
import { Presets } from '@stbr/sss-token-sdk';

Presets.SSS_1  // { enablePermanentDelegate: false, enableTransferHook: false, ... }
Presets.SSS_2  // { enablePermanentDelegate: true,  enableTransferHook: true,  ... }
```

## PDA Helpers

```ts
import { deriveStablecoinState, deriveRolesConfig, deriveBlacklistEntry } from '@stbr/sss-token-sdk';

const [statePda, bump] = deriveStablecoinState(mint, programId);
const [rolesPda]        = deriveRolesConfig(mint, programId);
const [entryPda]        = deriveBlacklistEntry(mint, address, programId);
```
