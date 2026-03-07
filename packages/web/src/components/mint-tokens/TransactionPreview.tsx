import type { FC } from "react";

export const TransactionPreview: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-4">
      <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
        Transaction Preview
      </div>
      <div className="space-y-3 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-(--text-dim)">Amount</span>
          <span className="text-(--text-main)">0.00 USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--text-dim)">Recipient</span>
          <span className="text-(--text-main)">Not set</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--text-dim)">Minter</span>
          <span className="text-(--text-main)">Treasury</span>
        </div>
        <div className="border-t border-(--border-dim) pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Est. Fee</span>
            <span className="text-(--text-main)">0.000005 SOL</span>
          </div>
        </div>
        <div className="border-t border-(--border-dim) pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-(--text-dim)">New Supply</span>
            <span className="text-[#00ff88]">42,500,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};
