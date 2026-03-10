import type { FC } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const EditMinterModal: FC = () => {
	return (
		<div className="bg-(--bg-surface) border border-(--border-bright) p-8">
			<div className="text-sm font-bold mb-6 text-(--accent-active) uppercase tracking-wider border-l-2 border-(--accent-primary) pl-3">
				Edit Minter Profile
			</div>

			<div className="space-y-5">
				<div>
					<label className="block text-[10px] text-(--text-dim) uppercase mb-2 font-mono">
						Authority Address
					</label>
					<Input
						value="8x2...f936x82..."
						readOnly
						className="cursor-not-allowed"
					/>
				</div>

				<div>
					<label className="block text-[10px] text-(--text-dim) uppercase mb-2 font-mono">
						Update Quota
					</label>
					<Input type="number" defaultValue="10000000" />
				</div>

				<div>
					<label className="block text-[10px] text-(--text-dim) uppercase mb-2 font-mono">
						Status
					</label>
					<div className="flex items-center gap-3 cursor-pointer">
						<div className="w-8 h-4 bg-(--success) rounded-full relative">
							<div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5" />
						</div>
						<span className="text-[11px] font-mono">MINTING ENABLED</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="reset-counter"
						className="cursor-pointer"
					/>
					<label
						htmlFor="reset-counter"
						className="text-[10px] text-(--text-dim) uppercase cursor-pointer"
					>
						Reset Minted Counter
					</label>
				</div>

				<Button variant="secondary" className="w-full mt-8">
					SAVE CHANGES
				</Button>
			</div>
		</div>
	);
};
