import {
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
} from "@solana/web3.js";
import { Presets, SolanaStablecoin } from "@stbr/sss-token-sdk";
import fs from "fs";
import os from "os";
import path from "path";

const TOKEN_PROGRAM_ID = new PublicKey(
	"8ikCeGrUHjWq8Nf998zTaRsvF5vrKhrDcitemXdof8H4",
);
const ORACLE_PROGRAM_ID = new PublicKey(
	"A3FwdZsxaNnXHkuTUcpRBGgNxonoypw5uz7CJkffDJXU",
);

async function setup() {
	console.log("Connecting to Devnet...");
	const connection = new Connection(
		"https://api.devnet.solana.com",
		"confirmed",
	);
	const walletPath = path.join(os.homedir(), ".config/solana/id.json");

	if (!fs.existsSync(walletPath)) {
		throw new Error(`Wallet not found at ${walletPath}`);
	}

	const secretKey = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
	const authority = Keypair.fromSecretKey(Uint8Array.from(secretKey));

	console.log("Authority:", authority.publicKey.toBase58());
	const balance = await connection.getBalance(authority.publicKey);
	console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");

	if (balance < 0.5 * LAMPORTS_PER_SOL) {
		throw new Error(
			"Insufficient balance for deployment on Devnet. Need at least 0.5 SOL.",
		);
	}

	console.log("Initializing Stablecoin via SDK on Devnet...");
	const mintKeypair = Keypair.generate();
	const sdk = await SolanaStablecoin.create(connection, {
		authority,
		mintKeypair,
		programId: TOKEN_PROGRAM_ID,
		oracleProgramId: ORACLE_PROGRAM_ID,
		preset: Presets.SSS_1,
		name: "USD Black",
		symbol: "USDb",
		decimals: 6,
		uri: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/vectors/usdc-9m4vpxnxvmyaogz2us6q.png/usdc-dej9imdchzadld3h5f6w58.png?_a=DATAiZAAZAA0",
	});

	console.log("Stablecoin Mint:", sdk.mint.toBase58());

	console.log("Initializing Oracle via SDK...");
	await sdk.oracle.initialize({
		baseCurrency: "USD",
		quoteCurrency: "USD",
		maxStalenessSeconds: 3600,
		aggregationMethod: 0,
		minFeedsRequired: 1,
	});

	console.log("Adding a manual feed for testing...");
	await sdk.oracle.addFeed({
		feedIndex: 0,
		feedType: 3, // Manual
		label: "Devnet Manual Feed 0",
	});

	console.log("\n--- COPY THESE TO YOUR .env ---");
	console.log(`STABLECOIN_MINT=${sdk.mint.toBase58()}`);
	console.log("------------------------------");
}

setup().catch((err) => {
	console.error("❌ Setup failed:", err);
	process.exit(1);
});
