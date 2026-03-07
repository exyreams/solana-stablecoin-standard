import type { FC } from "react";
import { useState } from "react";
import {
  DashboardLayout,
  DashboardTopBar,
  DashboardSidebar,
  DashboardFooter,
} from "../../components/layout";
import {
  GeneralSettings,
  NetworkSettings,
  NotificationSettings,
  DisplaySettings,
  DangerZone,
} from "../../components/settings";

type Tab = "general" | "network" | "notifications" | "display" | "danger";

const Settings: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <DashboardLayout>
      <DashboardTopBar />
      <DashboardSidebar />

      <main className="col-start-2 row-start-2 overflow-y-auto flex flex-col bg-(--bg-body)">
        <header className="px-6 pt-6 pb-0 mb-4">
          <div className="font-mono text-[10px] text-(--text-dim) mb-2">
            DASHBOARD <span className="text-(--text-dark)">/</span> USDC-SOL{" "}
            <span className="text-(--text-dark)">/</span> SETTINGS
          </div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-(--text-main) border-b border-(--border-dim) pb-2">
            SETTINGS
          </h1>
        </header>

        <div className="flex flex-1 px-6 pb-6 gap-6">
          <aside className="w-[140px] flex flex-col gap-1 border-r border-(--border-dim)">
            <button
              onClick={() => setActiveTab("general")}
              className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${activeTab === "general"
                  ? "border-l-(--accent-primary) text-(--accent-active) bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
                  : "border-l-transparent text-(--text-dim) hover:text-(--text-main)"
                }`}
            >
              GENERAL
            </button>
            <button
              onClick={() => setActiveTab("network")}
              className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${activeTab === "network"
                  ? "border-l-(--accent-primary) text-(--accent-active) bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
                  : "border-l-transparent text-(--text-dim) hover:text-(--text-main)"
                }`}
            >
              NETWORK
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${activeTab === "notifications"
                  ? "border-l-(--accent-primary) text-(--accent-active) bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
                  : "border-l-transparent text-(--text-dim) hover:text-(--text-main)"
                }`}
            >
              NOTIFICATIONS
            </button>
            <button
              onClick={() => setActiveTab("display")}
              className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${activeTab === "display"
                  ? "border-l-(--accent-primary) text-(--accent-active) bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
                  : "border-l-transparent text-(--text-dim) hover:text-(--text-main)"
                }`}
            >
              DISPLAY
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setActiveTab("danger")}
              className={`bg-none border-none border-l-2 text-left px-3 py-3 cursor-pointer transition-colors font-mono text-[10px] ${activeTab === "danger"
                  ? "border-l-(--accent-primary) text-(--accent-active) bg-gradient-to-r from-[rgba(204,163,82,0.12)] to-transparent"
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
      </main>

      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Settings;
