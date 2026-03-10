import type { FC } from "react";
import {
	AuditDetail,
	AuditFilters,
	AuditTable,
} from "../../components/audit-log";
import { Button } from "../../components/ui/Button";

const AuditLogs: FC = () => {
	return (
		<>
			<div className="font-mono text-[10px] text-[#777777] mb-1">
				DASHBOARD <span className="text-[#444444]">&gt;</span>{" "}
				<span className="text-[#EAEAEA]">USDC-SOL</span>{" "}
				<span className="text-[#444444]">&gt;</span>{" "}
				<span className="text-[#EAEAEA]">AUDIT</span>
			</div>

			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-3">
					<h1 className="text-xl font-light tracking-wider">AUDIT LOG</h1>
					<div className="flex items-center gap-2 ml-2">
						<div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#00ff88]" />
						<span className="font-mono text-[9px] text-green-400 border border-green-400 px-1.5 py-0.5 tracking-wider">
							LIVE
						</span>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="secondary" size="sm">
						CSV EXPORT
					</Button>
					<Button variant="secondary" size="sm">
						JSON EXPORT
					</Button>
					<Button variant="secondary" size="sm" className="ml-2">
						RESET FILTERS
					</Button>
				</div>
			</div>

			<AuditFilters />
			<AuditTable />
			<AuditDetail />
		</>
	);
};

export default AuditLogs;
