import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import { AuditFilters, AuditTable, AuditDetail } from "../../components/audit-log";
import { Button } from "../../components/ui/Button";

const AuditLogs: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-4 bg-(--bg-body)">
        <div className="font-mono text-[10px] text-(--text-dim) mb-1">
          DASHBOARD <span className="text-(--text-dark)">&gt;</span>{" "}
          <span className="text-(--text-main)">USDC-SOL</span>{" "}
          <span className="text-(--text-dark)">&gt;</span>{" "}
          <span className="text-(--text-main)">AUDIT</span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-light tracking-wider">AUDIT LOG</h1>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#00ff88]" />
              <span className="font-mono text-[9px] text-green-400 border border-green-400 px-1.5 py-0.5 tracking-wider">
                LIVE
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              CSV EXPORT
            </Button>
            <Button variant="secondary" size="sm">
              JSON EXPORT
            </Button>
            <Button variant="secondary" size="sm" className="ml-2">
              RESET FILTERS
            </Button>
          </div>
        </div>

        <AuditFilters />

        <AuditTable />

        <AuditDetail />
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default AuditLogs;
