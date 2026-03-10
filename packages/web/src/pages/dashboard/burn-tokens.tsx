import { AlertCircle, Flame } from "lucide-react";
import { type FC, useState } from "react";
import {
	BurnForm,
	BurnPreview,
	RecentBurns,
} from "../../components/burn-tokens";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useTokens } from "../../contexts/TokenContext";
import { stablecoinApi } from "../../lib/api/stablecoin";

const BurnTokens: FC = () => {
	const { selectedToken } = useTokens();
	const [fromTokenAccount, setFromTokenAccount] = useState("");
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);

	const handleBurn = async () => {
		if (!selectedToken || !fromTokenAccount || !amount) {
			alert("Please fill in all fields");
			return;
		}

		setLoading(true);
		try {
			const response = await stablecoinApi.burn(
				selectedToken.mintAddress,
				fromTokenAccount,
				parseFloat(amount),
			);
			if (response.success) {
				alert("Burn request submitted successfully!");
				setFromTokenAccount("");
				setAmount("");
			}
		} catch (error: any) {
			console.error("Burning failed:", error);
			alert(error.response?.data?.error || "Failed to submit burn request");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-mono font-light mb-2">Burn Tokens</h1>
					<p className="text-[#777777] text-sm">
						Permanently remove tokens from circulation for{" "}
						<span className="text-[#EAEAEA] font-mono">
							{selectedToken?.symbol || "selected token"}
						</span>
					</p>
				</div>
				<Badge variant="danger">IRREVERSIBLE ACTION</Badge>
			</div>

			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-2 space-y-6">
					<BurnForm
						fromTokenAccount={fromTokenAccount}
						onFromTokenAccountChange={setFromTokenAccount}
						amount={amount}
						onAmountChange={setAmount}
						symbol={selectedToken?.symbol || "TOKEN"}
					/>

					<div className="flex gap-3">
						<Button
							variant="danger"
							className="flex-1"
							onClick={handleBurn}
							disabled={loading || !fromTokenAccount || !amount}
						>
							<span className="flex items-center justify-center gap-2">
								<Flame className="w-4 h-4" />
								{loading ? "BURNING..." : "BURN TOKENS"}
							</span>
						</Button>
						<Button
							variant="ghost"
							onClick={() => {
								setFromTokenAccount("");
								setAmount("");
							}}
						>
							CANCEL
						</Button>
					</div>
				</div>

				<div className="space-y-6">
					<BurnPreview />
					<RecentBurns />

					<div className="bg-[#161616] border border-[#222222] p-4">
						<div className="flex items-start gap-2">
							<AlertCircle className="w-4 h-4 text-[#ff4444] shrink-0 mt-0.5" />
							<div className="text-[10px] text-[#777777] leading-relaxed">
								Burning tokens permanently destroys them and reduces total
								supply. This action cannot be reversed. Ensure you have the
								correct account and amount before proceeding.
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BurnTokens;
