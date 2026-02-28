# Compliance Guide

## Regulatory Context

SSS-2 is designed for issuers operating under frameworks like:
- **GENIUS Act** (US stablecoin regulation)
- **MiCA** (EU Markets in Crypto-Assets)
- **OFAC sanctions compliance**

---

## On-Chain Enforcement vs. Off-Chain Screening

| Layer | What happens |
|---|---|
| **Off-chain** | Sanctions screening (OFAC SDN lists, Chainalysis, TRM Labs) |
| **On-chain** | Blacklist PDA enforcement via transfer hook — **unforgeable** |

The compliance service (`services/compliance-service`) is the **integration point** between off-chain screening and on-chain enforcement. It exposes a REST API that your sanctions provider can call to trigger `add_to_blacklist`.

---

## Blacklisting Workflow

```
1. External sanctions API detects match
   POST /blacklist { address, reason: "OFAC SDN" }

2. compliance-service calls stable.compliance.blacklistAdd()
   → Creates BlacklistEntry PDA on-chain
   → Emits AddedToBlacklist event

3. Transfer hook rejects all transfers to/from the address
   (automatic — no further action needed)

4. Audit entry created with timestamp + reason

5. If cleared: DELETE /blacklist/:address
   → Closes PDA, reclaims rent
   → Emits RemovedFromBlacklist event
```

---

## Audit Trail Format

Each event emitted by the program contains:

```json
{
  "signature": "5XK...",
  "event": "AddedToBlacklist",
  "mint": "SSSToken...",
  "address": "BadActor...",
  "reason": "OFAC SDN match",
  "blacklister": "Operator...",
  "timestamp": 1711234567
}
```

Export via:
```bash
curl http://localhost:3003/audit | jq
sss-token audit-log --action blacklist
```

---

## Seizure

Token seizure uses the **permanent delegate** extension. The designated `seizer` role can transfer tokens from any account without the account owner's signature.

This is used for:
- Court-ordered asset freezes
- Law enforcement requests
- Recovery from compromised accounts

```bash
sss-token blacklist seize <from-token-account> --to <treasury> --amount 1000
```

---

## Key Contacts

Update these for your deployment:

| Role | Responsibility |
|---|---|
| `blacklister` | Sanctions screening integration |
| `seizer` | Court-ordered seizures |
| `pauser` | Emergency circuit breaker |
| `master_authority` | Ultimate authority — use hardware wallet |
