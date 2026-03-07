import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export const DashboardTopBar: FC = () => {
  return (
    <header className="col-span-2 border-b border-(--border-dim) flex items-center justify-between px-4 bg-(--bg-body) z-10">
      <div className="flex items-center gap-2 font-bold tracking-widest">
        <span className="w-4 h-4 bg-(--accent-active)" />
        <span>SOLANA SSS MANAGER</span>
      </div>
      <div className="flex gap-6 items-center">
        <div className="bg-(--bg-panel) border border-(--border-mid) px-3 py-1 flex items-center gap-3 cursor-pointer hover:border-(--accent-primary) transition-colors">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">USDC-SOL</span>
            <Badge variant="accent" className="text-[8px]">
              SSS-2
            </Badge>
          </div>
          <span className="text-(--text-dark) text-[10px]">▼</span>
        </div>
        <div className="font-mono text-[10px] text-(--text-dim)">
          NET <span className="text-(--accent-active)">MAINNET-BETA</span>
        </div>
        <Button variant="primary" size="sm" className="font-mono text-[11px]">
          CONNECT WALLET
        </Button>
      </div>
    </header>
  );
};
