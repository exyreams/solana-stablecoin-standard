import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import {
  TokenHeader,
  ConfigurationGrid,
  ExtensionsPanel,
  MetadataPanel,
  QuickStats,
} from "../../components/token-info";

const TokenInfo: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <TokenHeader />
        <ConfigurationGrid />
        <ExtensionsPanel />
        <MetadataPanel />
        <QuickStats />
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default TokenInfo;
