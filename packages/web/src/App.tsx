import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "./contexts/WalletContextProvider";
import { LandingPage } from "./pages";
import { DashboardWrapper } from "./components/layout/DashboardWrapper";
import Dashboard from "./pages/dashboard";
import TokenInfo from "./pages/dashboard/token-info";
import MintTokens from "./pages/dashboard/mint-tokens";
import Analytics from "./pages/dashboard/analytics";
import BurnTokens from "./pages/dashboard/burn-tokens";
import Blacklist from "./pages/dashboard/blacklist";
import Minters from "./pages/dashboard/minters";
import Accounts from "./pages/dashboard/accounts";
import Compliance from "./pages/dashboard/compliance";
import Privacy from "./pages/dashboard/privacy";
import Oracle from "./pages/dashboard/oracle";
import Roles from "./pages/dashboard/roles";
import AuditLogs from "./pages/dashboard/audit-logs";
import Settings from "./pages/dashboard/settings";
import Create from "./pages/create";
import Docs from "./pages/docs";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";
import ErrorPage from "./pages/error";

function App() {
  return (
    <WalletContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardWrapper />}>
            <Route index element={<Dashboard />} />
            <Route path="token-info" element={<TokenInfo />} />
            <Route path="mint-tokens" element={<MintTokens />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="burn-tokens" element={<BurnTokens />} />
            <Route path="blacklist" element={<Blacklist />} />
            <Route path="minters" element={<Minters />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="oracle" element={<Oracle />} />
            <Route path="roles" element={<Roles />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/create" element={<DashboardWrapper />}>
            <Route index element={<Create />} />
          </Route>
          <Route path="/docs" element={<Docs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;
