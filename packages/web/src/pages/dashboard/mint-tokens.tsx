import type { FC } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { AlertCircle, ArrowRight } from "lucide-react";
import {
  RecipientSection,
  AmountSection,
  MinterSelection,
  TransactionPreview,
  ComplianceChecks,
  RecentMints,
} from "../../components/mint-tokens";

const MintTokens: FC = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-light mb-2">Mint Tokens</h1>
          <p className="text-[#777777] text-sm">
            Create new token supply and distribute to recipients
          </p>
        </div>
        <Badge variant="accent">SSS-2 COMPLIANT</Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <RecipientSection />
          <AmountSection />
          <MinterSelection />

          <div className="flex gap-3">
            <Button variant="primary" className="flex-1">
              <span className="flex items-center justify-center gap-2">
                MINT TOKENS
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
            <Button variant="ghost">CANCEL</Button>
          </div>
        </div>

        <div className="space-y-6">
          <TransactionPreview />
          <ComplianceChecks />
          <RecentMints />

          <div className="bg-[#161616] border border-[#222222] p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#CCA352] shrink-0 mt-0.5" />
              <div className="text-[10px] text-[#777777] leading-relaxed">
                Minting creates new tokens and increases total supply. This
                action is recorded on-chain and cannot be reversed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MintTokens;
