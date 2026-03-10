import type { FC } from "react";
import {
	AnalyticsSupplyChart,
	SupplyOverview,
	TopHolders,
	TransactionBreakdown,
} from "../../components/analytics";

const Analytics: FC = () => {
	return (
		<>
			<div>
				<h1 className="text-2xl font-mono font-light mb-2">Analytics</h1>
				<p className="text-[#777777] text-sm">
					Token supply metrics and transaction analytics
				</p>
			</div>

			<SupplyOverview />
			<AnalyticsSupplyChart />

			<div className="grid grid-cols-2 gap-6">
				<TransactionBreakdown />
				<TopHolders />
			</div>
		</>
	);
};

export default Analytics;
