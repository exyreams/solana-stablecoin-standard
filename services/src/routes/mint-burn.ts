import { PublicKey } from "@solana/web3.js";
import { Queue } from "bullmq";
import { Hono } from "hono";
import Redis from "ioredis";
import { db } from "../db/index.js";
import { burnRequests, mintRequests } from "../db/schema.js";
import { log } from "../index.js";
import { adminAuth } from "../middleware/auth.js";

export const redisConnection = new Redis.default(
	process.env.REDIS_URL || "redis://localhost:6379",
	{
		maxRetriesPerRequest: null,
	},
);
// @ts-ignore - pnpm ioredis version mismatch
export const mintBurnQueue = new Queue("mint-burn", {
	connection: redisConnection,
});

const app = new Hono();

// Protect all mint-burn routes
app.use("/*", adminAuth);

app.post("/mint", async (c) => {
	const { recipient, amount, mintAddress } = await c.req.json();
	if (!recipient || !amount) {
		c.status(400);
		return c.json({ error: "recipient and amount are required" });
	}

	try {
		const [record] = await db
			.insert(mintRequests)
			.values({
				recipient,
				amount: amount.toString(),
				mintAddress: mintAddress || process.env.STABLECOIN_MINT,
			})
			.returning();

		await mintBurnQueue.add("mint-job", {
			type: "mint",
			id: record.id,
			mintAddress: record.mintAddress,
		});

		log.info({ id: record.id, mintAddress: record.mintAddress }, "Mint request queued");
		c.status(202);
		return c.json({ success: true, id: record.id, status: "PENDING" });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to process mint request");
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
});

app.post("/burn", async (c) => {
	const { fromTokenAccount, amount, mintAddress } = await c.req.json();
	if (!fromTokenAccount || !amount) {
		c.status(400);
		return c.json({ error: "fromTokenAccount and amount are required" });
	}

	try {
		const [record] = await db
			.insert(burnRequests)
			.values({
				fromTokenAccount,
				amount: amount.toString(),
				mintAddress: mintAddress || process.env.STABLECOIN_MINT,
			})
			.returning();

		await mintBurnQueue.add("burn-job", {
			type: "burn",
			id: record.id,
			mintAddress: record.mintAddress,
		});

		log.info({ id: record.id, mintAddress: record.mintAddress }, "Burn request queued");
		c.status(202);
		return c.json({ success: true, id: record.id, status: "PENDING" });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to process burn request");
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
});

export default app;
