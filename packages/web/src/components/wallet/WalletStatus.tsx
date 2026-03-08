import type { FC } from "react";
import { useWalletInfo } from "../../hooks/useWalletInfo";
import { Badge } from "../ui/Badge";

export const WalletStatus: FC = () => {
  const { connected, shortAddress, balance, loading } = useWalletInfo();

  if (!connected) {
    return (
      <div className="bg-[rgba(255,68,68,0.05)] border border-[#ff4444] border-dashed p-4">
        <div className="flex items-center gap-2">
          <Badge variant="danger">DISCONNECTED</Badge>
          <span className="text-[11px] font-mono text-[#ff4444]">
            Please connect your wallet to continue
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[rgba(0,255,136,0.05)] border border-[#00ff88] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="success">CONNECTED</Badge>
          <span className="text-[11px] font-mono text-[#EAEAEA]">
            {shortAddress}
          </span>
        </div>
        {!loading && balance !== null && (
          <span className="text-[11px] font-mono text-[#777777]">
            Balance: <span className="text-[#EAEAEA]">{balance.toFixed(4)} SOL</span>
          </span>
        )}
      </div>
    </div>
  );
};
