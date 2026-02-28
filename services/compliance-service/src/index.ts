import express, { Request, Response } from 'express';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { SolanaStablecoin } from '@stbr/sss-token-sdk';
import pino from 'pino';

const log = pino({ level: process.env.LOG_LEVEL ?? 'info' });
const app = express();
app.use(express.json());

const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
const mint = new PublicKey(process.env.STABLECOIN_MINT!);
const authority = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.AUTHORITY_SECRET_KEY!)),
);

let stable: SolanaStablecoin;
async function getStable() {
    if (!stable) stable = await SolanaStablecoin.load(connection, mint, authority);
    return stable;
}

// ── Blacklist routes ──────────────────────────────────────────────────────────

app.post('/blacklist', async (req: Request, res: Response) => {
    const { address, reason } = req.body;
    if (!address || !reason) return res.status(400).json({ error: 'address and reason required' });
    try {
        const s = await getStable();
        const sig = await s.compliance.blacklistAdd(new PublicKey(address), reason, authority);
        log.info({ address, reason, sig }, 'Blacklisted');
        res.json({ success: true, signature: sig });
    } catch (err: any) {
        log.error({ err: err.message }, 'Blacklist add failed');
        res.status(500).json({ error: err.message });
    }
});

app.delete('/blacklist/:address', async (req: Request, res: Response) => {
    const { address } = req.params;
    try {
        const s = await getStable();
        const sig = await s.compliance.blacklistRemove(new PublicKey(address), authority);
        log.info({ address, sig }, 'Removed from blacklist');
        res.json({ success: true, signature: sig });
    } catch (err: any) {
        log.error({ err: err.message }, 'Blacklist remove failed');
        res.status(500).json({ error: err.message });
    }
});

app.get('/blacklist/:address', async (req: Request, res: Response) => {
    const { address } = req.params;
    try {
        const s = await getStable();
        const entry = await s.compliance.getBlacklistEntry(new PublicKey(address));
        res.json({ blacklisted: !!entry, entry: entry ?? null });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ── Audit trail ───────────────────────────────────────────────────────────────

app.get('/audit', async (_req: Request, res: Response) => {
    try {
        const sigs = await connection.getSignaturesForAddress(mint, { limit: 100 });
        res.json({
            count: sigs.length,
            entries: sigs.map((s) => ({
                signature: s.signature,
                blockTime: s.blockTime,
                status: s.err ? 'failed' : 'ok',
            })),
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'compliance-service' });
});

const PORT = parseInt(process.env.PORT ?? '3000');
app.listen(PORT, () => log.info({ PORT }, 'compliance-service started'));
