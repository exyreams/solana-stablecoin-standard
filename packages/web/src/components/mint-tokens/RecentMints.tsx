import type { FC } from "react";

const recentMints = [
  { amount: "500,000", time: "2h ago" },
  { amount: "1,000,000", time: "5h ago" },
  { amount: "120,000", time: "1d ago" },
];

export const RecentMints: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-4">
      <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
        Recent Mints
      </div>
      <div className="space-y-3">
        {recentMints.map((mint, i) => (
          <div
            key={i}
            className="flex justify-between items-center text-xs font-mono"
          >
            <span className="text-[#00ff88]">+{mint.amount}</span>
            <span className="text-(--text-dim)">{mint.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
