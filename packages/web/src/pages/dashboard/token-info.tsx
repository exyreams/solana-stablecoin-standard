import type { FC } from "react";
import {
  TokenHeader,
  ConfigurationGrid,
  ExtensionsPanel,
  MetadataPanel,
  QuickStats,
} from "../../components/token-info";

const TokenInfo: FC = () => {
  return (
    <>
      <TokenHeader />
      <ConfigurationGrid />
      <ExtensionsPanel />
      <MetadataPanel />
      <QuickStats />
    </>
  );
};

export default TokenInfo;
