import type { FC } from "react";
import {
	AddMinterModal,
	EditMinterModal,
	MinterTable,
	RemoveMinterModal,
} from "../../components/minter-management";
import { Button } from "../../components/ui/Button";

const Minters: FC = () => {
	return (
		<>
			<div className="font-mono text-[10px] text-[#777777] mb-2">
				<a href="#" className="hover:text-[#CCA352]">
					Dashboard
				</a>{" "}
				<span className="text-[#444444]">/</span>{" "}
				<a href="#" className="hover:text-[#CCA352]">
					USDC-SOL
				</a>{" "}
				<span className="text-[#444444]">/</span>{" "}
				<span className="text-[#EAEAEA]">Minters</span>
			</div>

			<div className="flex items-center gap-3 mb-2">
				<Button variant="secondary">PAUSE ALL MINTERS</Button>
				<Button variant="ghost">RESUME ALL MINTERS</Button>
				<div className="flex-1" />
				<Button variant="primary">ADD MINTER</Button>
			</div>

			<MinterTable />

			<div className="grid grid-cols-3 gap-5 mt-10">
				<AddMinterModal />
				<EditMinterModal />
				<RemoveMinterModal />
			</div>
		</>
	);
};

export default Minters;
