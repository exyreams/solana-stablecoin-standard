import type { FC } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export const DashboardTopBar: FC = () => {
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
        <Button variant="primary" size="sm" className="font-mono text-[11px]">
          CONNECT WALLET
        </Button>
      </div>
    </header>
  );
};
