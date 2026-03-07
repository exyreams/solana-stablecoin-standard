import type { FC } from "react";
import { ExternalLink } from "lucide-react";

interface SeizureRecord {
  from: string;
  to: string;
  amount: string;
}

const mockHistory: SeizureRecord[] = [
  { from: "8x2...f93", to: "9z...M22", amount: "500,000.00" },
  { from: "4fA...99K", to: "9z...M22", amount: "120,000.00" },
  { from: "5aV...V34", to: "9z...M22", amount: "2,000,000.00" },
  { from: "2mm...X2a", to: "9z...M22", amount: "85,000.00" },
  { from: "9zX...kP1", to: "9z...M22", amount: "15,000.00" },
  { from: "12q...0Lp", to: "9z...M22", amount: "25,000.00" },
  { from: "8h3...jJ5", to: "9z...M22", amount: "5,000.00" },
];

export const SeizureHistory: FC = () => {
  return (
    <div className="bg-(--bg-panel) border border-(--border-mid)">
      <div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
        <span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
          Seizure History
        </span>
      </div>

      <table className="w-full font-mono text-[11px]">
        <thead>
          <tr className="border-b border-(--border-mid)">
            <th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
              From
            </th>
            <th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
              To Treasury
            </th>
            <th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
              Amount
            </th>
            <th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
              Tx
            </th>
          </tr>
        </thead>
        <tbody>
          {mockHistory.map((record, index) => (
            <tr key={index} className="border-b border-(--border-dim)">
              <td className="p-3">{record.from}</td>
              <td className="p-3">{record.to}</td>
              <td className="p-3 text-(--danger)">{record.amount}</td>
              <td className="p-3">
                <a
                  href="#"
                  className="text-(--accent-primary) hover:underline flex items-center gap-1"
                >
                  EXPLORER
                  <ExternalLink className="w-3 h-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-1 p-4 font-mono text-[10px]">
        <button className="px-2 py-1 border border-(--border-mid) bg-(--bg-panel) text-(--text-dim)">
          PREV
        </button>
        <button className="px-2 py-1 border border-(--accent-primary) text-(--accent-primary)">
          1
        </button>
        <button className="px-2 py-1 border border-(--border-mid) bg-(--bg-panel) text-(--text-dim)">
          2
        </button>
        <button className="px-2 py-1 border border-(--border-mid) bg-(--bg-panel) text-(--text-dim)">
          NEXT
        </button>
      </div>
    </div>
  );
};
