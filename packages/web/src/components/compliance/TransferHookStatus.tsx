import { Copy } from "lucide-react";
import type { FC } from "react";
import { Badge } from "../ui/Badge";

export const TransferHookStatus: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid)">
			<div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
				<span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
					Transfer Hook Status
				</span>
			</div>

			<div className="p-4 space-y-0">
				<div className="flex justify-between items-center py-3 border-b border-(--border-dim)">
					<span className="font-mono text-[11px]">INITIALIZATION</span>
					<Badge variant="success">ACTIVE</Badge>
				</div>

				<div className="flex justify-between items-center py-3 border-b border-(--border-dim)">
					<span className="font-mono text-[11px]">EXTRA_ACCOUNT_META_LIST</span>
					<div className="flex items-center gap-2">
						<span className="font-mono text-(--text-dim)">9v9...e11</span>
						<Copy className="w-3 h-3 text-(--text-dark) hover:text-(--accent-primary) cursor-pointer" />
					</div>
				</div>

				<div className="flex justify-between items-center py-3">
					<span className="font-mono text-[11px]">HOOK PROGRAM ID</span>
					<span className="font-mono text-(--text-dim)">Sook...H7a</span>
				</div>

				<div className="mt-4 text-right">
					<button className="border border-(--accent-primary) text-(--accent-primary) opacity-40 cursor-not-allowed px-4 py-2 text-[10px] font-mono">
						RE-INITIALIZE
					</button>
				</div>
			</div>
		</div>
	);
};
