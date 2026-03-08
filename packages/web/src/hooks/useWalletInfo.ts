import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";

export const useWalletInfo = () => {
  const { publicKey, connected, connecting, disconnecting } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (publicKey && connected) {
      setLoading(true);
      connection
        .getBalance(publicKey)
        .then((bal) => {
          setBalance(bal / LAMPORTS_PER_SOL);
        })
        .catch((err) => {
          console.error("Error fetching balance:", err);
          setBalance(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setBalance(null);
    }
  }, [publicKey, connected, connection]);

  return {
    publicKey,
    connected,
    connecting,
    disconnecting,
    balance,
    loading,
    address: publicKey?.toBase58() || null,
    shortAddress: publicKey
      ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
      : null,
  };
};
