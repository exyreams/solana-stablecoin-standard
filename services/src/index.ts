import { serve } from "@hono/node-server";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { SolanaStablecoin } from "@stbr/sss-token-sdk";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import pino from "pino";
import { db } from "./db/index.js";
import "dotenv/config";
import { sql } from "drizzle-orm"; // Assuming sql tag is from drizzle-orm

// Configure Pino
export const log = pino({ level: process.env.LOG_LEVEL ?? "info" });

// Blockchain configuration
if (!process.env.SOLANA_RPC_URL) {
  log.error("SOLANA_RPC_URL is required");
  process.exit(1);
}
if (!process.env.STABLECOIN_MINT) {
  log.error("STABLECOIN_MINT is required");
  process.exit(1);
}
if (!process.env.AUTHORITY_SECRET_KEY) {
  log.error("AUTHORITY_SECRET_KEY is required");
  process.exit(1);
}

export const connection = new Connection(
  process.env.SOLANA_RPC_URL,
  "confirmed",
);
export const mintPubkey = new PublicKey(process.env.STABLECOIN_MINT);
const authSecret = Uint8Array.from(
  JSON.parse(process.env.AUTHORITY_SECRET_KEY),
);
export const authority = Keypair.fromSecretKey(authSecret);

export let stable: SolanaStablecoin;
export async function getStable() {
  if (!stable) {
    const transferHookProgramId = process.env.TRANSFER_HOOK_PROGRAM_ID 
      ? new PublicKey(process.env.TRANSFER_HOOK_PROGRAM_ID) 
      : new PublicKey("HPksBobjquMqBfnCgpqBQDkomJ4HmGB1AbvJnemNBEig");

    stable = await SolanaStablecoin.load(
      connection, 
      mintPubkey, 
      authority, 
      { transferHookProgramId }
    );
  }
  return stable;
}

import adminRoutes from "./routes/admin.js";
import complianceRoutes from "./routes/compliance.js";
import createStablecoinRoutes from "./routes/create-stablecoin.js";
import getStablecoinRoutes from "./routes/get-stablecoin.js";
import listStablecoinsRoutes from "./routes/list-stablecoins.js";
// Routes
import mintBurnRoutes from "./routes/mint-burn.js";
import privacyRoutes from "./routes/privacy.js";
import webhookRoutes from "./routes/webhooks.js";
import { startOracleCrank } from "./workers/crank.js";
// Workers
import { startEventIndexer } from "./workers/indexer.js";

const app = new Hono();

// CORS configuration - should be called before routes
if (!process.env.CORS_ORIGINS) {
  log.error("CORS_ORIGINS is required");
  process.exit(1);
}

const corsOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());

app.use("*", cors({
  origin: corsOrigins,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 600,
}));

app.use("*", logger());

app.get("/health", async (c) => {
  try {
    await db.run(sql`SELECT 1`);
    return c.json({ status: "ok", service: "sss-backend" });
  } catch (_error) {
    c.status(503);
    return c.json({ status: "error", service: "sss-backend" });
  }
});

app.route("/create-stablecoin", createStablecoinRoutes);
app.route("/list-stablecoins", listStablecoinsRoutes);
app.route("/get-stablecoin", getStablecoinRoutes);
app.route("/mint-burn", mintBurnRoutes);
app.route("/compliance", complianceRoutes);
app.route("/privacy", privacyRoutes);
app.route("/webhooks", webhookRoutes);
app.route("/admin", adminRoutes);

const port = parseInt(process.env.PORT || "3000", 10);
console.log(`Server is running on port ${port}`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  async () => {
    log.info({ port }, "sss-backend started");

    // Start background workers
    await startEventIndexer();
    startOracleCrank();
  },
);
