import type { FC } from "react";
import {
	AddToBlacklist,
	BlacklistStats,
	BlacklistTable,
} from "../../components/blacklist";
import { Badge } from "../../components/ui/Badge";

const Blacklist: FC = () => {
	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-mono font-light mb-2">
						Blacklist Management
					</h1>
					<p className="text-[#777777] text-sm">
						Manage blacklisted addresses and compliance enforcement
					</p>
				</div>
				<Badge variant="accent">SSS-2 ONLY</Badge>
			</div>

			<BlacklistStats />

			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-2">
					<BlacklistTable />
				</div>
				<div>
					<AddToBlacklist />
				</div>
			</div>
		</>
	);
};

export default Blacklist;
