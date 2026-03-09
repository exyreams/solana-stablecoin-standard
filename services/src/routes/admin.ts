import { PublicKey } from "@solana/web3.js";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { auditLogs } from "../db/schema.js";
import { authority, connection, getStable, log } from "../index.js";

const app = new Hono();

// ---- GENERAL ADMIN & STATUS ----

app.get("/status", async (c) => {
	try {
		const s = await getStable();
		const [status, metadata, roles] = await Promise.all([
			s.getStatus(),
			s.getMetadata(),
			s.getRoles(),
		]);

		return c.json({
			status: { ...status, totalSupply: status.totalSupply.toString() },
			metadata,
			roles: {
				masterAuthority: roles.masterAuthority.toBase58(),
				pendingMaster: roles.pendingMaster?.toBase58(),
				burner: roles.burner.toBase58(),
				pauser: roles.pauser.toBase58(),
				blacklister: roles.blacklister.toBase58(),
				seizer: roles.seizer.toBase58(),
			},
		});
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

// Fetches the raw source of truth directly from the blockchain
app.get("/on-chain-status", async (c) => {
	try {
		const s = await getStable();
		const [state, roles] = await Promise.all([
			connection.getAccountInfo(s.stateAddress),
			connection.getAccountInfo(s.rolesAddress),
		]);

		return c.json({
			stateExists: !!state,
			rolesExists: !!roles,
			stateSize: state?.data.length,
			rolesSize: roles?.data.length,
			slot: state?.rentEpoch,
		});
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- MINTER MANAGEMENT ----

app.get("/minters", async (c) => {
	try {
		const s = await getStable();
		const minters = await s.getMinters();

		return c.json(
			minters.map((m) => ({
				mint: m.mint.toBase58(),
				minter: m.minter.toBase58(),
				quota: m.quota.toString(),
				minted: m.minted.toString(),
				active: m.active,
			})),
		);
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/minters", async (c) => {
	const { address, quota } = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.addMinter(new PublicKey(address), BigInt(quota));

		await db.insert(auditLogs).values({
			action: "ADD_MINTER",
			address,
			reason: `Quota: ${quota}`,
			signature: sig,
		});
		log.info({ address, quota, sig }, "Minter added");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err }, "Failed to add minter");
		c.status(500);
		return c.json({ error: err.message, stack: err.stack });
	}
});

app.put("/minters/:address", async (c) => {
	const address = c.req.param("address");
	const { quota, active, resetMinted } = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.updateMinter({
			minter: new PublicKey(address),
			quota: BigInt(quota),
			active: active,
			resetMinted: resetMinted,
		});

		await db.insert(auditLogs).values({
			action: "UPDATE_MINTER",
			address,
			reason: `Quota: ${quota}, Active: ${active}`,
			signature: sig,
		});
		log.info({ address, quota, active, sig }, "Minter updated");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to update minter");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.delete("/minters/:address", async (c) => {
	const address = c.req.param("address");
	try {
		const s = await getStable();
		const sig = await s.removeMinter(new PublicKey(address));

		await db.insert(auditLogs).values({
			action: "REMOVE_MINTER",
			address,
			reason: "Manual removal",
			signature: sig,
		});
		log.info({ address, sig }, "Minter removed");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to remove minter");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- ORACLE MANAGEMENT ----

app.get("/oracle/status", async (c) => {
	try {
		const s = await getStable();
		const [status, feeds] = await Promise.all([
			s.oracle.getStatus(),
			s.oracle.getFeeds(),
		]);

		return c.json({
			status: {
				...status,
				manualPrice: status.manualPrice.toString(),
				lastAggregatedPrice: status.lastAggregatedPrice.toString(),
				lastAggregatedConfidence: status.lastAggregatedConfidence.toString(),
			},
			feeds: feeds.map((f) => ({
				...f,
				lastPrice: f.lastPrice.toString(),
				lastConfidence: f.lastConfidence.toString(),
			})),
		});
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/oracle/initialize", async (c) => {
	const opts = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.oracle.initialize({
			...opts,
			cranker: opts.cranker ? new PublicKey(opts.cranker) : undefined,
		});
		log.info({ sig }, "Oracle initialized");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to initialize oracle");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.put("/oracle/config", async (c) => {
	const opts = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.oracle.updateConfig({
			...opts,
			cranker: opts.cranker ? new PublicKey(opts.cranker) : undefined,
		});
		log.info({ sig }, "Oracle config updated");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to update oracle config");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/oracle/feeds", async (c) => {
	const opts = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.oracle.addFeed({
			...opts,
			feedAddress: opts.feedAddress
				? new PublicKey(opts.feedAddress)
				: undefined,
		});
		log.info({ sig }, "Oracle feed added");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to add oracle feed");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.delete("/oracle/feeds/:index", async (c) => {
	const index = parseInt(c.req.param("index"));
	try {
		const s = await getStable();
		const sig = await s.oracle.removeFeed(index);
		log.info({ index, sig }, "Oracle feed removed");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to remove oracle feed");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/oracle/crank", async (c) => {
	const opts = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.oracle.crankFeed({
			feedIndex: opts.feedIndex,
			price: BigInt(Math.floor(opts.price * 1_000_000)),
			confidence: BigInt(0),
			cranker: authority,
		});
		log.info({ sig }, "Manual crank successful");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed manual crank");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/oracle/aggregate", async (c) => {
	const { feedAccounts } = await c.req.json();
	try {
		const s = await getStable();
		const pks = feedAccounts.map((a: string) => new PublicKey(a));
		const sig = await s.oracle.aggregate(pks);
		log.info({ sig }, "Oracle aggregate successful");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed oracle aggregate");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/oracle/manual-price", async (c) => {
	const { price, active } = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.oracle.setManualPrice(
			BigInt(Math.floor(price * 1_000_000)),
			active,
		);
		log.info({ price, active, sig }, "Oracle manual price set");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to set manual price");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- SUPPLY & LIFECYCLE ----

app.get("/supply", async (c) => {
	try {
		const s = await getStable();
		const supply = await s.getTotalSupply();
		return c.json({ supply: supply.toString() });
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.delete("/close-mint", async (c) => {
	try {
		const s = await getStable();
		const sig = await s.closeMint();

		await db.insert(auditLogs).values({
			action: "CLOSE_MINT",
			address: "GLOBAL",
			reason: "Permanent close",
			signature: sig,
		});
		log.warn({ sig }, "Mint closed permanently");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to close mint");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- ROLES ----

app.put("/roles", async (c) => {
	const { burner, pauser, blacklister, seizer } = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.updateRoles({
			burner: burner ? new PublicKey(burner) : undefined,
			pauser: pauser ? new PublicKey(pauser) : undefined,
			blacklister: blacklister ? new PublicKey(blacklister) : undefined,
			seizer: seizer ? new PublicKey(seizer) : undefined,
		});

		await db.insert(auditLogs).values({
			action: "UPDATE_ROLES",
			address: "GLOBAL",
			reason: JSON.stringify({ burner, pauser, blacklister, seizer }),
			signature: sig,
		});
		log.info({ sig }, "Roles updated");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to update roles");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// Two-step master authority transfer
app.post("/authority/transfer", async (c) => {
	const { newMaster } = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.transferAuthority(new PublicKey(newMaster));

		await db.insert(auditLogs).values({
			action: "AUTHORITY_TRANSFER_INIT",
			address: newMaster,
			reason: "Initiate authority transfer",
			signature: sig,
		});
		log.info({ newMaster, sig }, "Authority transfer initiated");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to initiate authority transfer");
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/authority/accept", async (c) => {
	try {
		const s = await getStable();
		const sig = await s.acceptAuthority();

		await db.insert(auditLogs).values({
			action: "AUTHORITY_TRANSFER_ACCEPT",
			address: "GLOBAL",
			reason: "Accept authority transfer",
			signature: sig,
		});
		log.info({ sig }, "Authority transfer accepted");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to accept authority transfer");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- TRANSFER HOOK (SSS-2) ----

app.post("/hook/initialize", async (c) => {
	try {
		const s = await getStable();
		const sig = await s.compliance.initializeHook();

		await db.insert(auditLogs).values({
			action: "HOOK_INITIALIZE",
			address: "GLOBAL",
			reason: "Initialize transfer hook ExtraAccountMetaList",
			signature: sig,
		});
		log.info({ sig }, "Transfer hook initialized");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to initialize transfer hook");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// ---- ORACLE (additional) ----

app.get("/oracle/feeds/:index", async (c) => {
	const index = parseInt(c.req.param("index"));
	try {
		const s = await getStable();
		const feed = await s.oracle.getFeed(index);
		if (!feed) {
			c.status(404);
			return c.json({ error: `Feed ${index} not found` });
		}
		return c.json({
			...feed,
			lastPrice: feed.lastPrice.toString(),
			lastConfidence: feed.lastConfidence.toString(),
		});
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.get("/oracle/price/mint", async (c) => {
	try {
		const s = await getStable();
		const sig = await s.oracle.getMintPrice();
		return c.json({ signature: sig });
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.get("/oracle/price/redeem", async (c) => {
	try {
		const s = await getStable();
		const sig = await s.oracle.getRedeemPrice();
		return c.json({ signature: sig });
	} catch (err: any) {
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.delete("/oracle/close", async (c) => {
	try {
		const s = await getStable();
		const sig = await s.oracle.close();

		await db.insert(auditLogs).values({
			action: "ORACLE_CLOSE",
			address: "GLOBAL",
			reason: "Oracle closed",
			signature: sig,
		});
		log.warn({ sig }, "Oracle closed");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error({ err: err.message }, "Failed to close oracle");
		c.status(500);
		return c.json({ error: err.message });
	}
});

// Two-step oracle authority transfer
app.post("/oracle/authority/transfer", async (c) => {
	const { newAuthority } = await c.req.json();
	try {
		const s = await getStable();
		const sig = await s.oracle.transferAuthority(new PublicKey(newAuthority));

		await db.insert(auditLogs).values({
			action: "ORACLE_AUTHORITY_TRANSFER_INIT",
			address: newAuthority,
			reason: "Initiate oracle authority transfer",
			signature: sig,
		});
		log.info({ newAuthority, sig }, "Oracle authority transfer initiated");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error(
			{ err: err.message },
			"Failed to initiate oracle authority transfer",
		);
		c.status(500);
		return c.json({ error: err.message });
	}
});

app.post("/oracle/authority/accept", async (c) => {
	try {
		const s = await getStable();
		const sig = await s.oracle.acceptAuthority();

		await db.insert(auditLogs).values({
			action: "ORACLE_AUTHORITY_TRANSFER_ACCEPT",
			address: "GLOBAL",
			reason: "Accept oracle authority transfer",
			signature: sig,
		});
		log.info({ sig }, "Oracle authority transfer accepted");
		return c.json({ success: true, signature: sig });
	} catch (err: any) {
		log.error(
			{ err: err.message },
			"Failed to accept oracle authority transfer",
		);
		c.status(500);
		return c.json({ error: err.message });
	}
});

export default app;
