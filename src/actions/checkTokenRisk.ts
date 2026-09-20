import type { Action, ActionExample, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";
import { checkTokenRisk, formatRiskSummary } from "../client";

// Loosely matches a base58 Solana address (32-44 chars, no 0/O/I/l).
const SOLANA_MINT_REGEX = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;

function extractMint(text: string): string | null {
  const match = text.match(SOLANA_MINT_REGEX);
  return match ? match[0] : null;
}

export const checkTokenRiskAction: Action = {
  name: "CHECK_TOKEN_RISK",
  similes: [
    "CHECK_TOKEN_SAFETY",
    "ANALYZE_TOKEN_RISK",
    "IS_TOKEN_SAFE",
    "CHECK_RUG_RISK",
    "CHECK_INSIDER_CLUSTERS",
  ],
  description:
    "Checks a Solana token mint address for risk before trading it: 0-100 safety score, on-chain insider wallet cluster detection, mint/freeze authority status, and holder concentration. Use this before recommending or executing any trade on a Solana token.",

  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text = message.content?.text ?? "";
    return extractMint(text) !== null;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: unknown,
    callback?: HandlerCallback
  ) => {
    const text = message.content?.text ?? "";
    const mint = extractMint(text);

    if (!mint) {
      const content = {
        text: "I couldn't find a Solana token mint address in that message.",
      };
      if (callback) await callback(content);
      return { success: false, text: content.text };
    }

    // A configured key gets the authenticated path; without one we fall back to
    // the server's anonymous demo path instead of refusing to answer.
    const apiKeySetting = runtime.getSetting("TNT_RISK_API_KEY");
    const apiKey = apiKeySetting ? String(apiKeySetting) : undefined;

    try {
      const result = await checkTokenRisk(mint, apiKey);
      const summary = formatRiskSummary(result, { anonymousAccess: !apiKey });
      const content = { text: `Risk check for ${mint}:\n\n${summary}` };
      if (callback) await callback(content);
      return { success: true, text: content.text, data: result as unknown as Record<string, unknown> };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const content = { text: `Couldn't check that token's risk: ${message}` };
      if (callback) await callback(content);
      return { success: false, text: content.text };
    }
  },

  examples: [
    [
      {
        name: "{{user1}}",
        content: { text: "Is this token safe to buy? EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
      },
      {
        name: "{{agent}}",
        content: {
          text: "Let me check that token's risk profile.",
          actions: ["CHECK_TOKEN_RISK"],
        },
      },
    ],
    [
      {
        name: "{{user1}}",
        content: { text: "check for insider clusters on So11111111111111111111111111111111111111112" },
      },
      {
        name: "{{agent}}",
        content: {
          text: "Checking for insider wallet clusters on that mint now.",
          actions: ["CHECK_TOKEN_RISK"],
        },
      },
    ],
  ] as ActionExample[][],
};
