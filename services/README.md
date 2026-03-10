# SSS Backend Services

Backend services for the Solana Stablecoin Standard (SSS) - event indexing, mint/burn coordination, compliance monitoring, and webhooks.

## Architecture

- **Event Indexer** - Monitors on-chain events from sss-token, transfer-hook, and sss-oracle programs
- **Mint/Burn Service** - Coordinates fiat-to-stablecoin lifecycle (request → verify → execute → log)
- **Compliance Service** - SSS-2 blacklist management, sanctions screening integration, audit trail
- **Webhook Service** - Configurable event notifications with retry logic
- **Oracle Crank** - Automated price feed updates from external sources

## Prerequisites

- Node.js 18+ or Docker
- PostgreSQL 14+ (or use Docker Compose)
- Solana CLI tools (for devnet deployment)
- pnpm (for local development)

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker compose up

# Start in detached mode
docker compose up -d

# Rebuild and restart (after code changes)
docker compose down
docker compose build --no-cache
docker compose up -d

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f sss-backend

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v
```

Services will be available at:
- API: http://localhost:3001
- PostgreSQL: localhost:5432
- Adminer (DB UI): http://localhost:8080

### Option 2: Local Development

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev

# Or start production server
pnpm build
pnpm start
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Network
SOLANA_RPC_URL=https://api.devnet.solana.com

# Stablecoin mint address (set after first deploy)
STABLECOIN_MINT=your_mint_address_here

# Authority keypair as JSON array
AUTHORITY_SECRET_KEY=[1,2,3,...,64]

# Redis
REDIS_URL=redis://localhost:6379

# Database
DATABASE_URL=file:./db/dev.db

# API
PORT=3000

# CORS allowed origins (comma-separated list)
# Add your frontend URLs here
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Logging
LOG_LEVEL=info
```

### CORS Configuration

The `CORS_ORIGINS` environment variable accepts a comma-separated list of allowed origins:

```bash
# Development (multiple local ports)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Production (single domain)
CORS_ORIGINS=https://yourdomain.com

# Mixed environments
CORS_ORIGINS=http://localhost:5173,https://staging.yourdomain.com,https://yourdomain.com
```

If not set, defaults to `http://localhost:5173`.

## Scripts

### Development
```bash
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm lint             # Lint code
```

### Database
```bash
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:reset         # Reset database
```

### Deployment
```bash
pnpm setup:devnet     # Deploy test token to devnet
pnpm setup:mainnet    # Deploy to mainnet (use with caution)
```

## API Endpoints

For complete API documentation, see [API.md](../docs/API.md).

### Health Check
```bash
GET /health
```

### Events
```bash
GET /events                    # List all events
GET /events/:mint              # Events for specific mint
GET /events/:mint/:type        # Filter by event type
```

### Mint/Burn
```bash
POST /mint                     # Request mint operation
POST /burn                     # Request burn operation
GET /operations/:id            # Get operation status
```

### Compliance (SSS-2)
```bash
GET /compliance/blacklist/:mint           # List blacklisted addresses
POST /compliance/blacklist/:mint          # Add to blacklist
DELETE /compliance/blacklist/:mint/:addr  # Remove from blacklist
GET /compliance/audit/:mint               # Audit trail
```

### Oracle
```bash
GET /oracle/:mint/price        # Get current price
GET /oracle/:mint/feeds        # List price feeds
POST /oracle/:mint/crank       # Trigger price update
```

### Webhooks
```bash
POST /webhooks                 # Register webhook
GET /webhooks                  # List webhooks
DELETE /webhooks/:id           # Delete webhook
```

## Docker Compose Services

### Services Included

- **api** - Node.js backend API
- **postgres** - PostgreSQL database
- **adminer** - Database management UI
- **indexer** - Event indexer service
- **oracle-crank** - Automated oracle updates

### Volumes

- `postgres-data` - Database persistence
- `./db` - Local database files (for SQLite fallback)

### Networks

- `sss-network` - Internal network for service communication

## Database Schema

### Tables

- `events` - On-chain event log
- `operations` - Mint/burn operation tracking
- `blacklist` - SSS-2 blacklist cache
- `webhooks` - Webhook registrations
- `oracle_prices` - Price feed history
- `audit_log` - Compliance audit trail

## Monitoring

### Logs

```bash
# View all logs
docker compose logs -f

# View specific service
docker compose logs -f api
docker compose logs -f indexer
docker compose logs -f oracle-crank
```

### Health Checks

```bash
# API health
curl http://localhost:3001/health

# Database health
docker compose exec postgres pg_isready
```

## Development Workflow

1. **Start services**: `docker compose up -d`
2. **Deploy test token**: `pnpm setup:devnet`
3. **Update .env**: Add mint address from deployment
4. **Test API**: `curl http://localhost:3001/events`
5. **View logs**: `docker compose logs -f`
6. **Stop services**: `docker compose down`

## Production Deployment

### Environment Variables

Set these in your production environment:

```bash
NODE_ENV=production
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
DATABASE_URL=postgresql://user:pass@prod-db:5432/sss
WEBHOOK_SECRET=<strong-random-secret>
```

### Security Checklist

- [ ] Use strong database passwords
- [ ] Enable SSL for database connections
- [ ] Set secure webhook secrets
- [ ] Use environment-specific RPC endpoints
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts
- [ ] Configure log rotation
- [ ] Use secrets management (AWS Secrets Manager, etc.)

### Scaling

- Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
- Deploy multiple API instances behind load balancer
- Use Redis for caching and rate limiting
- Set up horizontal pod autoscaling (Kubernetes)

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up -d
```

### Event Indexer Not Working

```bash
# Check indexer logs
docker compose logs indexer

# Verify program IDs in .env
# Verify RPC endpoint is accessible
curl $SOLANA_RPC_URL -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

### Oracle Crank Failing

```bash
# Check oracle-crank logs
docker compose logs oracle-crank

# Verify cranker keypair exists
ls -la ~/.config/solana/id.json

# Check cranker balance
solana balance ~/.config/solana/id.json --url devnet
```

## Contributing

See main repository [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](../LICENSE) for details.
