import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { stablecoinApi, type StablecoinDetails } from "../lib/api/stablecoin";

interface TokenContextType {
  tokens: StablecoinDetails[];
  selectedToken: StablecoinDetails | null;
  setSelectedToken: (token: StablecoinDetails) => void;
  isLoading: boolean;
  refreshTokens: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<StablecoinDetails[]>([]);
  const [selectedToken, setSelectedToken] = useState<StablecoinDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      const data = await stablecoinApi.list();
      setTokens(data.stablecoins);
      
      // Auto-select first token if none selected or if previously selected token is not in the list
      const savedMint = localStorage.getItem("selected_token_mint");
      const found = data.stablecoins.find(t => t.mintAddress === savedMint);
      
      if (found) {
        setSelectedToken(found);
      } else if (data.stablecoins.length > 0) {
        setSelectedToken(data.stablecoins[0]);
        localStorage.setItem("selected_token_mint", data.stablecoins[0].mintAddress);
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleSetSelectedToken = (token: StablecoinDetails) => {
    setSelectedToken(token);
    localStorage.setItem("selected_token_mint", token.mintAddress);
  };

  return (
    <TokenContext.Provider
      value={{
        tokens,
        selectedToken,
        setSelectedToken: handleSetSelectedToken,
        isLoading,
        refreshTokens: fetchTokens,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
};
