import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Flame, AlertCircle } from "lucide-react";
import { BurnForm, BurnPreview, RecentBurns } from "../../components/burn-tokens";

const BurnTokens: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-light mb-2">Burn Tokens</h1>
            <p className="text-(--text-dim) text-sm">
              Permanently remove tokens from circulation
            </p>
          </div>
          <Badge variant="danger">IRREVERSIBLE ACTION</Badge>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <BurnForm />

            <div className="flex gap-3">
              <Button variant="danger" className="flex-1">
                <span className="flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4" />
                  BURN TOKENS
                </span>
              </Button>
              <Button variant="ghost">CANCEL</Button>
            </div>
          </div>

          <div className="space-y-6">
            <BurnPreview />
            <RecentBurns />

            <div className="bg-(--bg-surface) border border-(--border-dim) p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#ff4444] shrink-0 mt-0.5" />
                <div className="text-[10px] text-(--text-dim) leading-relaxed">
                  Burning tokens permanently destroys them and reduces total
                  supply. This action cannot be reversed. Ensure you have the
                  correct account and amount before proceeding.
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

export default BurnTokens;
