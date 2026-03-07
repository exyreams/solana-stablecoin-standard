import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages";
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/token-info" element={<TokenInfo />} />
        <Route path="/dashboard/mint-tokens" element={<MintTokens />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/burn-tokens" element={<BurnTokens />} />
        <Route path="/dashboard/blacklist" element={<Blacklist />} />
        <Route path="/dashboard/minters" element={<Minters />} />
        <Route path="/dashboard/accounts" element={<Accounts />} />
        <Route path="/dashboard/compliance" element={<Compliance />} />
        <Route path="/dashboard/privacy" element={<Privacy />} />
        <Route path="/dashboard/oracle" element={<Oracle />} />
        <Route path="/dashboard/roles" element={<Roles />} />
        <Route path="/dashboard/audit-logs" element={<AuditLogs />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/create" element={<Create />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
