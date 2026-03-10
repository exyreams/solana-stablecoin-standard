import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const TransferAuthority: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid)">
			<div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
				<span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
					Transfer Master Authority
				</span>
			</div>

			<div className="p-4 space-y-4">
				<div className="bg-(--bg-surface) border border-(--border-dim) p-4">
					<div className="text-[10px] uppercase text-(--text-dim) mb-3">
						Two-Step Transfer Flow
					</div>
					<div className="space-y-2 text-[11px] font-mono text-(--text-dim)">
						<div className="flex items-center gap-2">
							<span className="text-(--accent-primary)">1.</span> Current master
							initiates transfer
						</div>
						<div className="flex items-center gap-2">
							<span className="text-(--accent-primary)">2.</span> New master
							accepts transfer
						</div>
						<div className="flex items-center gap-2">
							<span className="text-(--accent-primary)">3.</span> Authority
							transferred
						</div>
					</div>
				</div>

				<div>
					<label className="block text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
						New Master Authority
					</label>
					<Input placeholder="Solana wallet address..." />
				</div>

				<div className="border-t border-(--border-dim) pt-4">
					<div className="flex justify-between items-center mb-2">
						<span className="text-[10px] uppercase text-(--text-dim)">
							Pending Transfer
						</span>
						<Badge variant="default">NONE</Badge>
					</div>
				</div>

				<Button variant="secondary" className="w-full">
					INITIATE TRANSFER
				</Button>

				<div className="grid grid-cols-2 gap-2">
					<Button variant="primary" className="opacity-50 cursor-not-allowed">
						ACCEPT TRANSFER
					</Button>
					<Button variant="danger" className="opacity-50 cursor-not-allowed">
						CANCEL TRANSFER
					</Button>
				</div>
			</div>
		</div>
	);
};
