import type { FC } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const AddMinterModal: FC = () => {
  return (
    <div className="bg-(--bg-surface) border border-(--border-bright) p-8">
      <div className="text-sm font-bold mb-6 text-(--accent-active) uppercase tracking-wider border-l-2 border-(--accent-primary) pl-3">
        Add New Minter
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] text-(--text-dim) uppercase mb-2 font-mono">
            Authority Address
          </label>
          <Input placeholder="Solana Wallet Address" />
        </div>

        <div>
          <label className="block text-[10px] text-(--text-dim) uppercase mb-2 font-mono">
            Mint Quota
          </label>
          <Input type="number" placeholder="0" />
          <div className="text-[9px] text-(--text-dark) mt-1 font-mono">
            0 = Unlimited
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-(--text-dim) uppercase mb-2 font-mono">
            Status
          </label>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-4 bg-(--success) rounded-full relative">
              <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5" />
            </div>
            <span className="text-[11px] font-mono">ACTIVE ON CREATE</span>
          </div>
        </div>

        <Button variant="primary" className="w-full mt-8">
          ADD MINTER
        </Button>
      </div>
    </div>
  );
};
