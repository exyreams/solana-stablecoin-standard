import type { FC } from "react";
import {
	ManualPriceOverride,
	OracleConfig,
	OracleStatus,
	PriceFeedsTable,
} from "../../components/oracle";
import { Badge } from "../../components/ui/Badge";

const Oracle: FC = () => {
	return (
		<>
			<div className="font-mono text-[10px] text-[#777777] mb-2">
				DASHBOARD <span className="text-[#444444]">&gt;</span> USDC-SOL{" "}
				<span className="text-[#444444]">&gt;</span> ORACLE
			</div>

			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-light tracking-wider">
					ORACLE MANAGEMENT
				</h1>
				<Badge variant="accent">PRICE FEEDS</Badge>
			</div>

			<OracleStatus />

			<div className="grid grid-cols-[1fr_380px] gap-6">
				<PriceFeedsTable />
				<div className="space-y-6">
					<ManualPriceOverride />
					<OracleConfig />
				</div>
			</div>
		</>
	);
};

export default Oracle;
