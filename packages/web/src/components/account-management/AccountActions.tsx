import type { FC } from "react";
import { Badge } from "../ui/Badge";

export const AccountActions: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid) p-4">
			<div className="border-t border-(--border-dim) pt-4 mb-4">
				<span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
					Available Actions
				</span>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<button className="bg-transparent border border-(--accent-primary) text-(--accent-primary) p-3 text-left font-mono text-[10px] hover:bg-(--accent-glow) transition-colors">
					<div>FREEZE ACCOUNT</div>
					<div className="text-[8px] opacity-60 mt-1">
						Restrict all transfers immediately
					</div>
				</button>

				<button className="bg-transparent border border-(--border-mid) text-(--text-dim) p-3 text-left font-mono text-[10px] hover:border-(--text-main) hover:text-(--text-main) transition-colors">
					<div>THAW ACCOUNT</div>
					<div className="text-[8px] opacity-60 mt-1">
						Restore account transferability
					</div>
				</button>

				<button className="bg-transparent border border-dashed border-(--danger) text-(--danger) p-3 text-left font-mono text-[10px] hover:bg-[rgba(255,68,68,0.05)] transition-colors relative">
					<Badge
						variant="accent"
						className="absolute right-1.5 top-1.5 text-[7px]"
					>
						SSS-2
					</Badge>
					<div>ADD TO BLACKLIST</div>
					<div className="text-[8px] opacity-60 mt-1">
						Global protocol-level denial
					</div>
				</button>

				<button className="bg-(--danger) border-none text-white p-3 text-left font-mono text-[10px] font-bold hover:brightness-110 transition-all relative">
					<Badge className="absolute right-1.5 top-1.5 text-[7px] text-white border-white">
						SSS-2
					</Badge>
					<div>SEIZE TOKENS</div>
					<div className="text-[8px] opacity-70 mt-1">
						Transfer balance to treasury
					</div>
				</button>

				<button className="bg-transparent border border-(--info) text-(--info) p-3 text-left font-mono text-[10px] hover:bg-[rgba(68,170,255,0.05)] transition-colors col-span-2 relative">
					<Badge
						variant="info"
						className="absolute right-1.5 top-1.5 text-[7px]"
					>
						SSS-3
					</Badge>
					<div>APPROVE CONFIDENTIAL</div>
					<div className="text-[8px] opacity-60 mt-1">
						Enable zero-knowledge balance encryption
					</div>
				</button>
			</div>
		</div>
	);
};
