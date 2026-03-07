import type { FC } from "react";

const stats = [
  {
    label: "Active Minters",
    value: "8",
    subtitle: "of 12 total",
    color: "text-(--text-main)",
  },
  {
    label: "Blacklisted",
    value: "12",
    subtitle: "addresses",
    color: "text-(--text-main)",
  },
  {
    label: "Frozen Accounts",
    value: "3",
    subtitle: "suspended",
    color: "text-(--text-main)",
  },
  {
    label: "24H Volume",
    value: "$2.4M",
    subtitle: "▲ 12.5%",
    color: "text-[#00ff88]",
  },
];

export const QuickStats: FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-(--bg-panel) border border-(--border-mid) p-4"
        >
          <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
            {stat.label}
          </div>
          <div className={`text-2xl font-mono font-light ${stat.color}`}>
            {stat.value}
          </div>
          <div
            className={`text-[10px] mt-1 ${stat.subtitle.includes("▲") ? "text-[#00ff88]" : "text-(--text-dim)"}`}
          >
            {stat.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
};
