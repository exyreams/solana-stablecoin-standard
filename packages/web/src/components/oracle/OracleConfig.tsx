import type { FC } from "react";
import { Button } from "../ui/Button";

export const OracleConfig: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid)">
      <div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Oracle Configuration
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-(--border-dim)">
          <span className="text-[10px] uppercase text-(--text-dim)">
            Max Staleness
          </span>
          <span className="font-mono text-[11px]">120s</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-(--border-dim)">
          <span className="text-[10px] uppercase text-(--text-dim)">
            Aggregation Method
          </span>
          <span className="font-mono text-[11px]">MEDIAN</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-(--border-dim)">
          <span className="text-[10px] uppercase text-(--text-dim)">
            Mint Premium
          </span>
          <span className="font-mono text-[11px]">50 BPS</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-(--border-dim)">
          <span className="text-[10px] uppercase text-(--text-dim)">
            Redeem Discount
          </span>
          <span className="font-mono text-[11px]">25 BPS</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-[10px] uppercase text-(--text-dim)">
            Circuit Breaker
          </span>
          <span className="font-mono text-[11px]">500 BPS</span>
        </div>

        <div className="pt-4 space-y-2">
          <Button variant="secondary" className="w-full">
            UPDATE CONFIG
          </Button>
          <Button variant="ghost" className="w-full">
            PAUSE ORACLE
          </Button>
        </div>
      </div>
    </div>
  );
};
