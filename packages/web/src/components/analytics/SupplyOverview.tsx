import { TrendingDown, TrendingUp } from "lucide-react";
import type { FC } from "react";

const metrics = [
	{
		label: "Current Supply",
		value: "42,500,000",
		change: "+2.4%",
		trend: "up",
	},
	{
		label: "24H Minted",
		value: "1,620,000",
		change: "+15.2%",
		trend: "up",
	},
	{
		label: "24H Burned",
		value: "145,000",
		change: "-8.1%",
		trend: "down",
	},
	{
		label: "Net Change",
		value: "+1,475,000",
		change: "+3.5%",
		trend: "up",
	},
];

export const SupplyOverview: FC = () => {
	return (
		<div className="grid grid-cols-4 gap-4">
			{metrics.map((metric) => (
				<div
					key={metric.label}
					className="bg-(--bg-panel) border border-(--border-mid) p-4"
				>
					<div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
						{metric.label}
					</div>
					<div className="text-2xl font-mono font-light text-(--text-main) mb-1">
						{metric.value}
					</div>
					<div
						className={`flex items-center gap-1 text-xs font-mono ${
							metric.trend === "up" ? "text-[#00ff88]" : "text-[#ff4444]"
						}`}
					>
						{metric.trend === "up" ? (
							<TrendingUp className="w-3 h-3" />
						) : (
							<TrendingDown className="w-3 h-3" />
						)}
						<span>{metric.change}</span>
					</div>
				</div>
			))}
		</div>
	);
};
