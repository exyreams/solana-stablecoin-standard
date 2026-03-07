import type { FC } from "react";

const recentBurns = [
  { amount: "25,000", time: "5h ago", account: "8xL...11Q" },
  { amount: "50,000", time: "1d ago", account: "3M1...a21" },
  { amount: "15,000", time: "2d ago", account: "7Qw...8x12" },
];

export const RecentBurns: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-4">
      <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
        Recent Burns
      </div>
      <div className="space-y-3">
        {recentBurns.map((burn, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#ff4444]">-{burn.amount}</span>
              <span className="text-(--text-dim)">{burn.time}</span>
            </div>
            <div className="text-[10px] font-mono text-(--text-dim)">
              From: {burn.account}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
