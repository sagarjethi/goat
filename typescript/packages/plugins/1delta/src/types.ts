import { z } from "zod";

// Chain type definition
export const ChainSchema = z.object({
    name: z.string(),
    id: z.number(),
});

export type Chain = z.infer<typeof ChainSchema>;

// Supported chains
export const ARBITRUM: Chain = {
    name: "arbitrum",
    id: 42161,
};

export const BASE: Chain = {
    name: "base",
    id: 8453,
};

export const BNB: Chain = {
    name: "bnb",
    id: 56,
};

export const ETHEREUM: Chain = {
    name: "ethereum",
    id: 1,
};

export const MANTLE: Chain = {
    name: "mantle",
    id: 5000,
};

export const OPTIMISM: Chain = {
    name: "optimism",
    id: 10,
};

export const POLYGON: Chain = {
    name: "polygon",
    id: 137,
};

export const TAIKO: Chain = {
    name: "taiko",
    id: 167004,
};

export const VENUS: Chain = {
    name: "venus",
    id: 13370,
};

export const SUPPORTED_CHAINS = [ARBITRUM, BASE, BNB, ETHEREUM, MANTLE, OPTIMISM, POLYGON, TAIKO, VENUS];

// Token type definition
export const TokenSchema = z.object({
    symbol: z.string(),
    name: z.string(),
    address: z.string(),
    decimals: z.number(),
    chainId: z.number().optional(),
});

export type Token = z.infer<typeof TokenSchema>;

// Common tokens on supported networks
// Arbitrum tokens
export const WETH_ARBITRUM: Token = {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
    chainId: ARBITRUM.id,
};

export const USDC_ARBITRUM: Token = {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6,
    chainId: ARBITRUM.id,
};

export const USDT_ARBITRUM: Token = {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6,
    chainId: ARBITRUM.id,
};

export const DAI_ARBITRUM: Token = {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    decimals: 18,
    chainId: ARBITRUM.id,
};

export const WBTC_ARBITRUM: Token = {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    decimals: 8,
    chainId: ARBITRUM.id,
};

// Ethereum tokens
export const WETH_ETHEREUM: Token = {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    chainId: ETHEREUM.id,
};

export const USDC_ETHEREUM: Token = {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    chainId: ETHEREUM.id,
};

export const USDT_ETHEREUM: Token = {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    chainId: ETHEREUM.id,
};

export const DAI_ETHEREUM: Token = {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    chainId: ETHEREUM.id,
};

export const WBTC_ETHEREUM: Token = {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    chainId: ETHEREUM.id,
};

// Optimism tokens
export const WETH_OPTIMISM: Token = {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    chainId: OPTIMISM.id,
};

export const USDC_OPTIMISM: Token = {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    decimals: 6,
    chainId: OPTIMISM.id,
};

export const USDT_OPTIMISM: Token = {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    decimals: 6,
    chainId: OPTIMISM.id,
};

export const DAI_OPTIMISM: Token = {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    decimals: 18,
    chainId: OPTIMISM.id,
};

export const WBTC_OPTIMISM: Token = {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    decimals: 8,
    chainId: OPTIMISM.id,
};

// Base tokens
export const WETH_BASE: Token = {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    chainId: BASE.id,
};

export const USDC_BASE: Token = {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    chainId: BASE.id,
};

export const DAI_BASE: Token = {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
    chainId: BASE.id,
};

// Polygon tokens
export const WETH_POLYGON: Token = {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    decimals: 18,
    chainId: POLYGON.id,
};

export const USDC_POLYGON: Token = {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
    chainId: POLYGON.id,
};

export const USDT_POLYGON: Token = {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    chainId: POLYGON.id,
};

export const DAI_POLYGON: Token = {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    decimals: 18,
    chainId: POLYGON.id,
};

export const WBTC_POLYGON: Token = {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    decimals: 8,
    chainId: POLYGON.id,
};

// BNB Chain tokens
export const WBNB_BNB: Token = {
    symbol: "WBNB",
    name: "Wrapped BNB",
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    decimals: 18,
    chainId: BNB.id,
};

export const USDC_BNB: Token = {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    decimals: 18,
    chainId: BNB.id,
};

export const USDT_BNB: Token = {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18,
    chainId: BNB.id,
};

export const DAI_BNB: Token = {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    decimals: 18,
    chainId: BNB.id,
};

export const BTCB_BNB: Token = {
    symbol: "BTCB",
    name: "Bitcoin BEP2",
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    decimals: 18,
    chainId: BNB.id,
};

// Group tokens by chain
export const TOKENS_BY_CHAIN = {
    [ARBITRUM.id]: [WETH_ARBITRUM, USDC_ARBITRUM, USDT_ARBITRUM, DAI_ARBITRUM, WBTC_ARBITRUM],
    [ETHEREUM.id]: [WETH_ETHEREUM, USDC_ETHEREUM, USDT_ETHEREUM, DAI_ETHEREUM, WBTC_ETHEREUM],
    [OPTIMISM.id]: [WETH_OPTIMISM, USDC_OPTIMISM, USDT_OPTIMISM, DAI_OPTIMISM, WBTC_OPTIMISM],
    [BASE.id]: [WETH_BASE, USDC_BASE, DAI_BASE],
    [POLYGON.id]: [WETH_POLYGON, USDC_POLYGON, USDT_POLYGON, DAI_POLYGON, WBTC_POLYGON],
    [BNB.id]: [WBNB_BNB, USDC_BNB, USDT_BNB, DAI_BNB, BTCB_BNB],
};

// For backward compatibility
export const WETH = WETH_ARBITRUM;
export const USDC = USDC_ARBITRUM;
export const USDT = USDT_ARBITRUM;
export const DAI = DAI_ARBITRUM;
export const WBTC = WBTC_ARBITRUM;

// Parameters for opening a margin position
export const OpenMarginPositionParamsSchema = z.object({
    collateralToken: TokenSchema,
    debtToken: TokenSchema,
    collateralAmount: z.string(),
    leverage: z.number().min(1).max(10),
});

export type OpenMarginPositionParams = z.infer<typeof OpenMarginPositionParamsSchema>;

// Parameters for closing a margin position
export const CloseMarginPositionParamsSchema = z.object({
    collateralToken: TokenSchema,
    debtToken: TokenSchema,
    repayAmount: z.string().optional(),
    closeAll: z.boolean().default(true),
});

export type CloseMarginPositionParams = z.infer<typeof CloseMarginPositionParamsSchema>;

// Parameters for swapping collateral
export const SwapCollateralParamsSchema = z.object({
    fromToken: TokenSchema,
    toToken: TokenSchema,
    amount: z.string(),
});

export type SwapCollateralParams = z.infer<typeof SwapCollateralParamsSchema>;

// Parameters for swapping debt
export const SwapDebtParamsSchema = z.object({
    fromToken: TokenSchema,
    toToken: TokenSchema,
    amount: z.string(),
});

export type SwapDebtParams = z.infer<typeof SwapDebtParamsSchema>;

// Composer addresses by chain
export const COMPOSER_ADDRESSES: Record<number, string> = {
    [ARBITRUM.id]: "0x1b7966315eF0259de890F38f1bDB95Acc03caCdD",
    [ETHEREUM.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Example address, replace with actual
    [OPTIMISM.id]: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318", // Example address, replace with actual
    [BASE.id]: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788", // Example address, replace with actual
    [POLYGON.id]: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e", // Example address, replace with actual
    [BNB.id]: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0", // Example address, replace with actual
};

// Plugin options
export const OneDeltaPluginOptionsSchema = z.object({
    rpcUrl: z.string().optional(),
    composerAddress: z.string().optional(),
    tokens: z.array(TokenSchema).optional(),
    chainId: z.number().optional(),
});

export type OneDeltaPluginOptions = z.infer<typeof OneDeltaPluginOptionsSchema>;

// Default options
export const DEFAULT_OPTIONS: OneDeltaPluginOptions = {
    composerAddress: COMPOSER_ADDRESSES[ARBITRUM.id],
    tokens: TOKENS_BY_CHAIN[ARBITRUM.id],
    chainId: ARBITRUM.id,
};
