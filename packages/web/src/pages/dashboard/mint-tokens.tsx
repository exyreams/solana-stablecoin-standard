import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
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
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-light mb-2">Mint Tokens</h1>
            <p className="text-(--text-dim) text-sm">
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

            <div className="bg-(--bg-surface) border border-(--border-dim) p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-(--accent-primary) shrink-0 mt-0.5" />
                <div className="text-[10px] text-(--text-dim) leading-relaxed">
                  Minting creates new tokens and increases total supply. This
                  action is recorded on-chain and cannot be reversed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default MintTokens;
