import type { FC } from "react";
import { Button } from "../ui/Button";

export const ConfigurationGrid: FC = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-(--bg-panel) border border-(--border-mid) p-4">
        <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-3">
          Token Configuration
        </div>
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Decimals</span>
            <span className="text-(--text-main)">6</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Version</span>
            <span className="text-(--text-main)">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Standard</span>
            <span className="text-(--accent-primary)">SSS-2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Created</span>
            <span className="text-(--text-main)">2025-12-15</span>
          </div>
        </div>
      </div>

      <div className="bg-(--bg-panel) border border-(--border-mid) p-4">
        <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-3">
          Supply Statistics
        </div>
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Total Supply</span>
            <span className="text-(--text-main)">42,500,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Total Minted</span>
            <span className="text-[#00ff88]">45,200,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Total Burned</span>
            <span className="text-[#ff4444]">2,700,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Holders</span>
            <span className="text-(--text-main)">8,432</span>
          </div>
        </div>
      </div>

      <div className="bg-(--bg-panel) border border-(--border-mid) p-4">
        <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-3">
          Authority Info
        </div>
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-(--text-dim)">Master</span>
            <span className="text-(--text-main)">8x2F...3f93</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-(--text-dim)">Pending</span>
            <span className="text-(--text-dim)">None</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-(--text-dim)">Type</span>
            <span className="text-(--accent-primary)">PDA</span>
          </div>
          <div className="pt-2">
            <Button variant="secondary" size="sm" className="w-full">
              TRANSFER AUTHORITY
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
