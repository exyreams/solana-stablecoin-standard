import type { FC } from "react";
import { Badge } from "../ui/Badge";

export const AuditDetail: FC = () => {
	return (
		<div className="bg-(--bg-surface) border border-(--accent-primary) border-l-4 p-4 relative mt-auto">
			<div className="flex justify-between items-center mb-4 pb-2 border-b border-(--border-dim)">
				<span className="text-sm font-mono font-bold tracking-wider">
					EVENT DETAILS — MINT
				</span>
				<span className="text-sm cursor-pointer opacity-60 hover:opacity-100">
					✕
				</span>
			</div>

			<div className="grid grid-cols-2 gap-6">
				<div>
					<div className="grid grid-cols-[120px_1fr] gap-3 mb-2 text-[11px]">
						<span className="text-(--text-dark) uppercase font-bold text-[10px]">
							Timestamp
						</span>
						<span className="font-mono">2023-10-24T14:02:41.002Z</span>
					</div>
					<div className="grid grid-cols-[120px_1fr] gap-3 mb-2 text-[11px]">
						<span className="text-(--text-dark) uppercase font-bold text-[10px]">
							Action Type
						</span>
						<Badge variant="success">MINT</Badge>
					</div>
					<div className="grid grid-cols-[120px_1fr] gap-3 mb-2 text-[11px]">
						<span className="text-(--text-dark) uppercase font-bold text-[10px]">
							Initiator
						</span>
						<span className="font-mono text-(--text-dim)">
							8x2...f93h22JK...291f93{" "}
							<span className="text-[9px] cursor-pointer opacity-60 hover:opacity-100 ml-1">
								📋
							</span>
						</span>
					</div>
					<div className="grid grid-cols-[120px_1fr] gap-3 mb-2 text-[11px]">
						<span className="text-(--text-dark) uppercase font-bold text-[10px]">
							Target
						</span>
						<span className="font-mono text-(--text-dim)">
							3M1...a21kL89s...z90a21{" "}
							<span className="text-[9px] cursor-pointer opacity-60 hover:opacity-100 ml-1">
								📋
							</span>
						</span>
					</div>
					<div className="grid grid-cols-[120px_1fr] gap-3 mb-2 text-[11px]">
						<span className="text-(--text-dark) uppercase font-bold text-[10px]">
							Amount
						</span>
						<span className="font-mono text-green-400">+5,000,000.00 USDC</span>
					</div>
					<div className="grid grid-cols-[120px_1fr] gap-3 mb-2 text-[11px]">
						<span className="text-(--text-dark) uppercase font-bold text-[10px]">
							Fee (SOL)
						</span>
						<span className="font-mono">0.000005</span>
					</div>
					<div className="grid grid-cols-[120px_1fr] gap-3 mb-2 text-[11px]">
						<span className="text-(--text-dark) uppercase font-bold text-[10px]">
							Program ID
						</span>
						<span className="font-mono text-(--text-dark)">
							TokenkegQf...{" "}
							<span className="cursor-pointer opacity-60 hover:opacity-100">
								📋
							</span>
						</span>
					</div>
					<div className="grid grid-cols-[120px_1fr] gap-3 mb-2 text-[11px]">
						<span className="text-(--text-dark) uppercase font-bold text-[10px]">
							Instr. Index
						</span>
						<span className="font-mono">0</span>
					</div>
				</div>

				<div>
					<span className="text-[9px] text-(--text-dark) font-mono uppercase font-bold block mb-2">
						Raw Transaction & Logs
					</span>
					<div className="bg-(--bg-input) border border-(--border-dim) p-3 font-mono text-[10px] text-(--text-dim) h-[200px] overflow-y-auto leading-relaxed">
						{"{"}
						<br />
						&nbsp;&nbsp;"instruction": "0x0b",
						<br />
						&nbsp;&nbsp;"data": "0x00004a817c8000000000",
						<br />
						&nbsp;&nbsp;"logs": [
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;"
						<span className="text-green-400">
							Program log: Instruction: MintTo
						</span>
						",
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;"
						<span className="text-green-400">
							Program log: Minting 5000000 tokens
						</span>
						",
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;"Program log: Success",
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;"Program consumption: 4502 compute units"
						<br />
						&nbsp;&nbsp;],
						<br />
						&nbsp;&nbsp;"compute_units": 4502,
						<br />
						&nbsp;&nbsp;"recent_blockhash": "8xJ...p9K"
						<br />
						{"}"}
					</div>
					<div className="text-right mt-3">
						<button className="bg-transparent border border-(--accent-primary) text-(--accent-primary) font-mono text-[10px] font-bold px-3 py-1.5 cursor-pointer">
							OPEN IN EXPLORER
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
