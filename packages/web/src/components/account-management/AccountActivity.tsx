import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface Activity {
	timestamp: string;
	action: string;
	actionColor: string;
	details: string;
	authority: string;
	status: string;
	badge?: string;
}

const mockActivity: Activity[] = [
	{
		timestamp: "10.25 09:12",
		action: "FREEZE",
		actionColor: "var(--danger)",
		details: "5a9...2xL",
		authority: "8x2...f93",
		status: "FINALIZED",
	},
	{
		timestamp: "10.24 14:30",
		action: "THAW",
		actionColor: "var(--success)",
		details: "9v2...1pQ",
		authority: "8x2...f93",
		status: "CONFIRMED",
	},
	{
		timestamp: "10.24 11:05",
		action: "MINT",
		actionColor: "var(--accent-active)",
		details: "+5,000.00",
		authority: "system...m1",
		status: "FINALIZED",
	},
	{
		timestamp: "10.23 23:59",
		action: "TRANSFER",
		actionColor: "var(--text-dim)",
		details: "To 4f2...99K",
		authority: "OWNER",
		status: "FINALIZED",
	},
	{
		timestamp: "10.23 22:15",
		action: "BLACKLIST",
		actionColor: "var(--danger)",
		details: "global_id_0",
		authority: "9v9...e11",
		status: "FINALIZED",
		badge: "SSS-2",
	},
	{
		timestamp: "10.23 18:40",
		action: "SEIZE",
		actionColor: "var(--danger)",
		details: "-2,500.00",
		authority: "8x2...f93",
		status: "FINALIZED",
	},
	{
		timestamp: "10.22 14:02",
		action: "CONFID. APR",
		actionColor: "var(--info)",
		details: "ZK_AUTH_1",
		authority: "8x2...f93",
		status: "FINALIZED",
		badge: "SSS-3",
	},
	{
		timestamp: "10.22 09:12",
		action: "BURN",
		actionColor: "var(--danger)",
		details: "-1,000.00",
		authority: "3M1...a21",
		status: "FINALIZED",
	},
];

export const AccountActivity: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid)">
			<div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
				<span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
					Recent Account Activity
				</span>
				<div className="font-mono text-[9px] text-(--text-dark)">
					TXS: 8 / 1,402
				</div>
			</div>

			<table className="w-full font-mono text-[11px]">
				<thead>
					<tr className="border-b border-(--border-mid)">
						<th className="text-left p-3 text-(--text-dark) uppercase text-[9px] font-normal">
							Timestamp
						</th>
						<th className="text-left p-3 text-(--text-dark) uppercase text-[9px] font-normal">
							Action
						</th>
						<th className="text-left p-3 text-(--text-dark) uppercase text-[9px] font-normal">
							Details / Hash
						</th>
						<th className="text-left p-3 text-(--text-dark) uppercase text-[9px] font-normal">
							Authority
						</th>
						<th className="text-left p-3 text-(--text-dark) uppercase text-[9px] font-normal">
							Status
						</th>
					</tr>
				</thead>
				<tbody>
					{mockActivity.map((activity, index) => (
						<tr key={index} className="border-b border-(--border-dim)">
							<td className="p-3 text-(--text-dim)">{activity.timestamp}</td>
							<td className="p-3" style={{ color: activity.actionColor }}>
								{activity.action}{" "}
								{activity.badge && (
									<Badge
										variant={activity.badge === "SSS-2" ? "accent" : "info"}
										className="text-[7px] ml-1"
									>
										{activity.badge}
									</Badge>
								)}
							</td>
							<td className="p-3 text-(--text-dim)">{activity.details}</td>
							<td className="p-3">{activity.authority}</td>
							<td className="p-3">
								<Badge
									variant={activity.status === "FINALIZED" ? "accent" : "info"}
								>
									{activity.status}
								</Badge>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="p-4 text-center">
				<Button variant="ghost" size="sm">
					LOAD MORE ACTIVITY
				</Button>
			</div>
		</div>
	);
};
