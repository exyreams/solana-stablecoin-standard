import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { stablecoins } from "../db/schema.js";
import { log } from "../index.js";

const app = new Hono();

/**
 * GET /:mintAddress
 * Get a specific stablecoin by mint address
 */
app.get("/:mintAddress", async (c) => {
	try {
		const mintAddress = c.req.param("mintAddress");

		const result = await db
			.select()
			.from(stablecoins)
			.where(eq(stablecoins.mintAddress, mintAddress))
			.limit(1);

		if (result.length === 0) {
			c.status(404);
			return c.json({ error: "Stablecoin not found" });
		}

		return c.json(result[0]);
	} catch (error: any) {
		log.error("Error fetching stablecoin:", error);
		c.status(500);
		return c.json({
			error: error.message || "Failed to fetch stablecoin",
		});
	}
});

export default app;
