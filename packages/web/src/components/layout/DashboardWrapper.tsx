import type { FC } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardTopBar } from "./DashboardTopBar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardFooter } from "./DashboardFooter";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const DashboardWrapper: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-body flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
