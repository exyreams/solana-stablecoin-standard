import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ── Mint & Burn ──────────────────────────────────────────────────────────────
export const mintRequests = sqliteTable("mint_requests", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	recipient: text("recipient").notNull(),
	amount: text("amount").notNull(),
	status: text("status").notNull().default("PENDING"), // PENDING, PROCESSING, COMPLETED, FAILED
	signature: text("signature"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const burnRequests = sqliteTable("burn_requests", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	fromTokenAccount: text("from_token_account").notNull(),
	amount: text("amount").notNull(),
	status: text("status").notNull().default("PENDING"), // PENDING, PROCESSING, COMPLETED, FAILED
	signature: text("signature"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

// ── Event Indexer ─────────────────────────────────────────────────────────────
export const eventLogs = sqliteTable("event_logs", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	signature: text("signature").notNull(),
	name: text("name").notNull(),
	data: text("data").notNull(), // JSON stringified event data
	timestamp: integer("timestamp", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

// ── Compliance ────────────────────────────────────────────────────────────────
export const auditLogs = sqliteTable("audit_logs", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	action: text("action").notNull(), // BLACKLIST_ADD, BLACKLIST_REMOVE, SEIZE
	address: text("address").notNull(),
	reason: text("reason"),
	signature: text("signature"),
	timestamp: integer("timestamp", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

// ── Webhooks ──────────────────────────────────────────────────────────────────
export const subscribers = sqliteTable("subscribers", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	url: text("url").notNull(),
	events: text("events").notNull(), // Comma separated list of events, e.g. "mint,burn" or "*"
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const deliveryLogs = sqliteTable("delivery_logs", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	url: text("url").notNull(),
	event: text("event").notNull(),
	status: text("status").notNull(), // START, SUCCESS, FAILED
	error: text("error"),
	timestamp: integer("timestamp", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});
