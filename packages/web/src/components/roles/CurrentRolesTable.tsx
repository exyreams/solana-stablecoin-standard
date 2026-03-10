import { Copy } from "lucide-react";
import type { FC } from "react";
import { Button } from "../ui/Button";

interface Role {
	name: string;
	address: string;
	assignedAt: string;
}

const mockRoles: Role[] = [
	{ name: "Master Authority", address: "8x2...f93", assignedAt: "2023.10.20" },
	{ name: "Burner", address: "3M1...a21", assignedAt: "2023.10.21" },
	{ name: "Pauser", address: "9v9...e11", assignedAt: "2023.10.21" },
	{ name: "Blacklister", address: "4f2...99K", assignedAt: "2023.10.22" },
	{ name: "Seizer", address: "6h1...bb8", assignedAt: "2023.10.22" },
];

export const CurrentRolesTable: FC = () => {
	return (
		<div className="bg-(--bg-panel) border border-(--border-mid)">
			<div className="border-b border-(--border-dim) p-4 flex justify-between items-center bg-gradient-to-r from-(--bg-surface) to-transparent">
				<span className="text-[10px] uppercase text-(--text-dim) font-semibold tracking-wider">
					Current Roles
				</span>
			</div>

			<table className="w-full font-mono text-[11px]">
				<thead>
					<tr className="border-b border-(--border-mid)">
						<th className="text-left p-4 text-(--text-dim) uppercase text-[9px] font-normal">
							Role Name
						</th>
						<th className="text-left p-4 text-(--text-dim) uppercase text-[9px] font-normal">
							Current Address
						</th>
						<th className="text-left p-4 text-(--text-dim) uppercase text-[9px] font-normal">
							Assigned At
						</th>
						<th className="text-right p-4 text-(--text-dim) uppercase text-[9px] font-normal">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{mockRoles.map((role, index) => (
						<tr key={index} className="border-b border-(--border-dim)">
							<td className="p-4 font-semibold">{role.name}</td>
							<td className="p-4">
								<div className="flex items-center gap-2">
									{role.address}
									<Copy className="w-3 h-3 text-(--text-dark) hover:text-(--accent-primary) cursor-pointer" />
								</div>
							</td>
							<td className="p-4 text-(--text-dim)">{role.assignedAt}</td>
							<td className="p-4 text-right">
								<Button variant="secondary" size="sm">
									UPDATE
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
