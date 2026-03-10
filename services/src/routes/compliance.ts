import { PublicKey } from "@solana/web3.js";
import { count, desc } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { auditLogs } from "../db/schema.js";
import { authority, getStable, log } from "../index.js";
import { adminAuth } from "../middleware/auth.js";

const app = new Hono();

// Protect all compliance routes
app.use("/*", adminAuth);

// ---- BLACKLIST (SSS-2) ----

app.post("/blacklist", async (c) => {
	const { address, reason } = await c.req.json();
	if (!address) {
		c.status(400);
		return c.json({ error: "address required" });
	}

	try {
		const finalReason = reason || "Manual addition";
		const s = await getStable();
		const sig = await s.compliance.blacklistAdd(
			new PublicKey(address),
			finalReason,
			authority,
		);

		await db.insert(auditLogs).values({
			action: "BLACKLIST_ADD",
			address,
			reason: finalReason,
			signature: sig,
		});

		log.info({ address, finalReason, sig }, "Address blacklisted");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message, address }, "Failed to add to blacklist");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.delete("/blacklist/:address", async (c) => {
	const address = c.req.param("address");
	try {
		const s = await getStable();
		const sig = await s.compliance.blacklistRemove(
			new PublicKey(address),
			authority,
		);

		await db.insert(auditLogs).values({
			action: "BLACKLIST_REMOVE",
			address,
			reason: "Removed by admin",
			signature: sig,
		});

		log.info({ address, sig }, "Address removed from blacklist");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message, address }, "Failed to remove from blacklist");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.get("/blacklist/:address", async (c) => {
	const address = c.req.param("address");
	try {
		const s = await getStable();
		const entry = await s.compliance.getBlacklistEntry(new PublicKey(address));
		if (!entry) {
			return c.json({ blacklisted: false });
		}
		return c.json({
			blacklisted: true,
			entry: { reason: entry.reason, timestamp: entry.timestamp.toString() },
		});
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- SEIZE (SSS-2) ----

app.post("/seize", async (c) => {
	const { fromTokenAccount, toTokenAccount, amount, reason } =
		await c.req.json();
	if (!fromTokenAccount || !toTokenAccount || !amount) {
		c.status(400);
		return c.json({
			error: "fromTokenAccount, toTokenAccount, and amount are required",
		});
	}
	try {
		const s = await getStable();
		const sig = await s.compliance.seize({
			fromTokenAccount: new PublicKey(fromTokenAccount),
			toTokenAccount: new PublicKey(toTokenAccount),
			amount: BigInt(amount),
			seizer: authority,
		});

		await db.insert(auditLogs).values({
			action: "SEIZE",
			address: fromTokenAccount,
			reason: reason || `Seized to ${toTokenAccount}`,
			signature: sig,
		});
		log.info(
			{ fromTokenAccount, toTokenAccount, amount, sig },
			"Tokens seized",
		);
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to seize tokens");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- FREEZE / THAW (SSS-1) ----

app.post("/freeze", async (c) => {
	const { address, reason } = await c.req.json();
	if (!address) {
		c.status(400);
		return c.json({ error: "address required" });
	}
	try {
		const s = await getStable();
		const sig = await s.freeze(new PublicKey(address));

		await db.insert(auditLogs).values({
			action: "FREEZE",
			address,
			reason: reason || "Manual freeze",
			signature: sig,
		});
		log.info({ address, sig }, "Address frozen");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message, address }, "Failed to freeze address");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/thaw", async (c) => {
	const { address, reason } = await c.req.json();
	if (!address) {
		c.status(400);
		return c.json({ error: "address required" });
	}
	try {
		const s = await getStable();
		const sig = await s.thaw(new PublicKey(address));

		await db.insert(auditLogs).values({
			action: "THAW",
			address,
			reason: reason || "Manual thaw",
			signature: sig,
		});
		log.info({ address, sig }, "Address thawed");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message, address }, "Failed to thaw address");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- PAUSE / UNPAUSE (SSS-1) ----

app.post("/pause", async (c) => {
	const { reason } = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.pause(reason);

		await db.insert(auditLogs).values({
			action: "PAUSE",
			address: "GLOBAL",
			reason: reason || "Manual pause",
			signature: sig,
		});
		log.info({ sig }, "Stablecoin paused");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to pause stablecoin");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/unpause", async (c) => {
	const { reason } = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.unpause();

		await db.insert(auditLogs).values({
			action: "UNPAUSE",
			address: "GLOBAL",
			reason: reason || "Manual unpause",
			signature: sig,
		});
		log.info({ sig }, "Stablecoin unpaused");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to unpause stablecoin");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- AUDIT LOGS ----

app.get("/audit", async (c) => {
	try {
		const limit = parseInt(c.req.query("limit") || "100");
		const logs = await db
			.select()
			.from(auditLogs)
			.orderBy(desc(auditLogs.timestamp))
			.limit(limit);

		const [{ value }] = await db.select({ value: count() }).from(auditLogs);
		return c.json({ count: value, entries: logs });
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

export default app;
