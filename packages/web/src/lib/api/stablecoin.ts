import api from "./client";

export interface CreateStablecoinRequest {
	preset: "sss1" | "sss2" | "sss3";
	name: string;
	symbol: string;
	decimals: number;
	uri?: string;
	extensions?: {
		permanentDelegate?: boolean;
		transferHook?: boolean;
		defaultFrozen?: boolean;
	};
	roles?: {
		minter?: string;
		burner?: string;
		pauser?: string;
		blacklister?: string;
	};
}

export interface CreateStablecoinResponse {
	success: boolean;
	mintAddress: string;
	preset: string;
	name: string;
	symbol: string;
	decimals: number;
	signature?: string;
}

export interface StablecoinDetails {
	id: string;
	mintAddress: string;
	preset: string;
	name: string;
	symbol: string;
	decimals: number;
	uri: string | null;
	signature: string | null;
	createdAt: string;
	onChain: {
		supply: string;
		decimals: number;
		name: string;
		symbol: string;
		uri: string;
		paused: boolean;
		roles: {
			masterAuthority: string;
			pendingMaster: string | null;
			pauser: string;
			blacklister: string;
			burner: string;
			seizer: string;
		};
		extensions: {
			transferHook: boolean;
			permanentDelegate: boolean;
			defaultAccountFrozen: boolean;
			confidentialTransfers: boolean;
		};
	} | null;
	warning?: string;
}

export interface ListStablecoinsResponse {
	stablecoins: StablecoinDetails[];
	count: number;
	limit: number;
	offset: number;
}

export const stablecoinApi = {
	create: async (
		data: CreateStablecoinRequest,
	): Promise<CreateStablecoinResponse> => {
		const response = await api.post<CreateStablecoinResponse>(
			"/create-stablecoin",
			data,
		);
		return response.data;
	},
	get: async (mintAddress: string): Promise<StablecoinDetails> => {
		const response = await api.get<StablecoinDetails>(
			`/get-stablecoin/${mintAddress}`,
		);
		return response.data;
	},
	list: async (params?: {
		limit?: number;
		offset?: number;
	}): Promise<ListStablecoinsResponse> => {
		const response = await api.get<ListStablecoinsResponse>(
			"/list-stablecoins",
			{ params },
		);
		return response.data;
	},
	mint: async (
		mintAddress: string,
		recipient: string,
		amount: number,
	): Promise<{ success: boolean; id: string }> => {
		const response = await api.post("/mint-burn/mint", {
			mintAddress,
			recipient,
			amount,
		});
		return response.data;
	},
	burn: async (
		mintAddress: string,
		fromTokenAccount: string,
		amount: number,
	): Promise<{ success: boolean; id: string }> => {
		const response = await api.post("/mint-burn/burn", {
			mintAddress,
			fromTokenAccount,
			amount,
		});
		return response.data;
	},
	getHistory: async (
		mintAddress: string,
	): Promise<{ mints: any[]; burns: any[] }> => {
		const response = await api.get<{ mints: any[]; burns: any[] }>(
			`/get-stablecoin/${mintAddress}/history`,
		);
		return response.data;
	},
};
