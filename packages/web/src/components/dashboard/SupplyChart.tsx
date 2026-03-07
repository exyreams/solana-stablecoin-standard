import type { FC } from "react";

const filters = ["7D", "30D", "90D", "ALL"];

export const SupplyChart: FC = () => {
  return (
    <div className="bg-[rgba(15,15,15,0.8)] border border-(--border-mid) relative">
      <div className="border-b border-(--border-dim) px-4 py-2 flex justify-between items-center bg-linear-to-r from-(--bg-surface) to-transparent">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Supply Trajectory
        </span>
        <div className="flex gap-1">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`bg-(--bg-input) border border-(--border-mid) text-(--text-dim) px-2.5 py-1 text-[10px] font-mono cursor-pointer ${filter === "30D"
                  ? "text-(--accent-primary) border-(--accent-primary)"
                  : "hover:border-(--border-bright)"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="h-[180px] w-full relative">
          <svg width="100%" height="100%" viewBox="0 0 1000 150">
            <path
              d="M0,130 L100,125 L200,135 L300,110 L400,100 L500,85 L600,90 L700,60 L800,55 L900,40 L1000,20"
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(204, 163, 82, 0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M0,130 L100,125 L200,135 L300,110 L400,100 L500,85 L600,90 L700,60 L800,55 L900,40 L1000,20 L1000,150 L0,150 Z"
              fill="url(#grad)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
