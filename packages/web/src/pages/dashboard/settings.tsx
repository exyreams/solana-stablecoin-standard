import type { FC } from "react";
import { useState } from "react";
import {
	DangerZone,
	DisplaySettings,
	GeneralSettings,
	NetworkSettings,
	NotificationSettings,
} from "../../components/settings";

type Tab = "general" | "network" | "notifications" | "display" | "danger";

const Settings: FC = () => {
	const [activeTab, setActiveTab] = useState<Tab>("general");

	return (
		<div className="flex flex-col h-full -m-6">
			<header className="px-6 pt-6 pb-0 mb-4">
				<div className="font-mono text-[10px] text-[#777777] mb-2">
					DASHBOARD <span className="text-[#444444]">/</span> USDC-SOL{" "}
					<span className="text-[#444444]">/</span> SETTINGS
				</div>
				<h1 className="text-2xl font-light tracking-[0.2em] text-[#EAEAEA] border-b border-[#222222] pb-2">
					SETTINGS
				</h1>
			</header>

			<div className="flex flex-1 px-6 pb-6 gap-6">
				<aside className="w-[140px] flex flex-col gap-1 border-r border-[#222222]">
					<button
						onClick={() => setActiveTab("general")}
						className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${
							activeTab === "general"
								? "border-l-[#CCA352] text-[#FFD700] bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
								: "border-l-transparent text-[#777777] hover:text-[#EAEAEA]"
						}`}
					>
						GENERAL
					</button>
					<button
						onClick={() => setActiveTab("network")}
						className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${
							activeTab === "network"
								? "border-l-[#CCA352] text-[#FFD700] bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
								: "border-l-transparent text-[#777777] hover:text-[#EAEAEA]"
						}`}
					>
						NETWORK
					</button>
					<button
						onClick={() => setActiveTab("notifications")}
						className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${
							activeTab === "notifications"
								? "border-l-[#CCA352] text-[#FFD700] bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
								: "border-l-transparent text-[#777777] hover:text-[#EAEAEA]"
						}`}
					>
						NOTIFICATIONS
					</button>
					<button
						onClick={() => setActiveTab("display")}
						className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${
							activeTab === "display"
								? "border-l-[#CCA352] text-[#FFD700] bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
								: "border-l-transparent text-[#777777] hover:text-[#EAEAEA]"
						}`}
					>
						DISPLAY
					</button>
					<div className="flex-1" />
					<button
						onClick={() => setActiveTab("danger")}
						className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${
							activeTab === "danger"
								? "border-l-[#CCA352] text-[#FFD700] bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
								: "border-l-transparent text-red-600 opacity-70 hover:opacity-100"
						}`}
					>
						DANGER ZONE
					</button>
				</aside>

				<div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
					{activeTab === "general" && <GeneralSettings />}
					{activeTab === "network" && <NetworkSettings />}
					{activeTab === "notifications" && <NotificationSettings />}
					{activeTab === "display" && <DisplaySettings />}
					{activeTab === "danger" && <DangerZone />}
				</div>
			</div>
		</div>
	);
};

export default Settings;
