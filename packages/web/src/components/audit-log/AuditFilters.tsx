import type { FC } from "react";

interface AuditFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export const AuditFilters: FC<AuditFiltersProps> = ({ onFilterChange }) => {
  const actionTypes = [
    { label: "MINT", active: true, color: "text-green-400" },
    { label: "BURN", active: true, color: "text-red-400" },
    { label: "FREEZE", active: true, color: "text-yellow-400" },
    { label: "BLACKLIST", active: true, color: "text-red-400" },
    { label: "SEIZE", active: true, color: "text-red-400" },
    { label: "THAW", active: false, color: "text-(--text-dim)" },
    { label: "ROLE_UPDATE", active: false, color: "text-(--text-dim)" },
    { label: "ORACLE", active: false, color: "text-(--text-dim)" },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--border-mid) p-4">
      <div className="flex items-center gap-6">
        {/* Date Range */}
        <div className="flex flex-col gap-1.5 flex-[1.5]">
          <label className="text-[9px] text-(--text-dark) font-mono uppercase font-bold">
            Date Range
          </label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              defaultValue="2023.10.20"
              className="w-full bg-(--bg-input) border border-(--border-dim) text-(--text-main) font-mono text-[11px] px-2.5 py-1.5 outline-none focus:border-(--accent-primary)"
            />
            <span className="text-(--text-dark)">→</span>
            <input
              type="text"
              defaultValue="2023.10.24"
              className="w-full bg-(--bg-input) border border-(--border-dim) text-(--text-main) font-mono text-[11px] px-2.5 py-1.5 outline-none focus:border-(--accent-primary)"
            />
            <span className="px-1 cursor-pointer opacity-60 hover:opacity-100">
              📅
            </span>
          </div>
        </div>

        {/* Action Type */}
        <div className="flex flex-col gap-1.5 flex-[3]">
          <label className="text-[9px] text-(--text-dark) font-mono uppercase font-bold">
            Action Type
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {actionTypes.map((action) => (
              <button
                key={action.label}
                className={`px-2.5 py-1 text-[10px] font-mono border border-(--border-dim) cursor-pointer bg-(--bg-input) transition-colors ${action.active ? action.color : "text-(--text-dim)"
                  }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Initiator */}
        <div className="flex flex-col gap-1.5 flex-[1.5]">
          <label className="text-[9px] text-(--text-dark) font-mono uppercase font-bold">
            Initiator
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Address..."
              className="w-full bg-(--bg-input) border border-(--border-mid) text-(--text-main) font-mono text-[11px] px-2.5 py-1.5 pr-8 outline-none focus:border-(--accent-primary)"
            />
            <span className="absolute right-2 top-1.5 opacity-50">🔍</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] text-(--text-dark) font-mono uppercase font-bold">
            Status
          </label>
          <div className="flex bg-(--bg-input) border border-(--border-dim)">
            <button className="px-3 py-1.5 text-[10px] font-mono text-(--text-dark) border-r border-(--border-dim)">
              ALL
            </button>
            <button className="px-3 py-1.5 text-[10px] font-mono text-green-400 bg-(--bg-surface) border-r border-(--border-dim)">
              SUCCESS
            </button>
            <button className="px-3 py-1.5 text-[10px] font-mono text-(--text-dark)">
              FAILED
            </button>
          </div>
        </div>

        {/* Live Updates */}
        <div className="flex flex-col gap-1.5 ml-auto">
          <label className="text-[9px] text-(--text-dark) font-mono uppercase font-bold">
            Live Updates
          </label>
          <div className="flex items-center gap-2 bg-(--bg-input) border border-(--border-mid) px-2.5 py-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-green-400">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
