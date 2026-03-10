import { useState, type FC } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useTokens } from "../../contexts/TokenContext";
import { stablecoinApi } from "../../lib/api/stablecoin";
import {
  RecipientSection,
  AmountSection,
  MinterSelection,
  TransactionPreview,
  ComplianceChecks,
  RecentMints,
} from "../../components/mint-tokens";

const MintTokens: FC = () => {
  const { selectedToken } = useTokens();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!selectedToken || !recipient || !amount) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await stablecoinApi.mint(
        selectedToken.mintAddress,
        recipient,
        parseFloat(amount),
      );
      if (response.success) {
        alert("Mint request submitted successfully!");
        setRecipient("");
        setAmount("");
      }
    } catch (error: any) {
      console.error("Minting failed:", error);
      alert(error.response?.data?.error || "Failed to submit mint request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-light mb-2">Mint Tokens</h1>
          <p className="text-[#777777] text-sm">
            Create new token supply and distribute to recipients for{" "}
            <span className="text-[#EAEAEA] font-mono">
              {selectedToken?.symbol || "selected token"}
            </span>
          </p>
        </div>
        <Badge variant="accent">
          {selectedToken?.preset?.toUpperCase() || "SSS"} COMPLIANT
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <RecipientSection value={recipient} onChange={setRecipient} />
          <AmountSection
            value={amount}
            onChange={setAmount}
            symbol={selectedToken?.symbol || "TOKENS"}
          />
          <MinterSelection />

          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleMint}
              disabled={loading || !recipient || !amount}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? "PROCESSING..." : "MINT TOKENS"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setRecipient("");
                setAmount("");
              }}
            >
              CANCEL
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <TransactionPreview />
          <ComplianceChecks />
          <RecentMints />

          <div className="bg-[#161616] border border-[#222222] p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#CCA352] shrink-0 mt-0.5" />
              <div className="text-[10px] text-[#777777] leading-relaxed">
                Minting creates new tokens and increases total supply. This
                action is recorded on-chain and cannot be reversed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MintTokens;
