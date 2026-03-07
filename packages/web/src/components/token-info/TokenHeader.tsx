import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Copy, ExternalLink } from "lucide-react";

export const TokenHeader: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid) p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-mono font-light">USDC-SOL</h1>
            <Badge variant="accent">SSS-2</Badge>
            <Badge variant="success">ACTIVE</Badge>
          </div>
          <p className="text-(--text-dim) text-sm">
            USD Coin on Solana - Compliant Stablecoin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            PAUSE TOKEN
          </Button>
          <Button variant="danger" size="sm">
            CLOSE MINT
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs text-(--text-dim)">
        <span>Mint:</span>
        <span className="text-(--text-main)">
          EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
        </span>
        <button className="text-(--accent-primary) hover:text-(--accent-active)">
          <Copy className="w-3 h-3" />
        </button>
        <button className="text-(--accent-primary) hover:text-(--accent-active)">
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
