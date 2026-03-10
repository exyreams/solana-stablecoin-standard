import { type FC, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	AddMinterModal,
	EditMinterModal,
	MinterTable,
	RemoveMinterModal,
} from "../../components/minter-management";
import { Button } from "../../components/ui/Button";
import { useTokens } from "../../contexts/TokenContext";
import { adminApi, type MinterResponse } from "../../lib/api/admin";

const Minters: FC = () => {
	const { selectedToken } = useTokens();

	const [minters, setMinters] = useState<MinterResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isRemoveOpen, setIsRemoveOpen] = useState(false);
	const [selectedMinter, setSelectedMinter] = useState<MinterResponse | null>(
		null,
	);

	const fetchMinters = useCallback(async () => {
		if (!selectedToken) return;
		setIsLoading(true);
		try {
			const data = await adminApi.getMinters(selectedToken.mintAddress);
			setMinters(data);
		} catch (err: any) {
			console.error("Failed to fetch minters:", err);
			toast.error("Failed to load minters");
		} finally {
			setIsLoading(false);
		}
	}, [selectedToken]);

	useEffect(() => {
		fetchMinters();
	}, [fetchMinters]);

	const handleEdit = (minter: MinterResponse) => {
		setSelectedMinter(minter);
		setIsEditOpen(true);
	};

	const handleRemove = (minter: MinterResponse) => {
		setSelectedMinter(minter);
		setIsRemoveOpen(true);
	};

	const handleReset = async (minter: MinterResponse) => {
		if (!selectedToken) return;
		if (
			!confirm(
				`Are you sure you want to reset the minted counter for ${minter.minter}?`,
			)
		) {
			return;
		}

		try {
			await adminApi.updateMinter(minter.minter, {
				quota: minter.quota,
				active: minter.active,
				resetMinted: true,
				mintAddress: selectedToken.mintAddress,
			});
			toast.success("Minter counter reset successfully");
			fetchMinters();
		} catch (_err: any) {
			toast.error("Failed to reset minter counter");
		}
	};

	return (
		<>
			<div className="font-mono text-[10px] text-[#777777] mb-2">
				<a href="#" className="hover:text-[#CCA352]">
					Dashboard
				</a>{" "}
				<span className="text-[#444444]">/</span>{" "}
				<a href="#" className="hover:text-[#CCA352]">
					{selectedToken?.symbol || "TOKEN"}
				</a>{" "}
				<span className="text-[#444444]">/</span>{" "}
				<span className="text-[#EAEAEA]">Minters</span>
			</div>

			<div className="flex items-center gap-3 mb-6">
				<div className="text-sm font-mono text-(--text-dim) uppercase">
					Minter Management
				</div>
				<div className="flex-1" />
				<Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
					ADD MINTER
				</Button>
			</div>

			<MinterTable
				minters={minters}
				isLoading={isLoading}
				onEdit={handleEdit}
				onRemove={handleRemove}
				onReset={handleReset}
			/>

			<AddMinterModal
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				onSuccess={fetchMinters}
				mintAddress={selectedToken?.mintAddress}
			/>

			<EditMinterModal
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				onSuccess={fetchMinters}
				minter={selectedMinter}
				mintAddress={selectedToken?.mintAddress}
			/>

			<RemoveMinterModal
				isOpen={isRemoveOpen}
				onClose={() => setIsRemoveOpen(false)}
				onSuccess={fetchMinters}
				minter={selectedMinter}
				mintAddress={selectedToken?.mintAddress}
			/>
		</>
	);
};

export default Minters;
