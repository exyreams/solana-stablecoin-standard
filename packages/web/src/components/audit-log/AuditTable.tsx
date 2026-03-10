import type { FC } from "react";
import { Badge } from "../ui/Badge";

interface AuditEvent {
	timestamp: string;
	time: string;
	action: string;
	initiator: string;
	target: string;
	amount?: string;
	status: "success" | "failed";
	txSig: string;
	selected?: boolean;
}

interface AuditTableProps {
	events?: AuditEvent[];
	onSelectEvent?: (event: AuditEvent) => void;
}

const mockEvents: AuditEvent[] = [
	{
		timestamp: "2023.10.24",
		time: "14:02:41",
		action: "MINT",
		initiator: "8x2...f93",
		target: "3M1...a21",
		amount: "+5,000,000",
		status: "success",
		txSig: "4fG...99K",
		selected: true,
	},
	{
		timestamp: "2023.10.24",
		time: "13:55:12",
		action: "BLACKLIST",
		initiator: "9v9...e11",
		target: "8x2K...f93",
		status: "success",
		txSig: "7xR...22L",
	},
	{
		timestamp: "2023.10.24",
		time: "12:30:05",
		action: "BURN",
		initiator: "3M1...a21",
		target: "—",
		amount: "-250,000",
		status: "success",
		txSig: "1mP...k88",
	},
	{
		timestamp: "2023.10.24",
		time: "11:15:22",
		action: "FREEZE",
		initiator: "8x2...f93",
		target: "5aV...V34",
		status: "success",
		txSig: "9qT...m31",
	},
	{
		timestamp: "2023.10.24",
		time: "10:00:59",
		action: "SEIZE",
		initiator: "8x2...f93",
		target: "5aV...V34",
		amount: "-12,500",
		status: "success",
		txSig: "6yU...p44",
	},
];

export const AuditTable: FC<AuditTableProps> = ({
	events = mockEvents,
	onSelectEvent,
}) => {
	const getActionBadge = (action: string) => {
		const variants: Record<string, any> = {
			MINT: { variant: "success", text: "MINT" },
			BURN: { variant: "danger", text: "BURN" },
			FREEZE: { variant: "warning", text: "FREEZE" },
			BLACKLIST: { variant: "danger", text: "BLACKLIST" },
			SEIZE: { variant: "danger", text: "SEIZE" },
			THAW: { variant: "default", text: "THAW" },
		};
		const config = variants[action] || { variant: "default", text: action };
		return <Badge variant={config.variant}>{config.text}</Badge>;
	};

	return (
		<div className="border border-(--border-mid) bg-(--bg-panel) flex-grow flex flex-col">
			<div className="overflow-auto flex-grow">
				<table className="w-full border-collapse font-mono text-[11px]">
					<thead>
						<tr className="bg-black/20">
							<th className="text-left px-3 py-3 text-(--text-dark) font-semibold uppercase text-[9px] border-b border-(--border-mid) w-[140px]">
								Timestamp
							</th>
							<th className="text-left px-3 py-3 text-(--text-dark) font-semibold uppercase text-[9px] border-b border-(--border-mid) w-[120px]">
								Action
							</th>
							<th className="text-left px-3 py-3 text-(--text-dark) font-semibold uppercase text-[9px] border-b border-(--border-mid) w-[180px]">
								Initiator
							</th>
							<th className="text-left px-3 py-3 text-(--text-dark) font-semibold uppercase text-[9px] border-b border-(--border-mid) w-[180px]">
								Target
							</th>
							<th className="text-right px-3 py-3 text-(--text-dark) font-semibold uppercase text-[9px] border-b border-(--border-mid) w-[140px]">
								Amount
							</th>
							<th className="text-left px-3 py-3 text-(--text-dark) font-semibold uppercase text-[9px] border-b border-(--border-mid) w-[120px]">
								Status
							</th>
							<th className="text-left px-3 py-3 text-(--text-dark) font-semibold uppercase text-[9px] border-b border-(--border-mid)">
								TX Sig
							</th>
						</tr>
					</thead>
					<tbody>
						{events.map((event, idx) => (
							<tr
								key={idx}
								onClick={() => onSelectEvent?.(event)}
								className={`cursor-pointer transition-colors border-b border-(--border-dim) hover:bg-[rgba(204,163,82,0.03)] ${
									event.selected
										? "bg-[rgba(204,163,82,0.08)] border-l-2 border-l-(--accent-primary)"
										: ""
								}`}
							>
								<td className="px-3 py-2.5 align-middle">
									<div className="text-(--text-main)">{event.timestamp}</div>
									<div className="text-(--text-dark)">{event.time}</div>
								</td>
								<td className="px-3 py-2.5 align-middle">
									{getActionBadge(event.action)}
								</td>
								<td className="px-3 py-2.5 align-middle">
									<span className="text-(--text-dim)">{event.initiator}</span>{" "}
									<span className="text-[9px] cursor-pointer opacity-60 hover:opacity-100">
										📋
									</span>
								</td>
								<td className="px-3 py-2.5 align-middle">
									<span className="text-(--text-dim)">{event.target}</span>{" "}
									{event.target !== "—" && (
										<span className="text-[9px] cursor-pointer opacity-60 hover:opacity-100">
											📋
										</span>
									)}
								</td>
								<td className="px-3 py-2.5 align-middle text-right">
									{event.amount ? (
										<span
											className={`font-bold ${
												event.amount.startsWith("+")
													? "text-green-400"
													: "text-red-400"
											}`}
										>
											{event.amount}
										</span>
									) : (
										<span className="text-(--text-dark)">—</span>
									)}
								</td>
								<td className="px-3 py-2.5 align-middle">
									<div
										className={`flex items-center gap-1.5 text-[9px] font-bold ${
											event.status === "success"
												? "text-green-400"
												: "text-red-400"
										}`}
									>
										<span>{event.status === "success" ? "✔" : "✘"}</span>
										{event.status.toUpperCase()}
									</div>
								</td>
								<td className="px-3 py-2.5 align-middle">
									<span className="text-(--text-dark)">{event.txSig}</span>{" "}
									<a
										href="#"
										className="text-(--accent-primary) no-underline text-[9px] ml-1"
									>
										EXPL
									</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex justify-between items-center px-3 py-3 border-t border-(--border-mid) bg-(--bg-panel)">
				<div className="text-(--text-dark) font-mono text-[10px]">
					SHOWING 1-12 OF <span className="text-(--text-dim)">142 EVENTS</span>
				</div>
				<div className="flex gap-1">
					<button className="bg-transparent border border-(--border-dim) text-(--text-dim) font-mono px-2.5 py-1 cursor-pointer text-[10px]">
						PREV
					</button>
					<button className="bg-transparent border border-(--accent-primary) text-(--accent-primary) font-mono px-2.5 py-1 cursor-pointer text-[10px]">
						1
					</button>
					<button className="bg-transparent border border-(--border-dim) text-(--text-dim) font-mono px-2.5 py-1 cursor-pointer text-[10px]">
						2
					</button>
					<button className="bg-transparent border border-(--border-dim) text-(--text-dim) font-mono px-2.5 py-1 cursor-pointer text-[10px]">
						3
					</button>
					<button className="bg-transparent border border-(--border-dim) text-(--text-dim) font-mono px-2.5 py-1 cursor-pointer text-[10px]">
						4
					</button>
					<button className="bg-transparent border border-(--border-dim) text-(--text-dim) font-mono px-2.5 py-1 cursor-pointer text-[10px]">
						NEXT
					</button>
				</div>
			</div>
		</div>
	);
};
