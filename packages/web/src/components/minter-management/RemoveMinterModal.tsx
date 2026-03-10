import type { FC } from "react";
import { Button } from "../ui/Button";

export const RemoveMinterModal: FC = () => {
	return (
		<div className="bg-(--bg-surface) border border-(--border-bright) p-8">
			<div className="text-sm font-bold mb-6 text-(--danger) uppercase tracking-wider border-l-2 border-(--danger) pl-3">
				Remove Minter
			</div>

			<div className="border border-dashed border-(--danger) bg-[rgba(255,68,68,0.02)] p-4">
				<span className="block text-(--danger) font-bold text-[11px] mb-2">
					CRITICAL ACTION
				</span>
				<p className="text-[11px] leading-relaxed text-(--text-main) mb-3">
					Revoking minter status for{" "}
					<span className="font-mono font-bold">8x2...f93</span>.
				</p>
				<div className="font-mono text-[10px] text-(--text-dim)">
					RENT RECLAIM:{" "}
					<span className="text-(--success)">~0.00203928 SOL</span> will be
					returned to the treasury authority.
				</div>
			</div>

			<div className="flex gap-3 mt-8">
				<Button variant="ghost" className="flex-1">
					CANCEL
				</Button>
				<Button variant="danger" className="flex-1">
					CONFIRM REMOVAL
				</Button>
			</div>
		</div>
	);
};
