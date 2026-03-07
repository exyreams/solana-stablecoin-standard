import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  label: string;
  href: string;
}

const NavItem: FC<NavItemProps> = ({ label, href }) => {
  const location = useLocation();
  const active = location.pathname === href;

  return (
    <Link
      to={href}
      className={`flex items-center px-3 py-2 text-[11px] font-mono border mb-0.5 transition-colors ${active
        ? "bg-[rgba(204,163,82,0.1)] text-(--accent-active) border-(--accent-primary) border-l-2"
        : "text-(--text-dim) border-transparent hover:border-(--border-dim) hover:text-(--text-main)"
        }`}
    >
      {label}
    </Link>
  );
};

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const NavGroup: FC<NavGroupProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="nav-group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-[9px] text-(--text-dark) uppercase mb-2 pl-2 border-l-2 border-(--accent-primary) hover:text-(--accent-primary) transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>
      {isOpen && <div className="flex flex-col">{children}</div>}
    </div>
  );
};

export const DashboardSidebar: FC = () => {
  return (
    <nav className="col-start-1 row-start-2 bg-(--bg-panel) border-r border-(--border-dim) p-4 flex flex-col gap-6 overflow-y-auto">
      {/* Quick Action - Create Stablecoin */}
      <div className="pb-4 border-b border-(--border-dim)">
        <Link
          to="/create"
          className="flex items-center justify-center px-4 py-3 text-[11px] font-mono font-bold bg-(--accent-primary) text-black border border-(--accent-primary) hover:bg-(--accent-active) hover:shadow-[0_0_15px_rgba(204,163,82,0.15)] transition-all"
        >
          + CREATE STABLECOIN
        </Link>
      </div>

      <NavGroup title="Overview">
        <NavItem label="DASHBOARD" href="/dashboard" />
        <NavItem label="TOKEN INFO" href="/dashboard/token-info" />
        <NavItem label="ANALYTICS" href="/dashboard/analytics" />
        <NavItem label="AUDIT LOGS" href="/dashboard/audit-logs" />
      </NavGroup>
      <NavGroup title="Operations">
        <NavItem label="MINT TOKENS" href="/dashboard/mint-tokens" />
        <NavItem label="BURN TOKENS" href="/dashboard/burn-tokens" />
        <NavItem label="ACCOUNTS" href="/dashboard/accounts" />
      </NavGroup>
      <NavGroup title="Compliance" defaultOpen={false}>
        <NavItem label="BLACKLIST" href="/dashboard/blacklist" />
        <NavItem label="COMPLIANCE" href="/dashboard/compliance" />
        <NavItem label="PRIVACY" href="/dashboard/privacy" />
      </NavGroup>
      <NavGroup title="Admin" defaultOpen={false}>
        <NavItem label="MINTERS" href="/dashboard/minters" />
        <NavItem label="ROLES & PERMS" href="/dashboard/roles" />
        <NavItem label="ORACLE" href="/dashboard/oracle" />
        <NavItem label="SETTINGS" href="/dashboard/settings" />
      </NavGroup>
    </nav>
  );
};
