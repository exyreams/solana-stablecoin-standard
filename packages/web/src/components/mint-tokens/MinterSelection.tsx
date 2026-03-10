import type { FC } from "react";

export const MinterSelection: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid) p-6">
			<div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
				Minter Authority
			</div>
			<div className="space-y-3">
				<div>
					<label className="block text-xs font-mono text-(--text-dim) mb-2">
						Select Minter
					</label>
					<select className="w-full px-3 py-2 bg-(--bg-input) border border-(--border-mid) text-(--text-main) font-mono text-xs focus:border-(--accent-primary) focus:outline-none">
						<option>Treasury Minter (8x2F...3f93)</option>
						<option>Exchange Minter (3M1k...2a21)</option>
						<option>Reserve Minter (7Qw9...8x12)</option>
					</select>
				</div>
				<div className="flex items-center justify-between p-3 bg-(--bg-surface) border border-(--border-dim)">
					<div>
						<div className="text-xs font-mono text-(--text-main)">
							Quota Remaining
						</div>
						<div className="text-[10px] text-(--text-dim)">
							of 10,000,000 total
						</div>
					</div>
					<div className="text-lg font-mono text-(--accent-primary)">
						8,450,000
					</div>
				</div>
				<div className="w-full bg-(--bg-surface) h-2 overflow-hidden">
					<div
						className="h-full bg-(--accent-primary)"
						style={{ width: "84.5%" }}
					/>
				</div>
			</div>
		</div>
	);
};
