import type { FC } from "react";

interface StatItem {
  label: string;
  value: string;
}

const stats: StatItem[] = [
  { label: "STABLECOINS DEPLOYED", value: "1,247" },
  { label: "TOTAL SUPPLY", value: "$2.4B USD" },
  { label: "ACTIVE MINTERS", value: "89" },
  { label: "NETWORKS", value: "MAINNET + DEVNET" },
];

export const StatsTicker: FC = () => {
  return (
    <div className="w-full overflow-hidden bg-(bg-panel) py-3 relative" style={{ borderTop: '1px solid var(--border-dim)', borderBottom: '1px solid var(--border-dim)' }}>
      {/* Left blur gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-96 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(15, 15, 15, 1) 0%, rgba(15, 15, 15, 0.95) 30%, rgba(15, 15, 15, 0) 100%)' }} />

      {/* Right blur gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-96 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(15, 15, 15, 1) 0%, rgba(15, 15, 15, 0.95) 30%, rgba(15, 15, 15, 0) 100%)' }} />

      <div className="flex whitespace-nowrap animate-scroll-slow">
        {/* First set */}
        {stats.map((stat, index) => (
          <div
            key={`stat-1-${index}`}
            className="flex items-center px-10 border-r border-(border-mid) text-(text-dim) mono text-xs"
          >
            {stat.label}:{" "}
            <span className="text-(text-main) ml-2">{stat.value}</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {stats.map((stat, index) => (
          <div
            key={`stat-2-${index}`}
            className="flex items-center px-10 border-r border-(border-mid) text-(text-dim) mono text-xs"
          >
            {stat.label}:{" "}
            <span className="text-(text-main) ml-2">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
