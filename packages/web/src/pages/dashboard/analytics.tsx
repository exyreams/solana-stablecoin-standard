import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import {
  SupplyOverview,
  AnalyticsSupplyChart,
  TransactionBreakdown,
  TopHolders,
} from "../../components/analytics";

const Analytics: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div>
          <h1 className="text-2xl font-mono font-light mb-2">Analytics</h1>
          <p className="text-(--text-dim) text-sm">
            Token supply metrics and transaction analytics
          </p>
        </div>

        <SupplyOverview />
        <AnalyticsSupplyChart />

        <div className="grid grid-cols-2 gap-6">
          <TransactionBreakdown />
          <TopHolders />
        </div>
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Analytics;
