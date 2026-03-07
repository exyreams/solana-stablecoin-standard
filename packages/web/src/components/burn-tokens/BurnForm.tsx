import type { FC } from "react";
import { Input } from "../ui/Input";
import { AlertCircle } from "lucide-react";

export const BurnForm: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-6">
      <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
        Burn Configuration
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-(--text-dim) mb-2">
            Token Account Address
          </label>
          <Input
            placeholder="Enter token account address"
            className="font-mono text-xs"
          />
          <p className="text-[10px] text-(--text-dim) mt-1">
            The token account from which tokens will be burned
          </p>
        </div>

        <div>
          <label className="block text-xs font-mono text-(--text-dim) mb-2">
            Amount to Burn (USDC)
          </label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              className="font-mono text-lg pr-20"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-(--accent-primary) hover:text-(--accent-active)">
              MAX
            </button>
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-[10px] text-(--text-dim)">
              Available: 1,250,000 USDC
            </p>
            <button className="text-[10px] font-mono text-(--accent-primary) hover:text-(--accent-active)">
              REFRESH
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-(--text-dim) mb-2">
            Burner Authority
          </label>
          <select className="w-full px-3 py-2 bg-(--bg-input) border border-(--border-mid) text-(--text-main) font-mono text-xs focus:border-(--accent-primary) focus:outline-none">
            <option>Treasury Burner (8x2F...3f93)</option>
            <option>Exchange Burner (3M1k...2a21)</option>
            <option>Reserve Burner (7Qw9...8x12)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-3 bg-(--bg-surface) border border-[#ff4444]">
          <AlertCircle className="w-4 h-4 text-[#ff4444]" />
          <span className="text-[10px] text-(--text-dim)">
            Burning tokens permanently removes them from circulation. This
            action cannot be undone.
          </span>
        </div>
      </div>
    </div>
  );
};
