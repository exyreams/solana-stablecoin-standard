import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import { Badge } from "../../components/ui/Badge";
import {
  ComplianceStats,
  SeizureForm,
  TransferHookStatus,
  SeizureHistory,
} from "../../components/compliance";

const Compliance: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="font-mono text-[10px] text-(--text-dim) mb-2">
          DASHBOARD <span className="text-(--text-dark)">&gt;</span> USDC-SOL{" "}
          <span className="text-(--text-dark)">&gt;</span>{" "}
          <span className="text-(--text-main)">COMPLIANCE</span>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-lg font-light tracking-wider">
            COMPLIANCE & SEIZURE
          </h1>
          <Badge variant="accent">SSS-2 ONLY</Badge>
        </div>

        <ComplianceStats />

        <div className="grid grid-cols-[1fr_400px] gap-6">
          <div className="space-y-6">
            <SeizureForm />
            <TransferHookStatus />
          </div>

          <SeizureHistory />
        </div>
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Compliance;
