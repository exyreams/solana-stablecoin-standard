# API Reference — Unified SSS Backend

All routes are on a single Hono server (`PORT=3001`). Set `Content-Type: application/json`.

## Authentication

Most routes (except Health and Public Stablecoin info) require a JSON Web Token (JWT).
- **Header**: `Authorization: Bearer <your_jwt_token>`
- **Roles**: `ADMIN` (Full access) or `MINTER` (Mint/Burn only)

---

## Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ status: "ok" }` |

## Authentication (Admin/Minter)

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/admin/register` | `{ username, password, secretToken }` | Register a new Admin (requires secret token) |
| `POST` | `/admin/login` | `{ username, password }` | Login and receive a JWT token |

---

## Stablecoin Management

| Method | Path | Body | Description | Auth |
|---|---|---|---|---|
| `POST` | `/create-stablecoin` | `{ preset, name, symbol, decimals?, uri?, extensions?, roles? }` | Create a new stablecoin | `ADMIN` |
| `GET` | `/list-stablecoins` | `?limit=50&offset=0` | List all created stablecoins | `ADMIN`/`MINTER` |
| `GET` | `/get-stablecoin/:mintAddress` | — | Get a specific stablecoin details | `ADMIN`/`MINTER` |
| `GET` | `/get-stablecoin/:mintAddress/history` | — | Get recent mint/burn history | `ADMIN`/`MINTER` |

---

## Mint / Burn (SSS-1+)

| Method | Path | Body | Description | Auth |
|---|---|---|---|---|
| `POST` | `/mint-burn/mint` | `{ recipient, amount, mintAddress, minter }` | Queue a mint request (Admin flow) | `ADMIN` |
| `POST` | `/mint-burn/prepare-mint` | `{ recipient, amount, mintAddress, minter }` | Prepare a mint transaction (Minter flow). Returns `{ transaction: string }` (base64) | `MINTER`/`ADMIN` |
| `POST` | `/mint-burn/burn` | `{ fromTokenAccount, amount, mintAddress, minter }` | Queue a burn request (Admin flow) | `ADMIN` |
| `POST` | `/mint-burn/prepare-burn` | `{ fromTokenAccount, amount, mintAddress, minter }` | Prepare a burn transaction (Minter flow). Returns `{ transaction: string }` (base64) | `MINTER`/`ADMIN` |

---

## Admin — Status & Lifecycle

| Method | Path | Body | Description | Auth |
|---|---|---|---|---|
| `GET` | `/admin/status` | — | High-level state, metadata, and roles | `ADMIN` |
| `GET` | `/admin/on-chain-status` | — | Raw blockchain account data | `ADMIN` |
| `GET` | `/admin/supply` | — | Canonical on-chain total supply | `ADMIN` |
| `GET` | `/admin/authority` | — | Get backend authority public key | `MINTER`/`ADMIN` |
| `DELETE` | `/admin/close-mint` | — | Permanently close mint | `ADMIN` |

## Admin — Roles

| Method | Path | Body | Description |
|---|---|---|---|
| `PUT` | `/admin/roles` | `{ burner?, pauser?, blacklister?, seizer? }` | Update role assignments |
| `POST` | `/admin/authority/transfer` | `{ newMaster }` | Initiate master authority transfer (step 1) |
| `POST` | `/admin/authority/accept` | — | Accept master authority transfer (step 2) |

## Admin — Minters

| Method | Path | Body | Description | Auth |
|---|---|---|---|---|
| `GET` | `/admin/minters` | — | List all minters | `ADMIN` |
| `GET` | `/admin/minter-status/:wallet` | — | Check wallet's authorized mints | `MINTER`/`ADMIN` |
| `POST` | `/admin/minters` | `{ address, quota }` | Add minter | `ADMIN` |
| `PUT` | `/admin/minters/:address` | `{ quota, active, resetMinted? }` | Update minter | `ADMIN` |
| `DELETE` | `/admin/minters/:address` | — | Remove minter | `ADMIN` |

## Admin — Transfer Hook (SSS-2)

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/admin/hook/initialize` | — | Initialize `ExtraAccountMetaList` PDA (call once after SSS-2 deployment) |

## Admin — Oracle

| Method | Path | Body | Description |
|---|---|---|---|
| `GET` | `/admin/oracle/status` | — | Oracle config + all feeds |
| `GET` | `/admin/oracle/feeds/:index` | — | Single feed by index |
| `GET` | `/admin/oracle/price/mint` | — | Get mint price (aggregated + premium) |
| `GET` | `/admin/oracle/price/redeem` | — | Get redeem price (aggregated - discount) |
| `POST` | `/admin/oracle/initialize` | `{ baseCurrency, quoteCurrency, ... }` | Initialize oracle for this mint |
| `PUT` | `/admin/oracle/config` | `{ maxStalenessSeconds?, aggregationMethod?, ... }` | Update oracle config |
| `POST` | `/admin/oracle/feeds` | `{ feedIndex, feedType, feedAddress?, label, weight? }` | Add price feed |
| `DELETE` | `/admin/oracle/feeds/:index` | — | Remove feed |
| `POST` | `/admin/oracle/crank` | `{ feedIndex, price }` | Manually crank a feed (price as float, e.g. 1.05) |
| `POST` | `/admin/oracle/aggregate` | `{ feedAccounts: string[] }` | Aggregate all feeds |
| `POST` | `/admin/oracle/manual-price` | `{ price, active }` | Set manual price override |
| `DELETE` | `/admin/oracle/close` | — | Close oracle (all feeds must be removed first) |
| `POST` | `/admin/oracle/authority/transfer` | `{ newAuthority }` | Initiate oracle authority transfer |
| `POST` | `/admin/oracle/authority/accept` | — | Accept oracle authority transfer |

---

## Compliance (SSS-1+)

| Method | Path | Body | Description | Auth |
|---|---|---|---|---|
| `POST` | `/compliance/freeze` | `{ address, reason? }` | Freeze a token account | `ADMIN` |
| `POST` | `/compliance/thaw` | `{ address, reason? }` | Thaw a token account | `ADMIN` |
| `POST` | `/compliance/pause` | `{ reason? }` | Pause minting & burning globally | `ADMIN` |
| `POST` | `/compliance/unpause` | `{ reason? }` | Unpause minting & burning | `ADMIN` |
| `GET` | `/compliance/audit` | `?limit=100` | Audit trail (all on-chain actions) | `ADMIN` |

## Compliance — Blacklist (SSS-2)

| Method | Path | Body | Description | Auth |
|---|---|---|---|---|
| `POST` | `/compliance/blacklist` | `{ address, reason }` | Blacklist an address | `ADMIN` |
| `DELETE` | `/compliance/blacklist/:address` | — | Remove from blacklist | `ADMIN` |
| `GET` | `/compliance/blacklist/:address` | — | Check blacklist status | `ADMIN` |
| `POST` | `/compliance/seize` | `{ fromTokenAccount, toTokenAccount, amount, reason? }` | Seize tokens via permanent delegate | `ADMIN` |

## Compliance — Privacy (SSS-3)

| Method | Path | Body | Description | Auth |
|---|---|---|---|---|
| `POST` | `/privacy/approve` | `{ tokenAccount, reason? }` | Approve account for confidential transfers | `ADMIN` |
| `POST` | `/privacy/enable-credits` | `{ tokenAccount, reason? }` | Enable confidential credits | `ADMIN` |
| `POST` | `/privacy/disable-credits` | `{ tokenAccount, reason? }` | Disable confidential credits | `ADMIN` |

---

## Webhooks

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/webhooks/subscribe` | `{ url, events: string[] }` | Subscribe to events (use `"*"` for all) |
| `DELETE` | `/webhooks/subscribe/:id` | — | Unsubscribe |
| `POST` | `/webhooks/dispatch` | `{ event, data }` | Internal: trigger event dispatch |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `file:./db/dev.db` | SQLite path |
| `SOLANA_RPC_URL` | `https://api.devnet.solana.com` | Solana RPC |
| `STABLECOIN_MINT` | — | Mint address |
| `AUTHORITY_SECRET_KEY` | — | Authority keypair as JSON byte array |
| `REDIS_URL` | `redis://localhost:6379` | Redis for BullMQ |
| `PORT` | `3001` | HTTP port |
| `LOG_LEVEL` | `info` | Pino log level |
