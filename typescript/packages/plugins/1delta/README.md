# 1delta Plugin for GOAT SDK

This plugin provides tools for interacting with the [1delta protocol](https://1delta.io/), which enables advanced DeFi trading strategies including margin trading, lending, and borrowing.

## Features

- Open and close margin positions with leverage
- Swap collateral and debt tokens
- Get collateral and debt balances
- Get health factor
- Multi-chain support (Arbitrum, Ethereum, Optimism, Base, Polygon, BNB Chain)

## Installation

```bash
npm install @goat-sdk/plugin-1delta
# or
yarn add @goat-sdk/plugin-1delta
# or
pnpm add @goat-sdk/plugin-1delta
```

## Usage

```typescript
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { oneDelta } from "@goat-sdk/plugin-1delta";
import { viem } from "@goat-sdk/wallet-viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, mainnet, optimism, base, polygon, bsc } from "viem/chains";
import { http } from "viem";

// Create a wallet client for Arbitrum (default)
const arbitrumWalletClient = createWalletClient({
  account: privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`),
  transport: http(process.env.ARBITRUM_RPC_URL),
  chain: arbitrum,
});

// Get your onchain tools for Arbitrum
const arbitrumTools = await getOnChainTools({
  wallet: viem(arbitrumWalletClient),
  plugins: [
    oneDelta(), // Use default options (Arbitrum)
  ],
});

// Create a wallet client for Ethereum
const ethereumWalletClient = createWalletClient({
  account: privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`),
  transport: http(process.env.ETHEREUM_RPC_URL),
  chain: mainnet,
});

// Get your onchain tools for Ethereum
const ethereumTools = await getOnChainTools({
  wallet: viem(ethereumWalletClient),
  plugins: [
    oneDelta({ chainId: 1 }), // Specify Ethereum chain ID
  ],
});

// Similarly for other chains
const optimismTools = await getOnChainTools({
  wallet: viem(optimismWalletClient),
  plugins: [
    oneDelta({ chainId: 10 }), // Optimism
  ],
});

// With custom options
const customTools = await getOnChainTools({
  wallet: viem(walletClient),
  plugins: [
    oneDelta({
      chainId: 137, // Polygon
      composerAddress: "0xCustomComposerAddress", // Optional: override default address
      tokens: [...customTokens], // Optional: provide custom tokens
    }),
  ],
});
```

## Supported Chains

The plugin supports the following chains:

| Chain    | Chain ID | Default Support |
|----------|----------|----------------|
| Arbitrum | 42161    | ✅             |
| Ethereum | 1        | ✅             |
| Optimism | 10       | ✅             |
| Base     | 8453     | ✅             |
| Polygon  | 137      | ✅             |
| BNB Chain| 56       | ✅             |
| Mantle   | 5000     | ✅             |
| Taiko    | 167004   | ✅             |
| Venus    | 13370    | ✅             |

## Available Tools

### Get Collateral Balance

Get the collateral balance of a token for a user.

```typescript
const result = await tools.get_collateral_balance({
  token: "WETH",
});
```

### Get Debt Balance

Get the debt balance of a token for a user.

```typescript
const result = await tools.get_debt_balance({
  token: "USDC",
});
```

### Get Health Factor

Get the health factor of a user.

```typescript
const result = await tools.get_health_factor({});
```

### Open Margin Position

Open a margin position with leverage.

```typescript
const result = await tools.open_margin_position({
  collateralToken: "WETH",
  debtToken: "USDC",
  collateralAmount: "1.0",
  leverage: 4,
});
```

### Close Margin Position

Close a margin position.

```typescript
const result = await tools.close_margin_position({
  collateralToken: "WETH",
  debtToken: "USDC",
  closeAll: true,
});
```

### Swap Collateral

Swap one collateral token for another.

```typescript
const result = await tools.swap_collateral({
  fromToken: "WETH",
  toToken: "WBTC",
  amount: "1.0",
});
```

### Swap Debt

Swap one debt token for another.

```typescript
const result = await tools.swap_debt({
  fromToken: "USDC",
  toToken: "USDT",
  amount: "1000",
});
```

### Get Supported Tokens

Get the list of supported tokens for the current chain.

```typescript
const result = await tools.get_supported_tokens({});
```

### Get Chain Info

Get information about the current chain.

```typescript
const result = await tools.get_chain_info({});
```

## License

MIT 