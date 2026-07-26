import type { Plugin } from "@elizaos/core";
import { checkTokenRiskAction } from "./actions/checkTokenRisk";

export const tntRiskApiPlugin: Plugin = {
  name: "plugin-tnt-risk-api",
  description:
    "Solana token risk scoring and on-chain insider wallet cluster detection via the TNT House Risk-Data API. Gives trading agents a safety score, insider wallet cluster analysis (shared first-funder tracing), and mint/freeze authority checks before they buy a token.",
  config: {
    TNT_RISK_API_KEY: process.env.TNT_RISK_API_KEY,
  },
  actions: [checkTokenRiskAction],
};

export default tntRiskApiPlugin;
export { checkTokenRiskAction } from "./actions/checkTokenRisk";
export { checkTokenRisk, formatRiskSummary } from "./client";
export type { TokenRiskResult, InsiderCluster } from "./client";
