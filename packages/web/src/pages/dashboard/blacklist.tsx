import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import { Badge } from "../../components/ui/Badge";
import {
  BlacklistStats,
  AddToBlacklist,
  BlacklistTable,
} from "../../components/blacklist";

const Blacklist: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-light mb-2">
              Blacklist Management
            </h1>
            <p className="text-(--text-dim) text-sm">
              Manage blacklisted addresses and compliance enforcement
            </p>
          </div>
          <Badge variant="accent">SSS-2 ONLY</Badge>
        </div>

        <BlacklistStats />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <BlacklistTable />
          </div>
          <div>
            <AddToBlacklist />
          </div>
        </div>
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Blacklist;
