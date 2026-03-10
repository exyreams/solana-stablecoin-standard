import client from "./client";

export interface AuthorityResponse {
  publicKey: string;
}

export const adminApi = {
  getAuthority: async (): Promise<AuthorityResponse> => {
    const { data } = await client.get<AuthorityResponse>("/admin/authority");
    return data;
  },
};
