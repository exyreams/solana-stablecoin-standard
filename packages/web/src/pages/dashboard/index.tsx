import type { FC } from "react";
import {
  MetricCard,
  ActionCard,
  RolePanel,
  SupplyChart,
  ActivityTable,
} from "../../components/dashboard";

const Dashboard: FC = () => {
  return (
    <>
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
            <span className="text-[#777777]">QUOTA: 100M USDC</span>
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
            <span className="text-[#777777] mt-3 block">
              LAST PAUSE: 12H AGO
            </span>
          }
        />
        <MetricCard
          label="Oracle Price"
          value="$1.0001"
          valueColor="text-[#FFD700]"
          subtitle={
            <span className="text-[#777777]">PYTH • UPDATED 2S AGO</span>
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
    </>
  );
};

export default Dashboard;
