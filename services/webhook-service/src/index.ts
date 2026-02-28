import express, { Request, Response } from 'express';
import pino from 'pino';

const log = pino({ level: process.env.LOG_LEVEL ?? 'info' });
const app = express();
app.use(express.json());

interface Subscriber {
    id: string;
    url: string;
    events: string[]; // e.g. ['mint', 'burn', 'blacklist']
}

interface WebhookPayload {
    event: string;
    data: unknown;
    timestamp: string;
}

const subscribers: Subscriber[] = [];

// ── Subscriber management ─────────────────────────────────────────────────────

app.post('/subscribe', (req: Request, res: Response) => {
    const { url, events } = req.body;
    if (!url || !events) return res.status(400).json({ error: 'url and events required' });
    const id = Math.random().toString(36).slice(2);
    subscribers.push({ id, url, events });
    log.info({ id, url, events }, 'Subscriber registered');
    res.status(201).json({ id });
});

app.delete('/subscribe/:id', (req: Request, res: Response) => {
    const idx = subscribers.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Subscriber not found' });
    subscribers.splice(idx, 1);
    res.json({ success: true });
});

// ── Dispatch (called internally by other services) ────────────────────────────

async function dispatch(payload: WebhookPayload, retries = 3) {
    const targets = subscribers.filter(
        (s) => s.events.includes('*') || s.events.includes(payload.event),
    );

    for (const target of targets) {
        let attempt = 0;
        while (attempt < retries) {
            try {
                const res = await fetch(target.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    log.info({ url: target.url, event: payload.event }, 'Webhook delivered');
                    break;
                }
                throw new Error(`HTTP ${res.status}`);
            } catch (err: any) {
                attempt++;
                log.warn({ url: target.url, attempt, err: err.message }, 'Webhook retry');
                await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
            }
        }
    }
}

app.post('/dispatch', async (req: Request, res: Response) => {
    const payload: WebhookPayload = {
        event: req.body.event,
        data: req.body.data,
        timestamp: new Date().toISOString(),
    };
    dispatch(payload).catch(log.error.bind(log));
    res.json({ success: true, subscriberCount: subscribers.length });
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'webhook-service', subscribers: subscribers.length });
});

const PORT = parseInt(process.env.PORT ?? '3000');
app.listen(PORT, () => log.info({ PORT }, 'webhook-service started'));
