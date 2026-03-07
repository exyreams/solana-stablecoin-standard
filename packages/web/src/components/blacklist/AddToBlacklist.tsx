import type { FC } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { AlertCircle, Plus } from "lucide-react";

export const AddToBlacklist: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-6">
      <div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
        Add to Blacklist
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-(--text-dim) mb-2">
            Wallet Address
          </label>
          <Input
            placeholder="Enter Solana address to blacklist"
            className="font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-(--text-dim) mb-2">
            Reason (max 128 bytes)
          </label>
          <textarea
            placeholder="Enter reason for blacklisting..."
            className="w-full px-3 py-2 bg-(--bg-input) border border-(--border-mid) text-(--text-main) font-mono text-xs focus:border-(--accent-primary) focus:outline-none resize-none"
            rows={3}
          />
          <p className="text-[10px] text-(--text-dim) mt-1">
            0 / 128 bytes used
          </p>
        </div>

        <div>
          <label className="block text-xs font-mono text-(--text-dim) mb-2">
            Blacklister Authority
          </label>
          <select className="w-full px-3 py-2 bg-(--bg-input) border border-(--border-mid) text-(--text-main) font-mono text-xs focus:border-(--accent-primary) focus:outline-none">
            <option>Compliance Officer (9v9L...1e11)</option>
            <option>Master Authority (8x2F...3f93)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-3 bg-(--bg-surface) border border-(--border-dim)">
          <AlertCircle className="w-4 h-4 text-(--accent-primary)" />
          <span className="text-[10px] text-(--text-dim)">
            Blacklisted addresses cannot send or receive tokens. Existing
            balances can be seized.
          </span>
        </div>

        <Button variant="primary" className="w-full">
          <span className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            ADD TO BLACKLIST
          </span>
        </Button>
      </div>
    </div>
  );
};
