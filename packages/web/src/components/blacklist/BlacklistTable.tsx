import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Copy, ExternalLink, Trash2 } from "lucide-react";

const blacklistedAddresses = [
  {
    address: "4fP...99K",
    reason: "Sanctioned entity - OFAC list",
    addedBy: "9v9L...1e11",
    addedAt: "2026.03.05 11:05",
    balance: "12,500",
  },
  {
    address: "8xL...11Q",
    reason: "Fraudulent activity detected",
    addedBy: "9v9L...1e11",
    addedAt: "2026.03.04 15:22",
    balance: "8,200",
  },
  {
    address: "2Kp...7m44",
    reason: "AML compliance violation",
    addedBy: "8x2F...3f93",
    addedAt: "2026.03.03 09:15",
    balance: "0",
  },
  {
    address: "5aW...V34",
    reason: "Regulatory requirement",
    addedBy: "9v9L...1e11",
    addedAt: "2026.03.02 14:30",
    balance: "45,000",
  },
];

export const BlacklistTable: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid)">
      <div className="border-b border-(--border-dim) px-6 py-4 flex justify-between items-center">
        <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Blacklisted Addresses
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-[10px] font-mono border border-(--border-mid) text-(--text-dim) hover:border-(--accent-primary) hover:text-(--accent-primary) transition-colors">
            EXPORT CSV
          </button>
          <button className="px-3 py-1 text-[10px] font-mono border border-(--border-mid) text-(--text-dim) hover:border-(--accent-primary) hover:text-(--accent-primary) transition-colors">
            BULK IMPORT
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border-dim)">
              <th className="text-left px-6 py-3 text-[10px] font-mono text-(--text-dim) font-normal uppercase">
                Address
              </th>
              <th className="text-left px-6 py-3 text-[10px] font-mono text-(--text-dim) font-normal uppercase">
                Reason
              </th>
              <th className="text-left px-6 py-3 text-[10px] font-mono text-(--text-dim) font-normal uppercase">
                Balance
              </th>
              <th className="text-left px-6 py-3 text-[10px] font-mono text-(--text-dim) font-normal uppercase">
                Added By
              </th>
              <th className="text-left px-6 py-3 text-[10px] font-mono text-(--text-dim) font-normal uppercase">
                Added At
              </th>
              <th className="text-right px-6 py-3 text-[10px] font-mono text-(--text-dim) font-normal uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blacklistedAddresses.map((item) => (
              <tr key={item.address} className="border-b border-(--border-dim)">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-(--text-main)">
                      {item.address}
                    </span>
                    <button className="text-(--text-dim) hover:text-(--accent-primary)">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="text-(--text-dim) hover:text-(--accent-primary)">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-(--text-dim) line-clamp-1">
                    {item.reason}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-(--text-main)">
                      {item.balance}
                    </span>
                    {Number.parseInt(item.balance.replace(/,/g, "")) > 0 && (
                      <Badge variant="warning" className="text-[8px]">
                        SEIZABLE
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-(--text-dim)">
                    {item.addedBy}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-(--text-dim)">
                    {item.addedAt}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-(--text-dim) hover:text-[#ff4444] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
