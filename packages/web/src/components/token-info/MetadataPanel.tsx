import type { FC } from "react";

export const MetadataPanel: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-6">
      <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
        Token Metadata
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Name</span>
            <span className="text-(--text-main)">USD Coin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-dim)">Symbol</span>
            <span className="text-(--text-main)">USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-dim)">URI</span>
            <span className="text-(--accent-primary) truncate">
              https://metadata.usdc.com/token.json
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center border border-(--border-dim) p-4">
          <div className="w-24 h-24 bg-(--bg-surface) flex items-center justify-center text-(--text-dim) text-xs">
            TOKEN ICON
          </div>
        </div>
      </div>
    </div>
  );
};
