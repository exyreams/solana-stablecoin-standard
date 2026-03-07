import type { FC } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";

export const ApprovalForm: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid)">
      <div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Initialize Account Approval
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Token account address..." className="flex-1" />
          <Button variant="secondary" size="sm" className="px-5">
            VALIDATE
          </Button>
        </div>

        <div className="border-t border-(--border-dim) pt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-[9px] text-(--text-dark) uppercase mb-1">
              Owner
            </div>
            <div className="font-mono text-[11px]">F6uK...q1R</div>
          </div>

          <div>
            <div className="text-[9px] text-(--text-dark) uppercase mb-1">
              Balance
            </div>
            <div className="font-mono text-[11px]">1,250,000.00 USDC</div>
          </div>

          <div>
            <div className="text-[9px] text-(--text-dark) uppercase mb-1">
              Status
            </div>
            <Badge variant="accent" className="text-[8px]">
              PENDING INITIALIZATION
            </Badge>
          </div>
        </div>

        <button className="w-full border border-[#3b82f6] text-[#3b82f6] bg-transparent py-2.5 font-mono text-[11px] hover:bg-[rgba(59,130,246,0.1)] transition-colors">
          APPROVE FOR CONFIDENTIAL TRANSFERS
        </button>
      </div>
    </div>
  );
};
