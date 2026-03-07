import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Copy } from "lucide-react";

export const AccountDetails: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid)">
      <div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Account Details
        </span>
        <Badge variant="accent">TOKEN-2022</Badge>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <div className="text-[10px] uppercase text-(--text-dim) mb-1">
            Owner Address
          </div>
          <div className="font-mono text-[12px] flex items-center gap-2">
            8x2...f93{" "}
            <Copy className="w-3 h-3 text-(--text-dark) hover:text-(--accent-primary) cursor-pointer" />
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase text-(--text-dim) mb-1">
            Balance
          </div>
          <div className="text-2xl font-mono font-light">
            12,500.000000{" "}
            <span className="text-sm text-(--text-dim)">USDC</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase text-(--text-dim)">
              Frozen Status
            </span>
            <Badge variant="danger">FROZEN</Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-(--text-dim)">
                Blacklisted
              </span>
              <Badge variant="accent" className="text-[7px]">
                SSS-2
              </Badge>
            </div>
            <Badge variant="success">NOT BLACKLISTED</Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-(--text-dim)">
                Confidential Transfers
              </span>
              <Badge variant="info" className="text-[7px]">
                SSS-3
              </Badge>
            </div>
            <Badge variant="success">APPROVED</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase text-(--text-dim)">
              Delegate
            </span>
            <Badge variant="ghost">NONE</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
