import type { FC } from "react";
import { Badge } from "../ui/Badge";

interface Activity {
  timestamp: string;
  action: string;
  amount: string;
  target: string;
  status: string;
  actionColor?: string;
}

const activities: Activity[] = [
  {
    timestamp: "2026.03.05 14:02",
    action: "MINT",
    amount: "+500,000.00",
    target: "Treasury → 9zK...M22",
    status: "FINALIZED",
    actionColor: "text-(--accent-active)",
  },
  {
    timestamp: "2026.03.05 13:45",
    action: "FREEZE",
    amount: "--",
    target: "Account 8xL...11Q",
    status: "CONFIRMED",
  },
  {
    timestamp: "2026.03.05 12:12",
    action: "BURN",
    amount: "-25,000.00",
    target: "Exchange → NULL",
    status: "CONFIRMED",
    actionColor: "text-[#ff4444]",
  },
  {
    timestamp: "2026.03.05 11:05",
    action: "BLACKLIST",
    amount: "--",
    target: "Add 4fP...99K",
    status: "FINALIZED",
  },
  {
    timestamp: "2026.03.05 10:44",
    action: "MINT",
    amount: "+1,000,000.00",
    target: "Treasury → 5aW...V34",
    status: "FINALIZED",
    actionColor: "text-(--accent-active)",
  },
  {
    timestamp: "2026.03.05 09:12",
    action: "UPDATE ORACLE",
    amount: "--",
    target: "Pyth Feed V2",
    status: "CONFIRMED",
  },
  {
    timestamp: "2026.03.04 23:59",
    action: "MINT",
    amount: "+120,000.00",
    target: "Treasury → LP_SOL",
    status: "FINALIZED",
    actionColor: "text-(--accent-active)",
  },
  {
    timestamp: "2026.03.04 22:30",
    action: "TRANSFER AUTH",
    amount: "--",
    target: "Master → Pending",
    status: "CONFIRMED",
  },
];

export const ActivityTable: FC = () => {
  return (
    <div className="bg-[rgba(15,15,15,0.8)] border border-(--border-mid) relative">
      <div className="border-b border-(--border-dim) px-4 py-2 flex justify-between items-center bg-linear-to-r from-(--bg-surface) to-transparent">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Recent Activity Feed
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[11px]">
        <thead>
          <tr>
            <th className="text-left px-3 py-3 text-(--text-dim) border-b border-(--border-mid) font-normal uppercase text-[10px]">
              Timestamp
            </th>
            <th className="text-left px-3 py-3 text-(--text-dim) border-b border-(--border-mid) font-normal uppercase text-[10px]">
              Action Type
            </th>
            <th className="text-left px-3 py-3 text-(--text-dim) border-b border-(--border-mid) font-normal uppercase text-[10px]">
              Amount
            </th>
            <th className="text-left px-3 py-3 text-(--text-dim) border-b border-(--border-mid) font-normal uppercase text-[10px]">
              Target/Actor
            </th>
            <th className="text-left px-3 py-3 text-(--text-dim) border-b border-(--border-mid) font-normal uppercase text-[10px]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td className="px-3 py-3 border-b border-(--border-dim) text-(--text-dim)">
                {activity.timestamp}
              </td>
              <td
                className={`px-3 py-3 border-b border-(--border-dim) ${activity.actionColor || ""}`}
              >
                {activity.action}
              </td>
              <td className="px-3 py-3 border-b border-(--border-dim)">
                {activity.amount}
              </td>
              <td className="px-3 py-3 border-b border-(--border-dim) text-(--text-dim)">
                {activity.target}
              </td>
              <td className="px-3 py-3 border-b border-(--border-dim)">
                <Badge
                  variant={
                    activity.status === "FINALIZED" ? "accent" : "default"
                  }
                >
                  {activity.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
