import type { FC } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const ManualPriceOverride: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid)">
			<div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
				<span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
					Manual Price Override
				</span>
			</div>

			<div className="p-4 space-y-4">
				<div>
					<label className="block text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-2">
						Override Price
					</label>
					<Input placeholder="1.0842" />
				</div>

				<div className="flex items-center gap-3">
					<div className="w-8 h-4 bg-(--border-mid) rounded-full relative cursor-pointer">
						<div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5" />
					</div>
					<span className="text-[11px] font-mono">ACTIVE</span>
				</div>

				<div className="border-t border-(--border-dim) pt-4 space-y-2">
					<div className="flex justify-between text-[10px]">
						<span className="text-(--text-dim)">CURRENT MANUAL PRICE</span>
						<Badge variant="default">NOT SET</Badge>
					</div>
				</div>

				<Button variant="secondary" className="w-full">
					SET MANUAL PRICE
				</Button>

				<button className="w-full border border-(--text-dark) text-(--text-dark) bg-transparent py-2 text-[10px] font-mono">
					CLEAR OVERRIDE
				</button>
			</div>
		</div>
	);
};
