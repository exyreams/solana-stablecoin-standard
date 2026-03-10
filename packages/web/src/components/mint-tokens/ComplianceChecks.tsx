import { AlertCircle, CheckCircle } from "lucide-react";
import type { FC } from "react";

const checks = [
	{ label: "Token not paused", passed: true },
	{ label: "Minter has quota", passed: true },
	{ label: "Recipient validation pending", passed: false },
	{ label: "Amount validation pending", passed: false },
];

export const ComplianceChecks: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid) p-4">
			<div className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider mb-4">
				Pre-Mint Checks
			</div>
			<div className="space-y-3">
				{checks.map((check) => (
					<div key={check.label} className="flex items-center gap-2">
						{check.passed ? (
							<CheckCircle className="w-4 h-4 text-[#00ff88]" />
						) : (
							<AlertCircle className="w-4 h-4 text-(--text-dim)" />
						)}
						<span className="text-xs text-(--text-dim)">{check.label}</span>
					</div>
				))}
			</div>
		</div>
	);
};
