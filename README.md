# @elizaos-plugins/plugin-tnt-risk-api

ElizaOS plugin: **`CHECK_TOKEN_RISK`** action for Solana tokens, backed by RiskDataApi.

Docs: https://www.tnt-audit.com/risk-api/docs
Free key (15/day): email on https://www.tnt-audit.com/risk-api
Agents can skip the key and use x402 $0.02/call.

Before your agent trades a Solana token, it can check:

- **Safety score (0-100)** — weighted from mint/freeze authority, holder concentration, liquidity, volume, and insider-cluster penalties
- **Insider wallet clusters** — wallets that share a first funder (on-chain-provable insider/sniper signal)
- **Mint & freeze authority status** — revoked or not
- **Holder concentration risk level**

## Install

```bash
bun add @elizaos-plugins/plugin-tnt-risk-api
```

Add it to your agent's plugin list:

```ts
import { tntRiskApiPlugin } from "@elizaos-plugins/plugin-tnt-risk-api";

const character = {
  // ...
  plugins: [tntRiskApiPlugin],
};
```

## Configuration

Get a free API key (15 requests/day, no card required) at **[tnt-audit.com/risk-api](https://www.tnt-audit.com/risk-api)**, then set it as an environment variable or plugin setting:

```bash
TNT_RISK_API_KEY=tnt_sk_...
```

## Usage

Once installed, your agent will automatically use `CHECK_TOKEN_RISK` whenever a message contains a Solana mint address and asks about safety, risk, or insider activity — e.g.:

> "Is this token safe to buy? EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

You can also call it directly:

```ts
import { checkTokenRisk, formatRiskSummary } from "@elizaos-plugins/plugin-tnt-risk-api";

const result = await checkTokenRisk(mintAddress, process.env.TNT_RISK_API_KEY!);
console.log(formatRiskSummary(result));
```

### Note on first-time checks

On a mint's **first-ever** check, `cluster_analysis` comes back `"pending"` while the insider-cluster trace runs in the background (usually ready within 1-2 minutes). A second call to the same mint shortly after will return `"complete"` with the full cluster breakdown.

## Docs

Full API reference, response schema, and rate limits: **[tnt-audit.com/risk-api](https://www.tnt-audit.com/risk-api)**

## License

MIT
