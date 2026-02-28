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

// Lazy-loaded stable instance
let stable: SolanaStablecoin;
async function getStable(): Promise<SolanaStablecoin> {
    if (!stable) stable = await SolanaStablecoin.load(connection, mint, authority);
    return stable;
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.post('/mint', async (req: Request, res: Response) => {
    const { recipient, amount } = req.body;
    if (!recipient || !amount) {
        return res.status(400).json({ error: 'recipient and amount are required' });
    }
    try {
        log.info({ recipient, amount }, 'Mint request received');
        const s = await getStable();
        const status = await s.getStatus();
        const rawAmount = BigInt(Math.round(parseFloat(amount) * 10 ** status.decimals));
        const sig = await s.mint({ recipient: new PublicKey(recipient), amount: rawAmount });
        log.info({ sig, recipient, amount }, 'Mint successful');
        res.json({ success: true, signature: sig });
    } catch (err: any) {
        log.error({ err: err.message }, 'Mint failed');
        res.status(500).json({ error: err.message });
    }
});

app.post('/burn', async (req: Request, res: Response) => {
    const { fromTokenAccount, amount } = req.body;
    if (!fromTokenAccount || !amount) {
        return res.status(400).json({ error: 'fromTokenAccount and amount are required' });
    }
    try {
        log.info({ fromTokenAccount, amount }, 'Burn request received');
        const s = await getStable();
        const status = await s.getStatus();
        const rawAmount = BigInt(Math.round(parseFloat(amount) * 10 ** status.decimals));
        const sig = await s.burn({ fromTokenAccount: new PublicKey(fromTokenAccount), amount: rawAmount });
        log.info({ sig, amount }, 'Burn successful');
        res.json({ success: true, signature: sig });
    } catch (err: any) {
        log.error({ err: err.message }, 'Burn failed');
        res.status(500).json({ error: err.message });
    }
});

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'mint-burn-service', timestamp: new Date().toISOString() });
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '3000');
app.listen(PORT, () => {
    log.info({ PORT }, 'mint-burn-service started');
});
