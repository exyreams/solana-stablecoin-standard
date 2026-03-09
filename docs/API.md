# API Reference — Unified SSS Backend

All routes are on a single Hono server (`PORT=3001`). Set `Content-Type: application/json`.

---

## Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ status: "ok" }` |

---

## Mint / Burn (SSS-1+)

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/mint-burn/mint` | `{ recipient, amount }` | Queue a mint request |
| `POST` | `/mint-burn/burn` | `{ fromTokenAccount, amount }` | Queue a burn request |

---

## Admin — Status & Lifecycle

| Method | Path | Body | Description |
|---|---|---|---|
| `GET` | `/admin/status` | — | High-level state, metadata, and roles |
| `GET` | `/admin/on-chain-status` | — | Raw blockchain account data (audit source) |
| `GET` | `/admin/supply` | — | Canonical on-chain total supply |
| `POST` | `/admin/metadata/initialize` | — | Write Token-2022 metadata to mint extension |
| `POST` | `/admin/metadata/metaplex` | — | Initialize Metaplex Metadata PDA (Standard visibility) |
| `DELETE` | `/admin/close-mint` | — | Permanently close mint (supply must be zero) |

## Admin — Roles

| Method | Path | Body | Description |
|---|---|---|---|
| `PUT` | `/admin/roles` | `{ burner?, pauser?, blacklister?, seizer? }` | Update role assignments |
| `POST` | `/admin/authority/transfer` | `{ newMaster }` | Initiate master authority transfer (step 1) |
| `POST` | `/admin/authority/accept` | — | Accept master authority transfer (step 2) |

## Admin — Minters

| Method | Path | Body | Description |
|---|---|---|---|
| `GET` | `/admin/minters` | — | List all minters |
| `POST` | `/admin/minters` | `{ address, quota }` | Add minter |
| `PUT` | `/admin/minters/:address` | `{ quota, active, resetMinted? }` | Update minter |
| `DELETE` | `/admin/minters/:address` | — | Remove minter |

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

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/compliance/freeze` | `{ address, reason? }` | Freeze a token account |
| `POST` | `/compliance/thaw` | `{ address, reason? }` | Thaw a token account |
| `POST` | `/compliance/pause` | `{ reason? }` | Pause minting & burning globally |
| `POST` | `/compliance/unpause` | `{ reason? }` | Unpause minting & burning |
| `GET` | `/compliance/audit` | `?limit=100` | Audit trail (all on-chain actions) |

## Compliance — Blacklist (SSS-2)

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/compliance/blacklist` | `{ address, reason }` | Blacklist an address |
| `DELETE` | `/compliance/blacklist/:address` | — | Remove from blacklist |
| `GET` | `/compliance/blacklist/:address` | — | Check blacklist status |
| `POST` | `/compliance/seize` | `{ fromTokenAccount, toTokenAccount, amount, reason? }` | Seize tokens via permanent delegate |

## Compliance — Privacy (SSS-3)

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/privacy/approve` | `{ tokenAccount, reason? }` | Approve account for confidential transfers |
| `POST` | `/privacy/enable-credits` | `{ tokenAccount }` | Enable confidential credits |
| `POST` | `/privacy/disable-credits` | `{ tokenAccount }` | Disable confidential credits |

---

## Events

| Method | Path | Description |
|---|---|---|
| `GET` | `/events` | Last 100 indexed on-chain events |

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
