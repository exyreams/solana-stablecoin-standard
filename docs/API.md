# API Reference

All services use JSON over HTTP. Set `Content-Type: application/json`.

---

## Mint-Burn Service (`http://localhost:3001`)

### `POST /mint`
Mint tokens to a recipient.

**Body:**
```json
{ "recipient": "<wallet-address>", "amount": "1000.00" }
```
**Response:**
```json
{ "success": true, "signature": "5XK..." }
```

### `POST /burn`
Burn tokens from a token account.

**Body:**
```json
{ "fromTokenAccount": "<token-account>", "amount": "500.00" }
```

### `GET /health`
```json
{ "status": "ok", "service": "mint-burn-service" }
```

---

## Event Indexer (`http://localhost:3002`)

### `GET /events`
Returns last 100 captured on-chain events.

```json
{
  "count": 12,
  "events": [
    { "signature": "5XK...", "name": "TokensMinted", "data": {}, "timestamp": "2024-01-01T00:00:00Z" }
  ]
}
```

### `GET /health`
```json
{ "status": "ok", "eventsIndexed": 42 }
```

---

## Compliance Service (`http://localhost:3003`)

### `POST /blacklist`
Add address to blacklist.

**Body:**
```json
{ "address": "<wallet>", "reason": "OFAC SDN match" }
```

### `DELETE /blacklist/:address`
Remove address from blacklist.

### `GET /blacklist/:address`
Check blacklist status.
```json
{ "blacklisted": true, "entry": { "reason": "...", "timestamp": 1711234567 } }
```

### `GET /audit`
Export audit trail (last 100 mint-level transactions).

---

## Webhook Service (`http://localhost:3004`)

### `POST /subscribe`
Register a webhook endpoint.
```json
{ "url": "https://your-server.com/hook", "events": ["mint", "burn", "blacklist"] }
```
**Response:** `{ "id": "abc123" }`

### `DELETE /subscribe/:id`
Unsubscribe.

### `POST /dispatch` (internal)
Trigger a webhook event from another service.
```json
{ "event": "mint", "data": { "amount": "1000", "recipient": "..." } }
```

### `GET /health`
```json
{ "status": "ok", "subscribers": 3 }
```
