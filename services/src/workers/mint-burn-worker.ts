import { PublicKey } from "@solana/web3.js";
import { Job, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { burnRequests, mintRequests } from "../db/schema.js";
import { authority, getStable, log } from "../index.js";
import { redisConnection } from "../routes/mint-burn.js";

export const mintBurnWorker = new Worker(
	"mint-burn",
	async (job: Job) => {
		const { type, id } = job.data;
		const s = await getStable();
		const status = await s.getStatus();

		if (type === "mint") {
			const [record] = await db
				.select()
				.from(mintRequests)
				.where(eq(mintRequests.id, id));
			if (!record) return;

			try {
				await db
					.update(mintRequests)
					.set({ status: "PROCESSING" })
					.where(eq(mintRequests.id, id));
				const amountBN = BigInt(
					Math.round(parseFloat(record.amount) * 10 ** status.decimals),
				);

				log.info(
					{ id, amount: record.amount, recipient: record.recipient },
					"Processing mint",
				);

				const sig = await s.mintTokens({
					recipient: new PublicKey(record.recipient),
					amount: amountBN,
					minter: authority, // Assuming authority is added as a minter for this service
				});

				await db
					.update(mintRequests)
					.set({ status: "COMPLETED", signature: sig })
					.where(eq(mintRequests.id, id));
				log.info({ id, sig }, "Mint completed");
			} catch (error: any) {
				log.error({ id, error: error.message }, "Mint failed");
				await db
					.update(mintRequests)
					.set({ status: "FAILED" })
					.where(eq(mintRequests.id, id));
				throw error;
			}
		} else if (type === "burn") {
			const [record] = await db
				.select()
				.from(burnRequests)
				.where(eq(burnRequests.id, id));
			if (!record) return;

			try {
				await db
					.update(burnRequests)
					.set({ status: "PROCESSING" })
					.where(eq(burnRequests.id, id));
				const amountBN = BigInt(
					Math.round(parseFloat(record.amount) * 10 ** status.decimals),
				);

				const sig = await s.burn({
					fromTokenAccount: new PublicKey(record.fromTokenAccount),
					amount: amountBN,
					burner: authority, // Assuming authority has burner role
				});

				await db
					.update(burnRequests)
					.set({ status: "COMPLETED", signature: sig })
					.where(eq(burnRequests.id, id));
				log.info({ id, sig }, "Burn completed");
			} catch (error: any) {
				log.error({ id, error: error.message }, "Burn failed");
				await db
					.update(burnRequests)
					.set({ status: "FAILED" })
					.where(eq(burnRequests.id, id));
				throw error;
			}
		}
		// @ts-ignore - pnpm ioredis version mismatch
	},
	{ connection: redisConnection },
);

mintBurnWorker.on("failed", (job, err) => {
	log.error({ job: job?.id, err: err.message }, "Job failed");
});
