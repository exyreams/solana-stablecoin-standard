import type { FC } from "react";
import {
  AccountSearch,
  AccountDetails,
  AccountActions,
  AccountActivity,
} from "../../components/account-management";

const Accounts: FC = () => {
  return (
    <>
      <div className="font-mono text-[10px] text-[#444444] uppercase mb-2">
        DASHBOARD /{" "}
        <span className="text-[#777777]">USDC-SOL</span> /{" "}
        <span className="text-[#CCA352]">ACCOUNTS</span>
      </div>

      <AccountSearch />

      <div className="grid grid-cols-[420px_1fr] gap-6 items-start">
        <div className="space-y-6">
          <AccountDetails />
          <AccountActions />
        </div>

        <AccountActivity />
      </div>

      <div className="border border-dashed border-[#333333] bg-[rgba(255,68,68,0.02)] p-8 text-center mt-6">
        <div className="font-mono text-[#ff4444] text-sm font-bold mb-2">
          NO ACCOUNT FOUND
        </div>
        <div className="text-[#777777] text-[11px]">
          The address 8x2W...f93Z does not exist on the current mint. Ensure
          you are on the correct network.
        </div>
      </div>
    </>
  );
};

export default Accounts;
