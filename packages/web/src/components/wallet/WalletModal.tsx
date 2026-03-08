import type { FC } from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { X, Wallet, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { wallets, select, connected, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (connected && isOpen) {
      onClose();
    }
  }, [connected, isOpen, onClose]);

  const handleWalletSelect = async (walletName: string) => {
    try {
      setIsConnecting(true);
      select(walletName as any);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setIsConnecting(false);
    }
  };

  const installedWallets = wallets.filter((wallet) => wallet.readyState === "Installed");
  const notInstalledWallets = wallets.filter((wallet) => wallet.readyState !== "Installed");

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 z-[9998] backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-[#0f0f0f] border border-[#333333] w-full max-w-md relative pointer-events-auto"
        >
          {/* Header */}
          <div className="border-b border-[#333333] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-[#CCA352]" />
              <h2 className="font-mono text-sm font-bold text-[#EAEAEA] uppercase tracking-wider">
                Connect Wallet
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#777777] hover:text-[#CCA352] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {installedWallets.length > 0 ? (
              <>
                <div className="text-[10px] font-mono text-[#777777] uppercase tracking-wider mb-3">
                  Installed Wallets
                </div>
                <div className="space-y-2 mb-6">
                  {installedWallets.map((wallet) => (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => handleWalletSelect(wallet.adapter.name)}
                      disabled={isConnecting}
                      className="w-full bg-transparent border border-[#333333] hover:border-[#CCA352] hover:bg-[rgba(204,163,82,0.05)] transition-all p-4 flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-8 h-8"
                      />
                      <div className="flex-1 text-left">
                        <div className="font-mono text-[11px] text-[#EAEAEA] group-hover:text-[#CCA352] font-bold">
                          {wallet.adapter.name}
                        </div>
                        <div className="text-[9px] text-[#777777] font-mono">
                          {isConnecting ? "Connecting..." : "Click to connect"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-[rgba(255,68,68,0.05)] border border-[#ff4444] border-dashed p-4 mb-6">
                <div className="text-[11px] font-mono text-[#ff4444] mb-2">
                  No wallets detected
                </div>
                <div className="text-[10px] text-[#777777]">
                  Please install a Solana wallet extension to continue
                </div>
              </div>
            )}

            {notInstalledWallets.length > 0 && (
              <>
                <div className="text-[10px] font-mono text-[#777777] uppercase tracking-wider mb-3">
                  Available Wallets
                </div>
                <div className="space-y-2">
                  {notInstalledWallets.slice(0, 4).map((wallet) => (
                    <a
                      key={wallet.adapter.name}
                      href={wallet.adapter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-transparent border border-[#333333] hover:border-[#CCA352] hover:bg-[rgba(204,163,82,0.05)] transition-all p-4 flex items-center gap-3 group"
                    >
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="flex-1 text-left">
                        <div className="font-mono text-[11px] text-[#EAEAEA] group-hover:text-[#CCA352] font-bold">
                          {wallet.adapter.name}
                        </div>
                        <div className="text-[9px] text-[#777777] font-mono">
                          Not installed
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#777777] group-hover:text-[#CCA352]" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#333333] px-6 py-4 bg-[rgba(0,0,0,0.3)]">
            <div className="text-[9px] text-[#777777] font-mono text-center">
              By connecting, you agree to the{" "}
              <a href="#" className="text-[#CCA352] hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
