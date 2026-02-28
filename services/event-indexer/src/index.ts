import { Connection, PublicKey } from '@solana/web3.js';
import { BorshCoder, EventParser } from '@coral-xyz/anchor';
import pino from 'pino';
import express from 'express';

const log = pino({ level: process.env.LOG_LEVEL ?? 'info' });
const app = express();
const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
const programId = new PublicKey(process.env.SSS_TOKEN_PROGRAM_ID!);

// In-memory event store (replace with DB in production)
const events: Array<{ signature: string; name: string; data: unknown; timestamp: string }> = [];

async function startListener() {
    log.info({ programId: programId.toBase58() }, 'Starting event listener');

    connection.onLogs(programId, async (logs, ctx) => {
        if (logs.err) return;

        // Parse Anchor event logs
        for (const line of logs.logs) {
            if (line.startsWith('Program data:')) {
                try {
                    // Anchor event data comes after "Program data: " prefix
                    events.push({
                        signature: logs.signature,
                        name: 'RawEvent',
                        data: { raw: line },
                        timestamp: new Date().toISOString(),
                    });
                    log.info({ sig: logs.signature }, 'Event captured');
                } catch {
                    // Not all log lines are events
                }
            }
        }
    }, 'confirmed');
}

// ── API ───────────────────────────────────────────────────────────────────────

app.get('/events', (_req, res) => {
    res.json({ count: events.length, events: events.slice(-100) });
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'event-indexer', eventsIndexed: events.length });
});

const PORT = parseInt(process.env.PORT ?? '3000');
app.listen(PORT, async () => {
    log.info({ PORT }, 'event-indexer started');
    await startListener();
});
