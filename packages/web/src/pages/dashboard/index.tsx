import { Loader2 } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import {
	ActionCard,
	ActivityTable,
	MetricCard,
	RolePanel,
	SupplyChart,
} from "../../components/dashboard";
import { useTokens } from "../../contexts/TokenContext";
import {
	type StablecoinDetails,
	stablecoinApi,
} from "../../lib/api/stablecoin";

const Dashboard: FC = () => {
	const { selectedToken } = useTokens();
	const [details, setDetails] = useState<StablecoinDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchDetails = async () => {
			if (!selectedToken) return;

			try {
				setIsLoading(true);
				const data = await stablecoinApi.get(selectedToken.mintAddress);
				setDetails(data);
			} catch (error) {
				console.error("Failed to fetch dashboard details:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDetails();
	}, [selectedToken]);

	const formatNumber = (num: string | number) => {
		return new Intl.NumberFormat().format(Number(num));
	};

	if (!selectedToken) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-(--text-dim) font-mono text-sm border border-dashed border-(--border-mid)">
				<p>NO TOKEN SELECTED</p>
				<p className="text-xs mt-2">PLEASE SELECT A TOKEN FROM THE TOP BAR</p>
			</div>
		);
	}

	if (isLoading && !details) {
		return (
			<div className="flex items-center justify-center p-24">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	const tokenData = details || selectedToken;
	const isPaused = tokenData.onChain?.paused ?? false;

	return (
		<>
			<div className="grid grid-cols-4 gap-4">
				<MetricCard
					label="Total Supply"
					value={
						tokenData.onChain
							? formatNumber(
									Number(tokenData.onChain.supply) /
										10 ** tokenData.onChain.decimals,
								)
							: "---"
					}
					subtitle={
						<span className="text-[#777777]">
							DECIMALS: {tokenData.decimals}
						</span>
					}
				/>
				<MetricCard
					label="Technical Standard"
					value={tokenData.preset.toUpperCase()}
					subtitle={<span className="text-[#CCA352]">TOKEN-2022</span>}
				/>
				<MetricCard
					label="Pause Status"
					value={
						<span
							className={`inline-flex items-center px-2.5 py-1 text-[9px] font-bold border mt-3 ${isPaused ? "border-destructive text-destructive bg-destructive/5" : "border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,0.05)]"}`}
						>
							{isPaused ? "🔴 PAUSED" : "🟢 ACTIVE"}
						</span>
					}
					subtitle={
						<span className="text-[#777777] mt-3 block">REAL-TIME STATUS</span>
					}
				/>
				<MetricCard
					label="Oracle Price"
					value="$1.00"
					valueColor="text-[#FFD700]"
					subtitle={<span className="text-[#777777]">MOCK • FIXED PRICE</span>}
				/>
			</div>

			<div className="flex gap-6">
				<div className="grid grid-cols-3 gap-4 flex-2">
					<ActionCard
						label="Mint Tokens"
						description="CREATE NEW SUPPLY"
						variant="mint"
						amount={`UNIT: ${tokenData.symbol}`}
						count="MINTING INTERFACE"
						lastAction="READY"
					/>
					<ActionCard
						label="Burn Tokens"
						description="REDUCE CIRCULATION"
						variant="burn"
						amount={`UNIT: ${tokenData.symbol}`}
						count="BURNING INTERFACE"
						lastAction="READY"
					/>
					<ActionCard
						label="Freeze Account"
						description="SUSPEND TRANSFERS"
						count={
							tokenData.onChain?.extensions.defaultAccountFrozen
								? "DEFAULT FROZEN"
								: "MANUAL FREEZE"
						}
						lastAction="COMPLIANCE"
					/>
					<ActionCard
						label="Blacklist Address"
						description="COMPLIANCE ENFORCEMENT"
						badge={tokenData.preset === "sss2" ? "SSS-2 ONLY" : "NA"}
						count={
							tokenData.onChain?.extensions.transferHook
								? "HOOK ENABLED"
								: "NO HOOK"
						}
						lastAction="REGULATORY"
					/>
					<ActionCard
						label="Manage Minters"
						description="ROLE PERMISSIONS"
						count="QUOTA MANAGEMENT"
						lastAction="ADMIN"
					/>
					<ActionCard
						label="View Audit Log"
						description="TRANSACTION HISTORY"
						count="EVENT LOGS"
						lastAction="SECURE"
					/>
				</div>

				<RolePanel details={tokenData} />
			</div>

			<SupplyChart />

			<ActivityTable />
		</>
	);
};

export default Dashboard;
