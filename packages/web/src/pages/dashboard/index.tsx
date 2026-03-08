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
            description="CREATE NEW SUPPLY"
            variant="mint"
            amount="+500,000 USDC"
            count="1,247 OPERATIONS"
            lastAction="LAST: 2H AGO"
          />
          <ActionCard
            label="Burn Tokens"
            description="REDUCE CIRCULATION"
            variant="burn"
            amount="-25,000 USDC"
            count="342 OPERATIONS"
            lastAction="LAST: 5H AGO"
          />
          <ActionCard
            label="Freeze Account"
            description="SUSPEND TRANSFERS"
            count="3 FROZEN"
            lastAction="LAST: 13H AGO"
          />
          <ActionCard
            label="Blacklist Address"
            description="COMPLIANCE ENFORCEMENT"
            badge="SSS-2 ONLY"
            count="12 LISTED"
            lastAction="LAST: 11H AGO"
          />
          <ActionCard
            label="Manage Minters"
            description="ROLE PERMISSIONS"
            count="8 ACTIVE MINTERS"
            lastAction="QUOTA: 100M USDC"
          />
          <ActionCard
            label="View Audit Log"
            description="TRANSACTION HISTORY"
            count="1,247 EVENTS"
            lastAction="LAST EVENT: 2S AGO"
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
