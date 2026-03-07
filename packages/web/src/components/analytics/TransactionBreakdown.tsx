import type { FC } from "react";

const transactions = [
  { type: "Mint", count: 1247, percentage: 68, color: "bg-[#00ff88]" },
  { type: "Burn", count: 342, percentage: 19, color: "bg-[#ff4444]" },
  { type: "Freeze", count: 156, percentage: 8, color: "bg-[#ffaa00]" },
  { type: "Other", count: 89, percentage: 5, color: "bg-(--text-dim)" },
];

export const TransactionBreakdown: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-6">
      <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
        Transaction Breakdown (30D)
      </div>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.type}>
            <div className="flex justify-between items-center mb-2 text-xs font-mono">
              <span className="text-(--text-main)">{tx.type}</span>
              <div className="flex items-center gap-3">
                <span className="text-(--text-dim)">{tx.count} txns</span>
                <span className="text-(--text-main)">{tx.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-(--bg-surface) h-2 overflow-hidden">
              <div
                className={`h-full ${tx.color}`}
                style={{ width: `${tx.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
