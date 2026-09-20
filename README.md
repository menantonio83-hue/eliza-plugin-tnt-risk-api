# eliza-plugin-tnt-risk-api

ElizaOS plugin: **`CHECK_TOKEN_RISK`** action for Solana tokens, backed by RiskDataApi.

Docs: https://www.tnt-audit.com/risk-api/docs
Free key (15/day): get one on https://www.tnt-audit.com/risk-api

The plugin works with or without a key:

- **No key** — anonymous fallback. The client simply skips the `Authorization`
  header; the server answers from a limited per-IP demo pool and marks the
  response with `_demo`. The agent says so honestly and points at the key
  signup for higher limits.
- **With `TNT_RISK_API_KEY`** — authenticated path, 15 requests/day on the
  free tier (no card required).

x402 pay-per-call negotiation is **not** implemented by this plugin — the
key-less path is the API's anonymous demo mode, not a payment flow.

Before your agent trades a Solana token, it can check:

- **Safety score (0-100)** — weighted from mint/freeze authority, holder concentration, liquidity, volume, and insider-cluster penalties
- **Insider wallet clusters** — wallets that share a first funder (on-chain-provable insider/sniper signal)
- **Mint & freeze authority status** — revoked or not
- **Holder concentration risk level**

## Install

```bash
npm install eliza-plugin-tnt-risk-api
```

Add it to your agent's plugin list:

```ts
import { tntRiskApiPlugin } from "eliza-plugin-tnt-risk-api";

const character = {
  // ...
  plugins: [tntRiskApiPlugin],
};
```

## Configuration

`TNT_RISK_API_KEY` is optional. Set it to use the authenticated path (15 requests/day, no card required — get a key at **[tnt-audit.com/risk-api](https://www.tnt-audit.com/risk-api)**):

```bash
TNT_RISK_API_KEY=tnt_sk_...
```

If it is not set (or empty), the plugin automatically falls back to the API's
anonymous demo mode: responses carry an `_demo` marker and the per-IP daily
demo quota applies.

## Usage

Once installed, your agent will automatically use `CHECK_TOKEN_RISK` whenever a message contains a Solana mint address and asks about safety, risk, or insider activity — e.g.:

> "Is this token safe to buy? EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

You can also call it directly:

```ts
import { checkTokenRisk, formatRiskSummary } from "eliza-plugin-tnt-risk-api";

// With a key:
const result = await checkTokenRisk(mintAddress, process.env.TNT_RISK_API_KEY);
// Or without a key — anonymous demo mode (limited per day, _demo-flagged):
// const result = await checkTokenRisk(mintAddress);
console.log(formatRiskSummary(result));
```

### Note on first-time checks

On a mint's **first-ever** check, `cluster_analysis` comes back `"pending"` while the insider-cluster trace runs in the background (usually ready within 1-2 minutes). A second call to the same mint shortly after will return `"complete"` with the full cluster breakdown.

## Docs

Full API reference, response schema, and rate limits: **[tnt-audit.com/risk-api](https://www.tnt-audit.com/risk-api)**

## License

MIT
