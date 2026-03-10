import { Copy } from "lucide-react";
import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface Minter {
	address: string;
	status: "active" | "inactive";
	quota: number | "unlimited";
	minted: number;
	remaining: number | "unlimited";
}

const mockMinters: Minter[] = [
	{
		address: "8x2...f93",
		status: "active",
		quota: 10000000,
		minted: 2500000,
		remaining: 7500000,
	},
	{
		address: "3M1...a21",
		status: "active",
		quota: "unlimited",
		minted: 1240500,
		remaining: "unlimited",
	},
	{
		address: "9v9...e11",
		status: "inactive",
		quota: 5000000,
		minted: 0,
		remaining: 5000000,
	},
	{
		address: "4f2...99K",
		status: "active",
		quota: 50000000,
		minted: 49000000,
		remaining: 1000000,
	},
	{
		address: "6h1...bb8",
		status: "active",
		quota: 2000000,
		minted: 1999999,
		remaining: 1,
	},
];

export const MinterTable: FC = () => {
	const getProgressPercentage = (minter: Minter): number => {
		if (minter.quota === "unlimited") return 100;
		return ((minter.quota - (minter.remaining as number)) / minter.quota) * 100;
	};

	const getProgressColor = (percentage: number): string => {
		if (percentage >= 98) return "var(--danger)";
		if (percentage >= 75) return "var(--accent-primary)";
		return "var(--accent-primary)";
	};

	return (
		<div className="bg-(--bg-panel) border border-(--border-mid)">
			<table className="w-full font-mono text-[11px]">
				<thead>
					<tr className="border-b border-(--border-mid)">
						<th className="text-left p-4 text-(--text-dark) uppercase text-[10px] font-normal">
							Address
						</th>
						<th className="text-left p-4 text-(--text-dark) uppercase text-[10px] font-normal">
							Status
						</th>
						<th className="text-left p-4 text-(--text-dark) uppercase text-[10px] font-normal">
							Quota
						</th>
						<th className="text-left p-4 text-(--text-dark) uppercase text-[10px] font-normal">
							Minted This Period
						</th>
						<th className="text-left p-4 text-(--text-dark) uppercase text-[10px] font-normal">
							Remaining
						</th>
						<th className="text-right p-4 text-(--text-dark) uppercase text-[10px] font-normal">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{mockMinters.map((minter, index) => {
						const progress = getProgressPercentage(minter);
						return (
							<tr key={index} className="border-b border-(--border-dim)">
								<td className="p-4">
									<div className="flex items-center gap-2">
										<span className="text-(--text-main)">{minter.address}</span>
										<Copy className="w-3 h-3 text-(--text-dark) hover:text-(--accent-primary) cursor-pointer" />
									</div>
								</td>
								<td className="p-4">
									<Badge
										variant={minter.status === "active" ? "success" : "danger"}
									>
										{minter.status.toUpperCase()}
									</Badge>
								</td>
								<td className="p-4">
									{minter.quota === "unlimited" ? (
										<Badge variant="accent">UNLIMITED</Badge>
									) : (
										minter.quota.toLocaleString()
									)}
								</td>
								<td className="p-4">{minter.minted.toLocaleString()}</td>
								<td className="p-4">
									<div className="flex items-center gap-2">
										{minter.quota !== "unlimited" && (
											<div className="w-20 h-1 bg-(--border-dim) relative">
												<div
													className="h-full"
													style={{
														width: `${progress}%`,
														background: getProgressColor(progress),
													}}
												/>
											</div>
										)}
										<span>
											{minter.remaining === "unlimited"
												? "∞"
												: minter.remaining.toLocaleString()}
										</span>
									</div>
								</td>
								<td className="p-4 text-right">
									<div className="flex gap-1 justify-end">
										<Button variant="secondary" size="sm">
											EDIT
										</Button>
										<Button variant="ghost" size="sm">
											RESET
										</Button>
										<Button variant="danger" size="sm">
											REMOVE
										</Button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
