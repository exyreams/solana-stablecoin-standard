import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import {
  MetricCard,
  ActionCard,
  RolePanel,
  SupplyChart,
  ActivityTable,
} from "../../components/dashboard";

const Dashboard: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Total Supply"
            value="42,500,000"
            subtitle={
              <span className="text-[#00ff88]">▲ 2.4% (24H)</span>
            }
          />
          <MetricCard
            label="Active Minters"
            value="8 / 12"
            subtitle={
              <span className="text-(--text-dim)">QUOTA: 100M USDC</span>
            }
          />
          <MetricCard
            label="Pause Status"
            value={
              <span className="inline-flex items-center px-2.5 py-1 text-[9px] font-bold border border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,0.05)] mt-3">
                🟢 ACTIVE
              </span>
            }
            subtitle={
              <span className="text-(--text-dim) mt-3 block">
                LAST PAUSE: 12H AGO
              </span>
            }
          />
          <MetricCard
            label="Oracle Price"
            value="$1.0001"
            valueColor="text-(--accent-active)"
            subtitle={
              <span className="text-(--text-dim)">PYTH • UPDATED 2S AGO</span>
            }
          />
        </div>

        <div className="flex gap-6">
          <div className="grid grid-cols-3 gap-4 flex-2">
            <ActionCard
              label="Mint Tokens"
              description="CREATE NEW SUPPLY • LAST: 2H AGO"
              variant="mint"
            />
            <ActionCard
              label="Burn Tokens"
              description="REDUCE CIRCULATION • LAST: 5H AGO"
              variant="burn"
            />
            <ActionCard
              label="Freeze Account"
              description="SUSPEND TRANSFERS • 3 FROZEN"
            />
            <ActionCard
              label="Blacklist Address"
              description="COMPLIANCE ENFORCEMENT • 12 LISTED"
              badge="SSS-2 ONLY"
            />
            <ActionCard
              label="Manage Minters"
              description="ROLE PERMISSIONS • 8 ACTIVE"
            />
            <ActionCard
              label="View Audit Log"
              description="TRANSACTION HISTORY • 1,247 EVENTS"
            />
          </div>

          <RolePanel />
        </div>

        <SupplyChart />

        <ActivityTable />
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Dashboard;
