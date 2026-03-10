import type { FC } from "react";
import {
	CurrentRolesTable,
	PermissionsMatrix,
	TransferAuthority,
} from "../../components/roles";

const Roles: FC = () => {
	return (
		<>
			<div className="font-mono text-[10px] text-[#777777] mb-2">
				DASHBOARD <span className="text-[#444444]">&gt;</span> USDC-SOL{" "}
				<span className="text-[#444444]">&gt;</span> ROLES
			</div>

			<h1 className="text-2xl font-light tracking-wider">
				ROLES & PERMISSIONS
			</h1>

			<div className="grid grid-cols-[1fr_400px] gap-6">
				<div className="space-y-6">
					<CurrentRolesTable />
					<PermissionsMatrix />
				</div>

				<TransferAuthority />
			</div>
		</>
	);
};

export default Roles;
