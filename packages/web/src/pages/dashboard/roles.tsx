import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import {
  CurrentRolesTable,
  TransferAuthority,
  PermissionsMatrix,
} from "../../components/roles";

const Roles: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="font-mono text-[10px] text-(--text-dim) mb-2">
          DASHBOARD <span className="text-(--text-dark)">&gt;</span> USDC-SOL{" "}
          <span className="text-(--text-dark)">&gt;</span> ROLES
        </div>

        <h1 className="text-2xl font-light tracking-wider">
          ROLES & PERMISSIONS
        </h1>

        <div className="grid grid-cols-[1fr_400px] gap-6">
          <div className="space-y-6">
            <CurrentRolesTable />
            <PermissionsMatrix />
          </div>

          <TransferAuthority />
        </div>
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Roles;
