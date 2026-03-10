import type { FC } from "react";
import {
	ApprovalForm,
	ApprovedAccountsTable,
	PrivacyGuide,
	PrivacyStats,
} from "../../components/privacy";
import { Badge } from "../../components/ui/Badge";

const Privacy: FC = () => {
	return (
		<>
			<div className="font-mono text-[10px] text-[#777777] uppercase mb-2">
				DASHBOARD <span className="text-[#444444]">&gt;</span> USDC-SOL{" "}
				<span className="text-[#444444]">&gt;</span> PRIVACY
			</div>

			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-light tracking-wider">PRIVACY CONTROLS</h1>
				<Badge
					variant="info"
					className="text-[10px] px-3 py-1 border-[#3b82f6] text-[#3b82f6]"
				>
					SSS-3 ONLY
				</Badge>
			</div>

			<PrivacyStats />
			<ApprovalForm />
			<ApprovedAccountsTable />
			<PrivacyGuide />
		</>
	);
};

export default Privacy;
