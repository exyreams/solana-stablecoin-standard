import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import { Badge } from "../../components/ui/Badge";
import {
  OracleStatus,
  PriceFeedsTable,
  ManualPriceOverride,
  OracleConfig,
} from "../../components/oracle";

const Oracle: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="font-mono text-[10px] text-(--text-dim) mb-2">
          DASHBOARD <span className="text-(--text-dark)">&gt;</span> USDC-SOL{" "}
          <span className="text-(--text-dark)">&gt;</span> ORACLE
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-light tracking-wider">
            ORACLE MANAGEMENT
          </h1>
          <Badge variant="accent">PRICE FEEDS</Badge>
        </div>

        <OracleStatus />

        <div className="grid grid-cols-[1fr_380px] gap-6">
          <PriceFeedsTable />
          <div className="space-y-6">
            <ManualPriceOverride />
            <OracleConfig />
          </div>
        </div>
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Oracle;
