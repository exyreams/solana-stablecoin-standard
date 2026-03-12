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
		minter?: string,
	): Promise<{ success: boolean; id: string }> => {
		const response = await api.post("/mint-burn/mint", {
			mintAddress,
			recipient,
			amount,
			minter,
		});
		return response.data;
	},
	burn: async (
		mintAddress: string,
		fromTokenAccount: string,
		amount: number,
		minter?: string,
	): Promise<{ success: boolean; id: string }> => {
		const response = await api.post("/mint-burn/burn", {
			mintAddress,
			fromTokenAccount,
			amount,
			minter,
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

	prepareMint: async (
		mintAddress: string,
		recipient: string,
		amount: number,
		minter: string,
	): Promise<{ transaction: string }> => {
		const response = await api.post<{ transaction: string }>(
			"/mint-burn/prepare-mint",
			{
				mintAddress,
				recipient,
				amount,
				minter,
			},
		);
		return response.data;
	},

	prepareBurn: async (
		mintAddress: string,
		fromTokenAccount: string,
		amount: number,
		minter: string,
	): Promise<{ transaction: string }> => {
		const response = await api.post<{ transaction: string }>(
			"/mint-burn/prepare-burn",
			{
				mintAddress,
				fromTokenAccount,
				amount,
				minter,
			},
		);
		return response.data;
	},

	freeze: async (
		mintAddress: string,
		address: string,
		reason?: string,
	): Promise<{ success: boolean; signature: string }> => {
		const response = await api.post<{ success: boolean; signature: string }>(
			"/compliance/freeze",
			{
				mintAddress,
				address,
				reason,
			},
		);
		return response.data;
	},

	thaw: async (
		mintAddress: string,
		address: string,
		reason?: string,
	): Promise<{ success: boolean; signature: string }> => {
		const response = await api.post<{ success: boolean; signature: string }>(
			"/compliance/thaw",
			{
				mintAddress,
				address,
				reason,
			},
		);
		return response.data;
	},

	blacklist: async (
		mintAddress: string,
		address: string,
		reason?: string,
	): Promise<{ success: boolean; signature: string }> => {
		const response = await api.post<{ success: boolean; signature: string }>(
			"/compliance/blacklist",
			{
				mintAddress,
				address,
				reason,
			},
		);
		return response.data;
	},

	seize: async (
		mintAddress: string,
		fromTokenAccount: string,
		toTokenAccount: string,
		amount: string | number,
		reason?: string,
	): Promise<{ success: boolean; signature: string }> => {
		const response = await api.post<{ success: boolean; signature: string }>(
			"/compliance/seize",
			{
				mintAddress,
				fromTokenAccount,
				toTokenAccount,
				amount,
				reason,
			},
		);
		return response.data;
	},

	getAccountHistory: async (
		address: string,
		limit = 20,
	): Promise<{ entries: any[] }> => {
		const response = await api.get<{ entries: any[] }>(
			`/compliance/history/${address}`,
			{
				params: { limit },
			},
		);
		return response.data;
	},
};
