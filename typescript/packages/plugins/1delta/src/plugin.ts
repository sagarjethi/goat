import { PluginBase } from "@goat-sdk/core";
import { OneDeltaTools } from "./tools";
import {
    COMPOSER_ADDRESSES,
    DEFAULT_OPTIONS,
    OneDeltaPluginOptions,
    OneDeltaPluginOptionsSchema,
    SUPPORTED_CHAINS,
    TOKENS_BY_CHAIN,
} from "./types";

/**
 * 1delta plugin for GOAT SDK
 *
 * This plugin provides tools for interacting with the 1delta protocol,
 * which enables advanced DeFi trading strategies including margin trading,
 * lending, and borrowing.
 *
 * @example
 * ```typescript
 * import { oneDelta } from "@goat-sdk/plugin-1delta";
 *
 * // Initialize the plugin with default options (Arbitrum)
 * const plugin = oneDelta();
 *
 * // Or with custom options for a specific chain
 * const plugin = oneDelta({
 *   chainId: 1, // Ethereum
 * });
 *
 * // Or with fully custom options
 * const plugin = oneDelta({
 *   composerAddress: "0x1b7966315eF0259de890F38f1bDB95Acc03caCdD",
 *   tokens: [...customTokens],
 *   chainId: 42161, // Arbitrum
 * });
 * ```
 */
export class OneDeltaPlugin extends PluginBase {
    private chainId: number;

    constructor(options: OneDeltaPluginOptions = {}) {
        // Validate options
        const validatedOptions = OneDeltaPluginOptionsSchema.parse({
            ...DEFAULT_OPTIONS,
            ...options,
        });

        const chainId = validatedOptions.chainId!;

        // If composerAddress is not provided, use the default for the chain
        const composerAddress = validatedOptions.composerAddress || COMPOSER_ADDRESSES[chainId];
        if (!composerAddress) {
            throw new Error(`No composer address found for chain ID ${chainId}`);
        }

        // If tokens are not provided, use the default for the chain
        const tokens = validatedOptions.tokens || TOKENS_BY_CHAIN[chainId];
        if (!tokens || tokens.length === 0) {
            throw new Error(`No tokens found for chain ID ${chainId}`);
        }

        // Create tools
        const tools = new OneDeltaTools(composerAddress, tokens);

        super("1delta", [tools]);

        // Set chainId after super() call
        this.chainId = chainId;
    }

    /**
     * Check if the plugin supports a specific chain
     * Supports multiple chains including Arbitrum, Ethereum, Optimism, Base, Polygon, and BNB Chain
     */
    supportsChain(chain: { name: string; id?: number }): boolean {
        // If chain ID is provided, check against that first
        if (chain.id && this.chainId === chain.id) {
            return true;
        }

        // Otherwise check by name
        const chainName = chain.name.toLowerCase();
        const supportedChain = SUPPORTED_CHAINS.find((c) => c.name === chainName || c.id === this.chainId);

        return !!supportedChain;
    }
}

/**
 * Create a new 1delta plugin instance
 *
 * @param options - Plugin options
 * @returns A new 1delta plugin instance
 */
export function oneDelta(options: OneDeltaPluginOptions = {}): OneDeltaPlugin {
    return new OneDeltaPlugin(options);
}
