import type { FC } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import { Button } from "../../components/ui/Button";
import {
  MinterTable,
  AddMinterModal,
  EditMinterModal,
  RemoveMinterModal,
} from "../../components/minter-management";

const Minters: FC = () => {
  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 bg-(--bg-body)">
        <div className="font-mono text-[10px] text-(--text-dim) mb-2">
          <a href="#" className="hover:text-(--accent-primary)">
            Dashboard
          </a>{" "}
          <span className="text-(--text-dark)">/</span>{" "}
          <a href="#" className="hover:text-(--accent-primary)">
            USDC-SOL
          </a>{" "}
          <span className="text-(--text-dark)">/</span>{" "}
          <span className="text-(--text-main)">Minters</span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <Button variant="secondary">PAUSE ALL MINTERS</Button>
          <Button variant="ghost">RESUME ALL MINTERS</Button>
          <div className="flex-1" />
          <Button variant="primary">ADD MINTER</Button>
        </div>

        <MinterTable />

        <div className="grid grid-cols-3 gap-5 mt-10">
          <AddMinterModal />
          <EditMinterModal />
          <RemoveMinterModal />
        </div>
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Minters;
