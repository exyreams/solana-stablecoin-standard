import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import { Badge } from "../../components/ui/Badge";
import {
  PrivacyStats,
  ApprovalForm,
  ApprovedAccountsTable,
  PrivacyGuide,
} from "../../components/privacy";

const Privacy: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="font-mono text-[10px] text-(--text-dim) uppercase mb-2">
          DASHBOARD <span className="text-(--text-dark)">&gt;</span> USDC-SOL{" "}
          <span className="text-(--text-dark)">&gt;</span> PRIVACY
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-light tracking-wider">
            PRIVACY CONTROLS
          </h1>
          <Badge
            variant="info"
            className="text-[10px] px-3 py-1 border-[#3b82f6] text-[#3b82f6]"
          >
            SSS-3 ONLY
          </Badge>
        </div>

        <PrivacyStats />
        <ApprovalForm />
        <ApprovedAccountsTable />
        <PrivacyGuide />
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Privacy;
