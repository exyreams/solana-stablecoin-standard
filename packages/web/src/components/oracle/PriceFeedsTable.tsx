import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface PriceFeed {
	index: number;
	type: string;
	label: string;
	address: string;
	weight: number;
	status: "active" | "inactive";
	lastUpdate: string;
	lastPrice: string;
}

const mockFeeds: PriceFeed[] = [
	{
		index: 0,
		type: "SWITCHBOARD",
		label: "EUR/USD Primary",
		address: "Sw1...k9M",
		weight: 40,
		status: "active",
		lastUpdate: "2S AGO",
		lastPrice: "$1.0843",
	},
	{
		index: 1,
		type: "PYTH",
		label: "EUR/USD Pyth",
		address: "Py7...x2L",
		weight: 35,
		status: "active",
		lastUpdate: "5S AGO",
		lastPrice: "$1.0841",
	},
	{
		index: 2,
		type: "CHAINLINK",
		label: "EUR/USD CL",
		address: "CL9...a1Q",
		weight: 25,
		status: "active",
		lastUpdate: "8S AGO",
		lastPrice: "$1.0842",
	},
	{
		index: 3,
		type: "MANUAL",
		label: "Fallback Override",
		address: "N/A",
		weight: 0,
		status: "inactive",
		lastUpdate: "NEVER",
		lastPrice: "—",
	},
];

export const PriceFeedsTable: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid)">
			<div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
				<span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
					Price Feeds
				</span>
				<Button variant="secondary" size="sm">
					ADD FEED
				</Button>
			</div>

			<table className="w-full font-mono text-[11px]">
				<thead>
					<tr className="border-b border-(--border-mid)">
						<th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Index
						</th>
						<th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Type
						</th>
						<th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Label
						</th>
						<th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Address
						</th>
						<th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Weight
						</th>
						<th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Status
						</th>
						<th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Last Update
						</th>
						<th className="text-left p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Last Price
						</th>
						<th className="text-right p-3 text-(--text-dim) uppercase text-[9px] font-normal">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{mockFeeds.map((feed) => (
						<tr key={feed.index} className="border-b border-(--border-dim)">
							<td className="p-3">{feed.index}</td>
							<td className="p-3">
								<Badge variant="accent" className="text-[8px]">
									{feed.type}
								</Badge>
							</td>
							<td className="p-3">{feed.label}</td>
							<td className="p-3 text-(--text-dim)">{feed.address}</td>
							<td className="p-3">{feed.weight}%</td>
							<td className="p-3">
								<Badge
									variant={feed.status === "active" ? "success" : "default"}
								>
									{feed.status.toUpperCase()}
								</Badge>
							</td>
							<td className="p-3 text-(--text-dark)">{feed.lastUpdate}</td>
							<td className="p-3 text-(--accent-active)">{feed.lastPrice}</td>
							<td className="p-3 text-right">
								<div className="flex gap-1 justify-end">
									<Button variant="secondary" size="sm">
										CRANK
									</Button>
									<Button variant="ghost" size="sm">
										EDIT
									</Button>
									<Button variant="danger" size="sm">
										REMOVE
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
