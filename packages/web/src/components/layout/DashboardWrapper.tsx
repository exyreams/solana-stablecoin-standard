import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardTopBar } from "./DashboardTopBar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardFooter } from "./DashboardFooter";

export const DashboardWrapper: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />
      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-[#080808]">
        <Outlet />
      </main>
      <DashboardFooter />
    </DashboardLayout>
  );
};
