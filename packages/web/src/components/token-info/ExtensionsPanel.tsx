import type { FC } from "react";
import { Badge } from "../ui/Badge";

const extensions = [
  {
    name: "Permanent Delegate",
    enabled: true,
    description: "Allows seizure of tokens from blacklisted accounts",
  },
  {
    name: "Transfer Hook",
    enabled: true,
    description: "Enforces blacklist checks on every transfer",
  },
  {
    name: "Metadata",
    enabled: true,
    description: "On-chain token name, symbol, and URI",
  },
  {
    name: "Confidential Transfer",
    enabled: false,
    description: "Privacy-preserving transfers (SSS-3 only)",
  },
];

export const ExtensionsPanel: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-6">
      <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
        Token-2022 Extensions
      </div>
      <div className="grid grid-cols-4 gap-4">
        {extensions.map((ext) => (
          <div key={ext.name} className="border border-(--border-mid) p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-(--text-main)">
                {ext.name}
              </span>
              <Badge
                variant={ext.enabled ? "success" : "default"}
                className="text-[8px]"
              >
                {ext.enabled ? "ENABLED" : "DISABLED"}
              </Badge>
            </div>
            <p className="text-[10px] text-(--text-dim)">{ext.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
