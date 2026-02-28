# SSS-3: Private Stablecoin Standard

## Overview

SSS-3 (Solana Stablecoin Standard - Private) extends the base stablecoin functionality with privacy-preserving features using Token-2022's confidential transfer extension. This standard is designed for use cases requiring transaction privacy while maintaining regulatory compliance through optional auditor access.

## Status

**⚠️ EXPERIMENTAL** - The confidential transfer tooling on Solana is still maturing. This standard is provided as a proof-of-concept and should be thoroughly tested before production use.

## Architecture

SSS-3 builds on SSS-1 (minimal stablecoin) by adding:

1. **Confidential Transfer Extension** - Encrypts transfer amounts using ElGamal encryption
2. **Allowlist System** - Only approved accounts can perform confidential transfers
3. **Optional Auditor** - Designated auditor can decrypt all confidential transfers
4. **Privacy Controls** - Account owners can enable/disable confidential credits

## Features

### Core Privacy Features

- **Encrypted Balances**: Token balances are encrypted using ElGamal encryption
- **Confidential Transfers**: Transfer amounts are hidden from public view
- **Zero-Knowledge Proofs**: Transfers include proofs of validity without revealing amounts
- **Auditor Access**: Optional auditor can decrypt all transactions for compliance

### Access Control

- **Allowlist Management**: Authority can approve/revoke accounts for confidential transfers
- **Auto-Approve Mode**: Optionally auto-approve new accounts
- **Per-Account Controls**: Users can enable/disable receiving confidential transfers

## Token-2022 Extensions Used

- `ConfidentialTransferMint` - Enables confidential transfers at the mint level
- `ConfidentialTransferAccount` - Per-account confidential transfer state
- Metadata Pointer (inherited from SSS-1)
- Mint Close Authority (inherited from SSS-1)

## Instructions

### Initialization

```rust
pub struct StablecoinConfig {
    // Base SSS-1 fields
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    
    // SSS-3 specific
    pub enable_confidential_transfers: bool,
    pub confidential_transfer_auto_approve: bool,
    
    // SSS-2 fields (set to false for pure SSS-3)
    pub enable_permanent_delegate: bool,
    pub enable_transfer_hook: bool,
    pub default_account_frozen: bool,
}
```

### SSS-3 Specific Instructions

#### 1. Configure Confidential Transfer

Sets up the confidential transfer parameters for the mint.

```rust
pub fn configure_confidential_transfer(
    ctx: Context<ConfigureConfidentialTransfer>,
    auto_approve_new_accounts: bool,
    auditor_elgamal_pubkey: Option<[u8; 32]>,
) -> Result<()>
```

**Parameters:**
- `auto_approve_new_accounts` - If true, new accounts are automatically approved
- `auditor_elgamal_pubkey` - Optional ElGamal public key for auditor access

#### 2. Approve Account

Adds an account to the allowlist for confidential transfers.

```rust
pub fn approve_account(
    ctx: Context<ApproveAccount>
) -> Result<()>
```

**Access:** Master authority only

#### 3. Enable Confidential Credits

Allows an account to receive confidential transfers.

```rust
pub fn enable_confidential_credits(
    ctx: Context<EnableConfidentialCredits>
) -> Result<()>
```

**Access:** Account owner

#### 4. Disable Confidential Credits

Prevents an account from receiving confidential transfers.

```rust
pub fn disable_confidential_credits(
    ctx: Context<DisableConfidentialCredits>
) -> Result<()>
```

**Access:** Account owner

## Use Cases

### 1. Private Payment Networks

Organizations that need internal payment privacy while maintaining audit capabilities.

```
Example: Corporate treasury operations where transaction amounts 
should be hidden from competitors but available to auditors.
```

### 2. Privacy-Preserving DeFi

DeFi protocols that want to offer privacy to users while maintaining compliance.

```
Example: Private lending pools where borrower amounts are confidential
but protocol solvency is verifiable.
```

### 3. Confidential Payroll

Payroll systems where individual salaries should remain private.

```
Example: DAO contributor payments where amounts are encrypted but
total treasury outflows are public.
```

## Comparison with Other Standards

| Feature | SSS-1 | SSS-2 | SSS-3 |
|---------|-------|-------|-------|
| Basic mint/burn | ✅ | ✅ | ✅ |
| Freeze accounts | ✅ | ✅ | ✅ |
| Blacklist enforcement | ❌ | ✅ | ❌* |
| Token seizure | ❌ | ✅ | ❌* |
| Confidential transfers | ❌ | ❌ | ✅ |
| Encrypted balances | ❌ | ❌ | ✅ |
| Allowlist system | ❌ | ❌ | ✅ |
| Auditor access | ❌ | ❌ | ✅ |

*SSS-3 can be combined with SSS-2 features if needed

## Security Considerations

### Cryptographic Assumptions

- **ElGamal Encryption**: Security relies on the discrete logarithm problem
- **Zero-Knowledge Proofs**: Uses Bulletproofs for range proofs
- **Key Management**: Users must securely manage their ElGamal keypairs

### Privacy Limitations

1. **Timing Analysis**: Transaction timing is still public
2. **Graph Analysis**: Transaction graph (sender/receiver) is public
3. **Amount Ranges**: Range proofs reveal amount is within valid range
4. **Auditor Access**: Auditor can decrypt all transactions if configured

### Operational Risks

1. **Key Loss**: Lost ElGamal keys mean lost access to encrypted balances
2. **Proof Generation**: Requires client-side computation for proofs
3. **Tooling Maturity**: Confidential transfer tooling is still evolving
4. **Performance**: Confidential transfers are more expensive than regular transfers

## Implementation Status

### ✅ Completed

- [x] Program structure for SSS-3 instructions
- [x] Configuration support in StablecoinConfig
- [x] State tracking for confidential transfer settings
- [x] Instruction scaffolding (approve, enable/disable credits)

### 🚧 In Progress

- [ ] Full confidential transfer CPI implementation
- [ ] ElGamal keypair management utilities
- [ ] Zero-knowledge proof generation
- [ ] Auditor key configuration

### 📋 Pending

- [ ] Client SDK for confidential transfers
- [ ] CLI commands for SSS-3 operations
- [ ] Integration tests with confidential transfers
- [ ] Documentation for key management
- [ ] Example frontend with privacy features

## Client SDK Example

```typescript
import { SolanaStablecoin, Presets } from "@stbr/sss-token";

// Initialize SSS-3 stablecoin
const privateStable = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_3,
  name: "Private Stablecoin",
  symbol: "PVTUSD",
  decimals: 6,
  authority: adminKeypair,
  confidentialTransferAutoApprove: false,
  auditorElGamalPubkey: auditorPubkey, // Optional
});

// Configure confidential transfers
await privateStable.privacy.configure({
  autoApprove: false,
  auditorPubkey: auditorElGamalPubkey,
});

// Approve an account for confidential transfers
await privateStable.privacy.approveAccount(userTokenAccount);

// User enables confidential credits
await privateStable.privacy.enableConfidentialCredits(
  userTokenAccount,
  userKeypair
);

// Perform confidential transfer (amount is encrypted)
await privateStable.privacy.confidentialTransfer({
  from: sourceAccount,
  to: destAccount,
  amount: 1_000_000,
  sourceKeypair: sourceOwner,
});
```

## CLI Example

```bash
# Initialize SSS-3 stablecoin
sss-token init --preset sss-3 \
  --name "Private USD" \
  --symbol "PVTUSD" \
  --decimals 6 \
  --auto-approve false

# Configure confidential transfers
sss-token privacy configure \
  --auto-approve false \
  --auditor-pubkey <AUDITOR_ELGAMAL_PUBKEY>

# Approve account for confidential transfers
sss-token privacy approve <TOKEN_ACCOUNT>

# Enable confidential credits (as account owner)
sss-token privacy enable-credits <TOKEN_ACCOUNT>

# Perform confidential transfer
sss-token privacy transfer \
  --from <SOURCE_ACCOUNT> \
  --to <DEST_ACCOUNT> \
  --amount 1000 \
  --confidential
```

## Testing

### Unit Tests

Test individual SSS-3 instructions in isolation.

### Integration Tests

1. Initialize SSS-3 mint
2. Configure confidential transfers
3. Approve accounts
4. Enable confidential credits
5. Perform confidential transfers
6. Verify encrypted balances
7. Test auditor decryption (if configured)

### Devnet Deployment

Deploy to Devnet and test full workflow with real confidential transfers.

## Resources

- [Token-2022 Confidential Transfer Extension](https://spl.solana.com/token-2022/extensions#confidential-transfers)
- [ElGamal Encryption](https://en.wikipedia.org/wiki/ElGamal_encryption)
- [Bulletproofs](https://crypto.stanford.edu/bulletproofs/)
- [Solana Confidential Transfer Guide](https://docs.solana.com/developing/programming-model/confidential-transfers)

## Future Enhancements

1. **Hybrid Mode**: Combine SSS-2 compliance with SSS-3 privacy
2. **Selective Disclosure**: Allow users to prove specific facts about encrypted balances
3. **Multi-Auditor**: Support multiple auditors with different access levels
4. **Privacy Pools**: Group confidential transfers for enhanced privacy
5. **Cross-Chain Privacy**: Bridge confidential transfers to other chains

## License

MIT

## Contributing

This is an experimental standard. Contributions, feedback, and security audits are welcome.

## Disclaimer

SSS-3 is a proof-of-concept. The confidential transfer extension is still maturing, and this implementation should be thoroughly audited before production use. Privacy guarantees depend on proper key management and operational security.
