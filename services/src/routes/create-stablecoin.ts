import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Presets, SolanaStablecoin } from "@stbr/sss-token-sdk";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { stablecoins } from "../db/schema.js";
import { log } from "../index.js";

const app = new Hono();

/**
 * POST /
 * Create a new stablecoin
 */
app.post("/", async (c) => {
	try {
		const body = await c.req.json();
		const {
			preset,
			name,
			symbol,
			decimals = 6,
			uri = "",
			extensions = {},
			roles = {},
		} = body;

		// Validate required fields
		if (!preset || !name || !symbol) {
			c.status(400);
			return c.json({
				error: "Missing required fields: preset, name, symbol",
			});
		}

		// Validate preset
		if (!["sss1", "sss2", "sss3"].includes(preset)) {
			c.status(400);
			return c.json({
				error: "Invalid preset. Must be sss1, sss2, or sss3",
			});
		}

		// Get authority keypair from env
		const authoritySecretKey = JSON.parse(
			process.env.AUTHORITY_SECRET_KEY || "[]",
		);
		if (authoritySecretKey.length === 0) {
			c.status(500);
			return c.json({ error: "Authority keypair not configured" });
		}
		const authority = Keypair.fromSecretKey(
			Uint8Array.from(authoritySecretKey),
		);

		// Connect to Solana
		const connection = new Connection(
			process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
		);

		// Generate mint keypair
		const mintKeypair = Keypair.generate();

		// Map preset string to SDK preset
		const presetMap = {
			sss1: Presets.SSS_1,
			sss2: Presets.SSS_2,
			sss3: Presets.SSS_3,
		};

		log.info(
			`Creating ${preset.toUpperCase()} stablecoin: ${symbol} (${name})`,
		);

		// Get transfer hook program ID for SSS-2
		const transferHookProgramId =
			preset === "sss2"
				? new PublicKey(
						process.env.TRANSFER_HOOK_PROGRAM_ID ||
							"HPksBobjquMqBfnCgpqBQDkomJ4HmGB1AbvJnemNBEig",
					)
				: undefined;

		// Create the stablecoin
		const stablecoin = await SolanaStablecoin.create(connection, {
			preset: presetMap[preset as keyof typeof presetMap],
			name,
			symbol,
			decimals,
			uri,
			authority,
			mintKeypair,
			transferHookProgramId,
			extensions: {
				permanentDelegate: extensions.permanentDelegate,
				transferHook: extensions.transferHook,
				defaultAccountFrozen: extensions.defaultFrozen,
			},
		});

		const mintAddress = mintKeypair.publicKey.toBase58();
		log.info(`Stablecoin created: ${mintAddress}`);

		// If SSS-2, initialize transfer hook
		let hookSignature: string | undefined;
		if (preset === "sss2" && stablecoin.compliance) {
			log.info("Initializing transfer hook for SSS-2...");
			hookSignature = await stablecoin.compliance.initializeHook();
			log.info(`Transfer hook initialized: ${hookSignature}`);
		}

		// Add initial minter if specified
		if (roles.minter) {
			try {
				const minterPubkey = new PublicKey(roles.minter);
				log.info(`Adding initial minter: ${roles.minter}`);
				await stablecoin.addMinter(minterPubkey, BigInt(0)); // 0 = unlimited quota
			} catch (err) {
				log.warn(`Failed to add minter: ${err}`);
			}
		}

		// Update roles if specified
		const roleUpdates: any = {};
		if (roles.burner) roleUpdates.burner = new PublicKey(roles.burner);
		if (roles.pauser) roleUpdates.pauser = new PublicKey(roles.pauser);
		if (roles.blacklister && preset === "sss2")
			roleUpdates.blacklister = new PublicKey(roles.blacklister);

		if (Object.keys(roleUpdates).length > 0) {
			log.info("Updating roles...");
			await stablecoin.updateRoles(roleUpdates);
		}

		// Save to database
		await db.insert(stablecoins).values({
			mintAddress,
			preset,
			name,
			symbol,
			decimals,
			uri: uri || null,
			signature: hookSignature || null,
		});

		log.info(`Stablecoin saved to database: ${mintAddress}`);

		return c.json({
			success: true,
			mintAddress,
			preset,
			name,
			symbol,
			decimals,
		});
	} catch (error: any) {
		log.error("Error creating stablecoin:", error);
		c.status(500);
		return c.json({
			error: error.message || "Failed to create stablecoin",
			details: error.toString(),
		});
	}
});

export default app;
