import { ExternalLink } from "lucide-react";
import type { FC } from "react";

const holders = [
	{ rank: 1, address: "9zK...M22", balance: "8,450,000", percentage: 19.88 },
	{ rank: 2, address: "3M1...a21", balance: "6,200,000", percentage: 14.59 },
	{ rank: 3, address: "7Qw...8x12", balance: "4,100,000", percentage: 9.65 },
	{ rank: 4, address: "5aW...V34", balance: "3,800,000", percentage: 8.94 },
	{ rank: 5, address: "2Kp...7m44", balance: "2,950,000", percentage: 6.94 },
];

export const TopHolders: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid) p-6">
			<div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
				Top 5 Holders
			</div>
			<table className="w-full">
				<thead>
					<tr className="border-b border-(--border-dim)">
						<th className="text-left py-2 text-[10px] font-mono text-(--text-dim) font-normal">
							RANK
						</th>
						<th className="text-left py-2 text-[10px] font-mono text-(--text-dim) font-normal">
							ADDRESS
						</th>
						<th className="text-right py-2 text-[10px] font-mono text-(--text-dim) font-normal">
							BALANCE
						</th>
						<th className="text-right py-2 text-[10px] font-mono text-(--text-dim) font-normal">
							% SUPPLY
						</th>
						<th className="w-8"></th>
					</tr>
				</thead>
				<tbody>
					{holders.map((holder) => (
						<tr key={holder.rank} className="border-b border-(--border-dim)">
							<td className="py-3 text-xs font-mono text-(--text-dim)">
								#{holder.rank}
							</td>
							<td className="py-3 text-xs font-mono text-(--text-main)">
								{holder.address}
							</td>
							<td className="py-3 text-xs font-mono text-(--text-main) text-right">
								{holder.balance}
							</td>
							<td className="py-3 text-xs font-mono text-(--accent-primary) text-right">
								{holder.percentage}%
							</td>
							<td className="py-3">
								<button className="text-(--text-dim) hover:text-(--accent-primary)">
									<ExternalLink className="w-3 h-3" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
