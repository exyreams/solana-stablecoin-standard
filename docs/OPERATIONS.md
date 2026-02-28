# Operator Runbook

This document describes how to operate a deployed stablecoin using the `sss-token` CLI.

## Prerequisites

```bash
# Set your environment
export SOLANA_RPC_URL=https://api.devnet.solana.com
export SOLANA_KEYPAIR_PATH=~/.config/solana/id.json
export STABLECOIN_MINT=<your-mint-address>
```

---

## Deployment (First Time)

```bash
# 1. Build programs
anchor build

# 2. Deploy to devnet
anchor deploy --provider.cluster devnet

# 3. Initialize SSS-1
sss-token init --preset sss-1 --name "My Dollar" --symbol "MYDOL"

# 4. Initialize SSS-2 (with compliance)
sss-token init --preset sss-2 --name "Compliant Dollar" --symbol "CUSD"
```

---

## Daily Operations

### Check Status
```bash
sss-token status
```

### Mint Tokens
```bash
sss-token mint <recipient-address> 1000
# Mints 1000.000000 tokens (6 decimals)
```

### Burn Tokens
```bash
sss-token burn 500 --from <token-account-address>
```

### View Holders
```bash
sss-token holders
sss-token holders --min-balance 100
```

---

## Emergency Operations

### Pause All Minting/Burning
```bash
sss-token pause
# Verify
sss-token status
```

### Resume Operations
```bash
sss-token unpause
```

### Freeze a Suspicious Account
```bash
sss-token freeze <token-account-address>
```

### Thaw After Investigation
```bash
sss-token thaw <token-account-address>
```

---

## SSS-2 Compliance Operations

### Blacklist an Address (OFAC / Sanctions)
```bash
sss-token blacklist add <wallet-address> --reason "OFAC SDN match"
```

### Verify Blacklist Status
```bash
sss-token blacklist check <wallet-address>
```

### Remove from Blacklist (After Remediation)
```bash
sss-token blacklist remove <wallet-address>
```

### Seize Tokens to Treasury
```bash
sss-token blacklist seize <from-token-account> \
  --to <treasury-token-account> \
  --amount 1000
```

---

## Role Management

### Add a Minter with Quota
```bash
sss-token minters add <minter-address> --quota 100000
# 0 quota = unlimited
```

### Remove a Minter
```bash
sss-token minters remove <minter-address>
```

---

## Audit Log
```bash
sss-token audit-log
sss-token audit-log --action blacklist --limit 20
```

---

## Backend Services

```bash
# Start all services
docker compose up -d

# Check health
curl http://localhost:3001/health   # mint-burn-service
curl http://localhost:3002/health   # event-indexer
curl http://localhost:3003/health   # compliance-service
curl http://localhost:3004/health   # webhook-service

# View recent events
curl http://localhost:3002/events | jq

# Audit trail
curl http://localhost:3003/audit | jq
```
