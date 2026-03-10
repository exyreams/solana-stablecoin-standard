import type { FC } from "react";
import { Badge } from "../ui/Badge";

export const OracleStatus: FC = () => {
	return (
		<div className="grid grid-cols-5 gap-px bg-(--border-mid) border border-(--border-mid)">
			<div className="bg-(--bg-panel) p-4">
				<div className="text-[9px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
					Status
				</div>
				<Badge variant="success">INITIALIZED</Badge>
			</div>

			<div className="bg-(--bg-panel) p-4">
				<div className="text-[9px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
					Currency Pair
				</div>
				<div className="font-mono text-lg">EUR/USD</div>
			</div>

			<div className="bg-(--bg-panel) p-4">
				<div className="text-[9px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
					Current Price
				</div>
				<div className="font-mono text-lg text-(--accent-active)">$1.0842</div>
				<div className="text-[9px] text-(--text-dark) font-mono mt-1">
					2S AGO
				</div>
			</div>

			<div className="bg-(--bg-panel) p-4">
				<div className="text-[9px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
					Aggregation
				</div>
				<div className="font-mono text-sm">MEDIAN</div>
			</div>

			<div className="bg-(--bg-panel) p-4">
				<div className="text-[9px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
					Pause Status
				</div>
				<Badge variant="success">ACTIVE</Badge>
			</div>
		</div>
	);
};
