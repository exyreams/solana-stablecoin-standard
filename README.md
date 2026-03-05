# Solana Stablecoin Standard (SSS)

> Open-source SDK and on-chain standards for building production-ready stablecoins on Solana

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Anchor](https://img.shields.io/badge/Anchor-0.32.1-blueviolet)](https://www.anchor-lang.com/)
[![Solana](https://img.shields.io/badge/Solana-1.18+-9945FF)](https://solana.com/)

---

## What is SSS?

The Solana Stablecoin Standard is a modular SDK with opinionated presets for building stablecoins on Solana. Think OpenZeppelin for Solana stablecoins — production-ready templates that institutions and builders can fork, customize, and deploy.

### Three Standards, One SDK

| Standard | Name | Use Case | Features |
|---|---|---|---|
| **SSS-1** | Minimal Stablecoin | Internal tokens, DAO treasuries, ecosystem settlement | Mint + freeze + metadata. Reactive compliance. |
| **SSS-2** | Compliant Stablecoin | Regulated stablecoins (USDC/USDT-class) | SSS-1 + permanent delegate + transfer hook + on-chain blacklist enforcement |
| **SSS-3** | Private Stablecoin | Privacy-preserving stablecoins (experimental) | SSS-1 + confidential transfers + scoped allowlists |

### Key Features

- **Role-Based Access Control** — Master, minter, burner, pauser, blacklister, seizer roles with per-minter quotas
- **Oracle Integration** — Multi-source price feeds for non-USD pegs (EUR, BRL, CPI-indexed) with circuit breaker protection
- **Token-2022 Extensions** — Permanent delegate, transfer hooks, confidential transfers, metadata, close authority
- **Two-Step Authority Transfer** — Prevents accidental lockout on both token and oracle authority
- **Complete Audit Trail** — 32 on-chain events covering all operations
- **PDA-Based Security** — No EOA retains privileged access after initialization

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/exyreams/solana-stablecoin-standard.git
cd solana-stablecoin-standard

# Install dependencies
pnpm install

# Build programs and SDK
anchor build
pnpm build
```

### CLI Usage

```bash
# Initialize a compliant stablecoin (SSS-2)
sss-token init --preset sss-2 \
  --name "My Dollar" \
  --symbol "MYDOL" \
  --decimals 6

# Add a minter with quota
sss-token minters add <MINTER_ADDRESS> --quota 1000000

# Mint tokens
sss-token mint <RECIPIENT> 1000 --minter <MINTER_KEYPAIR>

# SSS-2: Add to blacklist
sss-token blacklist add <ADDRESS> --reason "Sanctions screening match"

# SSS-2: Seize tokens from blacklisted account
sss-token seize <BLACKLISTED_ACCOUNT> --to <TREASURY>

# Check status
sss-token status
sss-token supply
sss-token holders

# Interactive terminal UI
sss-token tui
```

### TypeScript SDK

```typescript
import { SolanaStablecoin, Presets } from 'sss-token-sdk';
import { Connection, Keypair } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const authority = Keypair.fromSecretKey(/* your key */);

// Create a new stablecoin with SSS-2 preset
const stablecoin = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_2,
  name: 'My Stablecoin',
  symbol: 'MYUSD',
  decimals: 6,
  authority,
});

console.log('Mint address:', stablecoin.mint.toString());

// Mint tokens
const mintTx = await stablecoin.mintTokens({
  recipient: recipientAddress,
  amount: 1_000_000n, // 1 MYUSD (6 decimals)
  minter: minterKeypair,
});

// SSS-2: Blacklist management
await stablecoin.compliance.blacklistAdd(
  suspiciousAddress,
  'OFAC sanctions list match',
  blacklisterKeypair
);

// SSS-2: Seize tokens
await stablecoin.compliance.seize({
  fromTokenAccount: blacklistedAccount,
  toTokenAccount: treasuryAccount,
  amount: 5_000_000n,
  seizer: seizerKeypair,
});

// Query operations
const supply = await stablecoin.getTotalSupply();
const status = await stablecoin.getStatus();
const minters = await stablecoin.getMinters();
```

### Oracle Integration (Non-USD Pegs)

```typescript
// Initialize oracle for EUR/USD stablecoin
await stablecoin.oracle.initialize({
  baseCurrency: 'EUR',
  quoteCurrency: 'USD',
  maxStaleness: 300, // 5 minutes
  aggregationMethod: AggregationMethod.Median,
  mintPremiumBps: 50, // 0.5% premium on mints
  redeemDiscountBps: 50, // 0.5% discount on redemptions
});

// Add price feeds
await stablecoin.oracle.addFeed({
  feedIndex: 0,
  feedType: FeedType.Switchboard,
  feedAddress: switchboardFeedAddress,
  label: 'Switchboard EUR/USD',
  weight: 100,
});

// Get current prices
const mintPrice = await stablecoin.oracle.getMintPrice();
const redeemPrice = await stablecoin.oracle.getRedeemPrice();
```

---

## Architecture

### Programs

| Program | Description | Instructions |
|---|---|---|
| **sss-token** | Main stablecoin program supporting all three standards | 21 instructions |
| **transfer-hook** | SSS-2 blacklist enforcement on every transfer | 2 instructions |
| **sss-oracle** | Multi-source price feed aggregation for non-USD pegs | 11 instructions |

### Packages

| Package | Description |
|---|---|
| **sss-token-sdk** | TypeScript SDK for programmatic access |
| **sss-token CLI** | Command-line tool for operators (40+ commands) |

### Project Structure

```
programs/
  sss-token/          # Main stablecoin program (Rust/Anchor)
  transfer-hook/      # SSS-2 blacklist enforcement (Rust/Anchor)
  sss-oracle/         # Price feed aggregation (Rust/Anchor)
packages/
  sdk/                # TypeScript SDK
  cli/                # Command-line interface
docs/                 # Standard specifications and guides
sss_design/           # Frontend design files and scope
tests/                # Anchor integration tests
```

---

## Documentation

### Standards & Specifications
- [SSS-1: Minimal Stablecoin](./docs/SSS-1.md) — Basic stablecoin with reactive compliance
- [SSS-2: Compliant Stablecoin](./docs/SSS-2.md) — Regulated stablecoin with on-chain enforcement
- [SSS-3: Private Stablecoin](./docs/SSS-3.md) — Privacy-preserving stablecoin (experimental)
- [SSS-Oracle: Oracle Integration](./docs/SSS-Oracle.md) — Multi-source price feeds for non-USD pegs

### Developer Guides
- [Architecture](./docs/ARCHITECTURE.md) — Layer model, data flows, security model
- [SDK Reference](./docs/SDK-REFERENCE.md) — Complete TypeScript SDK API documentation
- [Operations Guide](./docs/OPERATIONS.md) — Operator runbook for production deployments
- [Compliance Guide](./docs/COMPLIANCE.md) — Regulatory considerations and audit trails
- [API Reference](./docs/API.md) — Backend service API documentation

### Frontend
- [Frontend Scope](./sss_design/FRONTEND-SCOPE.md) — Complete page specifications for admin dashboard

---

## Features by Standard

### SSS-1 (Minimal)
✅ Token-2022 with metadata  
✅ Role-based access control (master, minter, burner, pauser)  
✅ Per-minter quotas  
✅ Global pause/unpause  
✅ Account freeze/thaw  
✅ Two-step authority transfer  
✅ Immutable metadata  

### SSS-2 (Compliant) = SSS-1 +
✅ Permanent delegate for token seizure  
✅ Transfer hook with blacklist enforcement  
✅ On-chain blacklist PDAs with reasons  
✅ Seize tokens from blacklisted accounts  
✅ Blacklister and seizer roles  
✅ Default account frozen option  

### SSS-3 (Private) = SSS-1 +
✅ Confidential transfer extension  
✅ Account approval for confidential transfers  
✅ Enable/disable confidential credits  
✅ Privacy-preserving balance encryption  

### Oracle Module (All Standards)
✅ Multi-source price feeds (Switchboard, Pyth, Chainlink, Manual, API)  
✅ Three aggregation methods (median, mean, weighted mean)  
✅ Quality gates (staleness, confidence, deviation)  
✅ Circuit breaker protection  
✅ Mint premium and redeem discount spreads  
✅ Manual price override  
✅ Per-feed weights and staleness overrides  

---

## Development

### Build

```bash
# Build Rust programs
anchor build

# Build TypeScript packages
pnpm build

# Build everything
pnpm build && anchor build
```

### Test

```bash
# Run all Anchor tests
anchor test

# Run SDK tests
pnpm test:sdk

# Run CLI tests
pnpm test:cli
```

### Local Development

```bash
# Start local validator
solana-test-validator

# Deploy programs
anchor deploy

# Start backend services
pnpm services:up
```

---

## Program IDs

### Devnet
- **sss_token**: `EsfnG79GeuaxGxnttbJ2kHYRs8CwP5RNNMbr6a3MiZaK`
- **transfer_hook**: `F8wwXWp8JUKVrDPwFCpG2NrheV3X7KKatoDuiYeBigkf`
- **sss_oracle**: `7gw6jAKSZx4mueRHcT8kxtjWen9X53NJdKHrXNUwUQrd`

---

## Contributing

We welcome contributions! Please see our [contributing guidelines](./CONTRIBUTING.md) for details.

### Areas for Contribution
- Additional oracle feed integrations
- Frontend implementation
- Backend services
- Test coverage improvements
- Documentation enhancements
- Example implementations

---

## Security

This is experimental software under active development. Use at your own risk.

For security concerns, please email security@superteam.fun

---

## License

MIT License - see [LICENSE](./LICENSE) for details

---

Built by [@exyreams](https://github.com/exyreams)