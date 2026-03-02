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

### View Current Roles
```bash
sss-token roles show
```

### Update Roles
```bash
sss-token roles update --burner <address> --pauser <address>
sss-token roles update --blacklister <address> --seizer <address>
```

### Transfer Master Authority (Two-Step)
```bash
# Step 1: Current master initiates transfer
sss-token roles transfer <new-master-address>

# Step 2: New master accepts
sss-token roles accept
```

### Manage Minters
```bash
# List all minters
sss-token minters list

# Add a minter with quota
sss-token minters add <minter-address> --quota 100000
# 0 quota = unlimited

# Update minter quota or status
sss-token minters update <minter-address> --quota 200000 --active
sss-token minters update <minter-address> --no-active  # Disable minter

# Remove a minter
sss-token minters remove <minter-address>
```

---

## SSS-3 Privacy Operations

### Approve Account for Confidential Transfers
```bash
sss-token privacy approve <token-account>
```

### Enable/Disable Confidential Credits
```bash
sss-token privacy enable-credits <token-account>
sss-token privacy disable-credits <token-account>
```

---

## Oracle Operations (Non-USD Pegs)

### Initialize Oracle
```bash
sss-token oracle init --base EUR --quote USD \
  --staleness 300 --method median
```

### Add Price Feeds
```bash
sss-token oracle add-feed --index 0 --type switchboard \
  --address <feed-pubkey> --label "Switchboard EUR/USD"

sss-token oracle add-feed --index 1 --type pyth \
  --address <feed-pubkey> --label "Pyth EUR/USD"
```

### Crank Feed (Update Price)
```bash
sss-token oracle crank 0 --price 1050000000 --confidence 1000000
# Price in 9-decimal fixed-point (1.05 = 1050000000)
```

### Get Current Price
```bash
sss-token oracle price --side mint
sss-token oracle price --side redeem
```

### View Oracle Status
```bash
sss-token oracle status
sss-token oracle feeds
```

### Update Oracle Config
```bash
sss-token oracle update --staleness 600 --method weighted
```

---

## Real-Time Monitoring

### Launch Interactive TUI
```bash
sss-token tui
```

The TUI provides:
- Real-time token info and supply
- Role assignments
- Minters table with quotas
- Supply history chart
- Activity log

Press `q` to quit, `r` to refresh manually.

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
