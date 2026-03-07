import type { FC } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";

export const SeizureForm: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid)">
      <div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Execute Seizure
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
              From Address
            </label>
            <Badge variant="danger">BLACKLISTED</Badge>
          </div>
          <Input defaultValue="8x2F...k93m" />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
            To Address (Treasury)
          </label>
          <Input value="Treasury_v2_9z...M22" readOnly className="cursor-not-allowed" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
              Amount
            </label>
            <span className="font-mono text-[10px] text-(--text-dim)">
              AVAILABLE: 12,500.000000 USDC ↻
            </span>
          </div>
          <div className="relative">
            <Input placeholder="0.00" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-(--border-mid) px-2 py-0.5 text-[9px] font-mono">
              MAX
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
            Seizer Authority
          </label>
          <select className="w-full bg-(--bg-input) border border-(--border-mid) text-(--text-main) font-mono p-2.5 text-xs">
            <option>Authority 01 (8x2...f93)</option>
            <option>Authority 02 (9v9...e11)</option>
          </select>
        </div>

        <div className="border border-dashed border-(--danger) bg-[rgba(255,68,68,0.05)] p-4 text-(--danger) font-mono text-[10px] text-center tracking-wider">
          SEIZURE IS PERMANENT — TOKENS WILL BE TRANSFERRED TO TREASURY
        </div>

        <Button variant="danger" className="w-full font-bold">
          EXECUTE SEIZURE
        </Button>
      </div>
    </div>
  );
};
