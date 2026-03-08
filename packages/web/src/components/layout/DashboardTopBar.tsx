import type { FC } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { ChevronDown } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { WalletModal } from "../wallet";

export const DashboardTopBar: FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="col-span-2 border-b border-[#222222] flex items-center justify-between px-4 bg-[#080808] z-10">
      <div className="flex items-center gap-2 font-bold font-mono">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="SSS Logo" className="h-6 w-auto" />
          <span className="text-[#CCA352]">SSS MANAGER</span>
        </Link>
      </div>
      <div className="flex gap-6 items-center">
        <div className="bg-[#0f0f0f] border border-[#333333] px-3 py-1 flex items-center gap-3 cursor-pointer hover:border-[#CCA352] transition-colors">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">USDC-SOL</span>
            <Badge variant="accent" className="text-[8px]">
              SSS-2
            </Badge>
          </div>
          <span className="text-[#444444] text-[10px]">▼</span>
        </div>
        <div className="font-mono text-[10px] text-[#777777]">
          NET <span className="text-[#FFD700]">MAINNET-BETA</span>
        </div>

        {connected && publicKey ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-[#CCA352] text-[#0a0a0a] px-4 py-1.5 font-mono text-[11px] font-semibold hover:bg-[#d4b366] transition-colors flex items-center gap-2"
            >
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 bg-[#0f0f0f] border border-[#333333] min-w-[200px] z-20">
                  <button
                    onClick={() => {
                      disconnect();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left font-mono text-[11px] text-[#EAEAEA] hover:bg-[rgba(204,163,82,0.1)] hover:text-[#CCA352] transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsWalletModalOpen(true)}
          >
            CONNECT WALLET
          </Button>
        )}
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </header>
  );
};
