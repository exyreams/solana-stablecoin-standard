import { AlertCircle } from "lucide-react";
import type { FC } from "react";
import { Input } from "../ui/Input";

export interface BurnFormProps {
	fromTokenAccount: string;
	onFromTokenAccountChange: (value: string) => void;
	amount: string;
	onAmountChange: (value: string) => void;
	symbol: string;
}

export const BurnForm: FC<BurnFormProps> = ({
	fromTokenAccount,
	onFromTokenAccountChange,
	amount,
	onAmountChange,
	symbol,
}) => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid) p-6">
			<div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
				Burn Configuration
			</div>
			<div className="space-y-4">
				<div>
					<label className="block text-xs font-mono text-(--text-dim) mb-2">
						Token Account Address
					</label>
					<Input
						value={fromTokenAccount}
						onChange={(e) => onFromTokenAccountChange(e.target.value)}
						placeholder="Enter token account address"
						className="font-mono text-xs"
					/>
					<p className="text-[10px] text-(--text-dim) mt-1">
						The token account from which tokens will be burned
					</p>
				</div>

				<div>
					<label className="block text-xs font-mono text-(--text-dim) mb-2">
						Amount to Burn ({symbol})
					</label>
					<div className="relative">
						<Input
							type="number"
							value={amount}
							onChange={(e) => onAmountChange(e.target.value)}
							placeholder="0.00"
							className="font-mono text-lg pr-20"
						/>
						<button
							onClick={() => {
								/* Logic to get max amount */
							}}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-(--accent-primary) hover:text-(--accent-active)"
						>
							MAX
						</button>
					</div>
					<div className="flex justify-between items-center mt-1">
						<p className="text-[10px] text-(--text-dim)">
							Available: --- {symbol}
						</p>
						<button className="text-[10px] font-mono text-(--accent-primary) hover:text-(--accent-active)">
							REFRESH
						</button>
					</div>
				</div>

				<div className="flex items-center gap-2 p-3 bg-(--bg-surface) border border-[#ff4444]">
					<AlertCircle className="w-4 h-4 text-[#ff4444]" />
					<span className="text-[10px] text-(--text-dim)">
						Burning tokens permanently removes them from circulation. This
						action cannot be undone.
					</span>
				</div>
			</div>
		</div>
	);
};
