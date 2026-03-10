import { AlertTriangle, Clock, Shield } from "lucide-react";
import type { FC } from "react";

const stats = [
	{
		icon: Shield,
		label: "Total Blacklisted",
		value: "12",
		subtitle: "addresses",
	},
	{
		icon: AlertTriangle,
		label: "Tokens Seized",
		value: "245,000",
		subtitle: "USDC total",
	},
	{
		icon: Clock,
		label: "Last Updated",
		value: "2h ago",
		subtitle: "by 9v9L...1e11",
	},
];

export const BlacklistStats: FC = () => {
	return (
		<div className="grid grid-cols-3 gap-4">
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<div
						key={stat.label}
						className="bg-(--bg-panel) border border-(--border-mid) p-4"
					>
						<div className="flex items-center gap-2 mb-3">
							<Icon className="w-4 h-4 text-(--accent-primary)" />
							<div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
								{stat.label}
							</div>
						</div>
						<div className="text-2xl font-mono font-light text-(--text-main) mb-1">
							{stat.value}
						</div>
						<div className="text-[10px] text-(--text-dim)">{stat.subtitle}</div>
					</div>
				);
			})}
		</div>
	);
};
