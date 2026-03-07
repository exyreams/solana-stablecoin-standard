import type { FC } from "react";

const timeframes = ["24H", "7D", "30D", "90D", "ALL"];

export const AnalyticsSupplyChart: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Supply History
        </div>
        <div className="flex gap-1">
          {timeframes.map((tf, i) => (
            <button
              key={tf}
              className={`px-3 py-1 text-[10px] font-mono border transition-colors ${i === 2
                  ? "bg-(--bg-surface) border-(--accent-primary) text-(--accent-primary)"
                  : "bg-(--bg-input) border-(--border-mid) text-(--text-dim) hover:border-(--border-bright)"
                }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[300px] w-full relative">
        <svg width="100%" height="100%" viewBox="0 0 1000 250">
          <defs>
            <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(204, 163, 82, 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 L100,195 L200,180 L300,170 L400,160 L500,145 L600,130 L700,110 L800,95 L900,70 L1000,40"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2"
          />
          <path
            d="M0,200 L100,195 L200,180 L300,170 L400,160 L500,145 L600,130 L700,110 L800,95 L900,70 L1000,40 L1000,250 L0,250 Z"
            fill="url(#supplyGrad)"
          />
        </svg>
      </div>
    </div>
  );
};
