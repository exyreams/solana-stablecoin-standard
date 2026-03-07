import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import {
  AccountSearch,
  AccountDetails,
  AccountActions,
  AccountActivity,
} from "../../components/account-management";

const Accounts: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="font-mono text-[10px] text-(--text-dark) uppercase mb-2">
          DASHBOARD /{" "}
          <span className="text-(--text-dim)">USDC-SOL</span> /{" "}
          <span className="text-(--accent-primary)">ACCOUNTS</span>
        </div>

        <AccountSearch />

        <div className="grid grid-cols-[420px_1fr] gap-6 items-start">
          <div className="space-y-6">
            <AccountDetails />
            <AccountActions />
          </div>

          <AccountActivity />
        </div>

        <div className="border border-dashed border-(--border-mid) bg-[rgba(255,68,68,0.02)] p-8 text-center mt-6">
          <div className="font-mono text-(--danger) text-sm font-bold mb-2">
            NO ACCOUNT FOUND
          </div>
          <div className="text-(--text-dim) text-[11px]">
            The address 8x2W...f93Z does not exist on the current mint. Ensure
            you are on the correct network.
          </div>
        </div>
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Accounts;
