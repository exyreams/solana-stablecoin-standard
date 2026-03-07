import type { FC } from "react";

interface Role {
  name: string;
  address: string;
}

const roles: Role[] = [
  { name: "Master Authority", address: "8x2F...3f93" },
  { name: "Minter", address: "3M1k...2a21" },
  { name: "Burner", address: "7Qw9...8x12" },
  { name: "Pauser", address: "msig...9x2a" },
  { name: "Blacklister", address: "9v9L...1e11" },
  { name: "Seizer", address: "4Kp2...7m44" },
];

export const RolePanel: FC = () => {
  return (
    <div className="bg-[rgba(15,15,15,0.8)] border border-(--border-mid) relative flex-1">
      <div className="border-b border-(--border-dim) px-4 py-2 flex justify-between items-center bg-linear-to-r from-(--bg-surface) to-transparent">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Role Assignments
        </span>
      </div>
      <div className="p-4">
        {roles.map((role, index) => (
          <div
            key={role.name}
            className={`flex justify-between items-center py-2.5 ${index < roles.length - 1 ? "border-b border-(--border-dim)" : ""
              }`}
          >
            <span className="text-[11px] font-mono text-(--text-dim)">
              {role.name}
            </span>
            <span className="text-[11px] font-mono text-(--text-main)">
              {role.address}
            </span>
            <button className="bg-transparent border border-(--accent-primary) text-(--accent-primary) text-[9px] px-2 py-0.5 cursor-pointer font-mono hover:bg-[rgba(204,163,82,0.1)] transition-colors">
              EDIT
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
