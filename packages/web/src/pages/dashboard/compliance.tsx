import type { FC } from "react";
import {
	ComplianceStats,
	SeizureForm,
	SeizureHistory,
	TransferHookStatus,
} from "../../components/compliance";
import { Badge } from "../../components/ui/Badge";

const Compliance: FC = () => {
	return (
		<>
			<div className="font-mono text-[10px] text-[#777777] mb-2">
				DASHBOARD <span className="text-[#444444]">&gt;</span> USDC-SOL{" "}
				<span className="text-[#444444]">&gt;</span>{" "}
				<span className="text-[#EAEAEA]">COMPLIANCE</span>
			</div>

			<div className="flex items-center gap-3">
				<h1 className="text-lg font-light tracking-wider">
					COMPLIANCE & SEIZURE
				</h1>
				<Badge variant="accent">SSS-2 ONLY</Badge>
			</div>

			<ComplianceStats />

			<div className="grid grid-cols-[1fr_400px] gap-6">
				<div className="space-y-6">
					<SeizureForm />
					<TransferHookStatus />
				</div>

				<SeizureHistory />
			</div>
		</>
	);
};

export default Compliance;
