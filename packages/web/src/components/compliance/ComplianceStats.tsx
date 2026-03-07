import type { FC } from "react";
import { Badge } from "../ui/Badge";

export const ComplianceStats: FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-(--bg-panel) border border-(--border-dim) p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
            Total Blacklisted
          </span>
          <Badge variant="accent" className="text-[7px]">
            SSS-2
          </Badge>
        </div>
        <div className="text-xl font-mono font-light">
          14 <span className="text-xs text-(--text-dark)">ADDRESSES</span>
        </div>
      </div>

      <div className="bg-(--bg-panel) border border-(--border-dim) p-4">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider block mb-2">
          Total Tokens Seized
        </span>
        <div className="text-xl font-mono font-light text-(--danger)">
          2,750,000.00 <span className="text-xs">USDC</span>
        </div>
      </div>

      <div className="bg-(--bg-panel) border border-(--border-dim) p-4">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider block mb-2">
          Last Blacklist Update
        </span>
        <div className="text-sm font-mono mt-3">2023.10.24 14:02 UTC</div>
        <div className="text-[9px] font-mono text-(--text-dark) mt-1">
          AUTH: 9v9...e11
        </div>
      </div>

      <div className="bg-(--bg-panel) border border-(--border-dim) p-4">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider block mb-2">
          Hook Status
        </span>
        <div className="mt-3">
          <Badge variant="success" className="font-bold px-3 py-1">
            ACTIVE
          </Badge>
        </div>
      </div>
    </div>
  );
};
