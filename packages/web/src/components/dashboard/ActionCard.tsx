import type { FC } from "react";
import { Badge } from "../ui/Badge";

interface ActionCardProps {
  label: string;
  description: string;
  variant?: "default" | "mint" | "burn";
  badge?: string;
  onClick?: () => void;
}

export const ActionCard: FC<ActionCardProps> = ({
  label,
  description,
  variant = "default",
  badge,
  onClick,
}) => {
  const borderClass =
    variant === "mint"
      ? "border-l-4 border-l-(--accent-primary)"
      : variant === "burn"
        ? "border-l-4 border-l-[#ff4444] border-dashed"
        : "";

  const labelColor = variant === "burn" ? "text-[#ff4444]" : "";

  return (
    <div
      className={`bg-(--bg-panel) border border-(--border-mid) p-4 cursor-pointer transition-all hover:border-(--accent-primary) hover:bg-(--bg-surface) flex flex-col justify-between min-h-[100px] ${borderClass}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div
          className={`text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider ${labelColor}`}
        >
          {label}
        </div>
        {badge && (
          <Badge variant="accent" className="text-[7px]">
            {badge}
          </Badge>
        )}
      </div>
      <div className="font-mono text-[9px] text-(--text-dim)">{description}</div>
    </div>
  );
};
