# Solana Stablecoin Standard

> Open-source SDK & on-chain standards for stablecoins on Solana — by Superteam Brazil

[![CI](https://github.com/solanabr/solana-stablecoin-standard/actions/workflows/ci.yml/badge.svg)](https://github.com/solanabr/solana-stablecoin-standard/actions)

---

## Standards

| Standard | Name | Description |
|---|---|---|
| **SSS-1** | Minimal Stablecoin | Mint + freeze + metadata. Nothing more. |
| **SSS-2** | Compliant Stablecoin | SSS-1 + permanent delegate + transfer hook + blacklist |

## Quick Start

```bash
# Install CLI
pnpm install

# Initialize a stablecoin
sss-token init --preset sss-2 --name "My Dollar" --symbol "MYDOL"

# Mint & operate
sss-token mint <recipient> 1000
sss-token blacklist add <address> --reason "OFAC match"
sss-token status
```

## TypeScript SDK

```ts
import { SolanaStablecoin, Presets } from '@stbr/sss-token-sdk';

const stable = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_2,
  name: 'My Stablecoin',
  symbol: 'MYUSD',
  authority: adminKeypair,
});

await stable.mint({ recipient, amount: 1_000_000n });
await stable.compliance.blacklistAdd(address, 'OFAC match', authority);
```

## Backend Services

```bash
cp .env.example .env
docker compose up -d
```

## Documentation

See [`docs/`](./docs/) for full specifications.

- [README](./docs/README.md) — Overview & architecture diagram
- [SSS-1](./docs/SSS-1.md) — Minimal stablecoin standard
- [SSS-2](./docs/SSS-2.md) — Compliant stablecoin standard
- [SDK](./docs/SDK.md) — TypeScript SDK reference
- [OPERATIONS](./docs/OPERATIONS.md) — Operator runbook
- [COMPLIANCE](./docs/COMPLIANCE.md) — Regulatory guide
- [API](./docs/API.md) — Backend API reference
- [ARCHITECTURE](./docs/ARCHITECTURE.md) — Layer model & data flows

## License

MIT
