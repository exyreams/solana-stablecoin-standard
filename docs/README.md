# Solana Stablecoin Standard (SSS)

> Open-source SDK and on-chain standards for stablecoins on Solana — by [Superteam Brazil](https://superteambrasil.com)

```
npm install @stbr/sss-token-sdk
```

---

## Overview

The **Solana Stablecoin Standard** is a modular SDK with opinionated presets covering the most common stablecoin architectures on Solana. Think OpenZeppelin — the library is the SDK, the standards (SSS-1, SSS-2) are what get adopted.

Built on **Token-2022** and **Anchor 0.32**.

---

## Presets at a Glance

| Feature | SSS-1 Minimal | SSS-2 Compliant |
|---|:---:|:---:|
| Mint Authority | ✅ | ✅ |
| Freeze Authority | ✅ | ✅ |
| Token Metadata | ✅ | ✅ |
| Permanent Delegate | ❌ | ✅ |
| Transfer Hook (blacklist) | ❌ | ✅ |
| Account Seizure | ❌ | ✅ |
| **Use case** | Internal / DAO | Regulated (USDC-class) |

---

## Quick Start

### Initialize a stablecoin

```bash
# SSS-1 — minimal, no compliance module
sss-token init --preset sss-1 --name "My Dollar" --symbol "MYDOL"

# SSS-2 — fully compliant with blacklist + seizure
sss-token init --preset sss-2 --name "My Dollar" --symbol "MYDOL"
```

### TypeScript SDK

```ts
import { SolanaStablecoin, Presets } from '@stbr/sss-token-sdk';

const stable = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_2,
  name: 'My Stablecoin',
  symbol: 'MYUSD',
  decimals: 6,
  authority: adminKeypair,
});

await stable.mint({ recipient, amount: 1_000_000n });
await stable.compliance.blacklistAdd(suspectAddress, 'OFAC match', authority);
await stable.compliance.seize({ fromTokenAccount, toTokenAccount: treasury, amount: 1_000_000n, seizer: authority });
```

---

## Architecture

```
Layer 3 — Presets (SSS-1, SSS-2)
    └─ Layer 2 — Modules (Compliance, Privacy)
           └─ Layer 1 — Base SDK (Token-2022 mint, roles, CLI)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full layer model.

---

## Repository Structure

```
programs/
  sss-token/        # Main Anchor program (SSS-1 + SSS-2)
  transfer-hook/    # SSS-2 per-transfer blacklist enforcement
packages/
  sdk/              # @stbr/sss-token-sdk
  cli/              # sss-token CLI
services/
  mint-burn-service/
  event-indexer/
  compliance-service/
  webhook-service/
tests/              # Anchor + fuzz tests
docs/               # This documentation
```

---

## Running Services

```bash
cp .env.example .env   # Fill in your keys + program IDs
docker compose up -d
```

---

## Standards

- 📄 [SSS-1 — Minimal Stablecoin](./SSS-1.md)
- 📄 [SSS-2 — Compliant Stablecoin](./SSS-2.md)

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [SDK.md](./SDK.md)
- [OPERATIONS.md](./OPERATIONS.md)
- [COMPLIANCE.md](./COMPLIANCE.md)
- [API.md](./API.md)

---

## License

MIT — Superteam Brazil
