import { Tool, WalletClient } from "@goat-sdk/core";
import { ethers } from "ethers";
import { COMPOSER_ABI } from "./abi";
import {
    ARBITRUM,
    CloseMarginPositionParams,
    CloseMarginPositionParamsSchema,
    OpenMarginPositionParams,
    OpenMarginPositionParamsSchema,
    SwapCollateralParams,
    SwapCollateralParamsSchema,
    SwapDebtParams,
    SwapDebtParamsSchema,
    Token,
} from "./types";

export class OneDeltaTools {
    private composerAddress: string;
    private tokens: Token[];
    private chainId: number;

    constructor(composerAddress: string, tokens: Token[]) {
        this.composerAddress = composerAddress;
        this.tokens = tokens;
        // Get chainId from the first token, or default to Arbitrum
        this.chainId = tokens[0]?.chainId || ARBITRUM.id;
    }

    /**
     * Get the collateral balance of a token for a user
     */
    @Tool({
        name: "get_collateral_balance",
        description: "Get the collateral balance of a token for a user",
        parameters: {
            schema: {
                type: "object",
                properties: {
                    token: {
                        type: "string",
                        description: "The token symbol to check the collateral balance for",
                    },
                },
                required: ["token"],
            },
        },
    })
    async getCollateralBalance(@WalletClient() walletClient: any, params: { token: string }) {
        const token = this.findTokenBySymbol(params.token);
        if (!token) {
            throw new Error(`Token ${params.token} not found`);
        }

        const provider = new ethers.JsonRpcProvider(walletClient.provider.url);
        const composer = new ethers.Contract(this.composerAddress, COMPOSER_ABI, provider);

        const balance = await composer.getCollateralBalance(walletClient.getAddress(), token.address);

        return {
            token: token.symbol,
            balance: ethers.formatUnits(balance, token.decimals),
            balanceInBaseUnits: balance.toString(),
        };
    }

    /**
     * Get the debt balance of a token for a user
     */
    @Tool({
        name: "get_debt_balance",
        description: "Get the debt balance of a token for a user",
        parameters: {
            schema: {
                type: "object",
                properties: {
                    token: {
                        type: "string",
                        description: "The token symbol to check the debt balance for",
                    },
                },
                required: ["token"],
            },
        },
    })
    async getDebtBalance(@WalletClient() walletClient: any, params: { token: string }) {
        const token = this.findTokenBySymbol(params.token);
        if (!token) {
            throw new Error(`Token ${params.token} not found`);
        }

        const provider = new ethers.JsonRpcProvider(walletClient.provider.url);
        const composer = new ethers.Contract(this.composerAddress, COMPOSER_ABI, provider);

        const balance = await composer.getDebtBalance(walletClient.getAddress(), token.address);

        return {
            token: token.symbol,
            balance: ethers.formatUnits(balance, token.decimals),
            balanceInBaseUnits: balance.toString(),
            chainId: this.chainId,
        };
    }

    /**
     * Get the health factor of a user
     */
    @Tool({
        name: "get_health_factor",
        description: "Get the health factor of a user",
        parameters: {
            schema: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    })
    async getHealthFactor(@WalletClient() walletClient: any, params: {}) {
        const provider = new ethers.JsonRpcProvider(walletClient.provider.url);
        const composer = new ethers.Contract(this.composerAddress, COMPOSER_ABI, provider);

        const healthFactor = await composer.getHealthFactor(walletClient.getAddress());

        return {
            healthFactor: ethers.formatUnits(healthFactor, 18),
            healthFactorInBaseUnits: healthFactor.toString(),
            chainId: this.chainId,
        };
    }

    /**
     * Open a margin position
     */
    @Tool({
        name: "open_margin_position",
        description: "Open a margin position with leverage",
        parameters: {
            schema: {
                type: "object",
                properties: {
                    collateralToken: {
                        type: "string",
                        description: "The token symbol to use as collateral",
                    },
                    debtToken: {
                        type: "string",
                        description: "The token symbol to borrow",
                    },
                    collateralAmount: {
                        type: "string",
                        description: "The amount of collateral to supply",
                    },
                    leverage: {
                        type: "number",
                        description: "The leverage factor (1-10)",
                    },
                },
                required: ["collateralToken", "debtToken", "collateralAmount", "leverage"],
            },
        },
    })
    async openMarginPosition(
        @WalletClient() walletClient: any,
        params: {
            collateralToken: string;
            debtToken: string;
            collateralAmount: string;
            leverage: number;
        },
    ) {
        const collateralToken = this.findTokenBySymbol(params.collateralToken);
        if (!collateralToken) {
            throw new Error(`Token ${params.collateralToken} not found`);
        }

        const debtToken = this.findTokenBySymbol(params.debtToken);
        if (!debtToken) {
            throw new Error(`Token ${params.debtToken} not found`);
        }

        // Validate parameters
        const validatedParams: OpenMarginPositionParams = {
            collateralToken,
            debtToken,
            collateralAmount: params.collateralAmount,
            leverage: params.leverage,
        };
        OpenMarginPositionParamsSchema.parse(validatedParams);

        // Convert amount to base units
        const collateralAmountInBaseUnits = ethers.parseUnits(params.collateralAmount, collateralToken.decimals);

        // Convert leverage to base units (18 decimals)
        const leverageInBaseUnits = ethers.parseUnits(params.leverage.toString(), 18);

        // Get signer
        const signer = walletClient.getSigner();
        const composer = new ethers.Contract(this.composerAddress, COMPOSER_ABI, signer);

        // Execute transaction
        const tx = await composer.openMarginPosition(
            collateralToken.address,
            debtToken.address,
            collateralAmountInBaseUnits,
            leverageInBaseUnits,
        );

        // Wait for transaction to be mined
        const receipt = await tx.wait();

        return {
            transactionHash: receipt.hash,
            collateralToken: collateralToken.symbol,
            debtToken: debtToken.symbol,
            collateralAmount: params.collateralAmount,
            leverage: params.leverage,
            chainId: this.chainId,
        };
    }

    /**
     * Close a margin position
     */
    @Tool({
        name: "close_margin_position",
        description: "Close a margin position",
        parameters: {
            schema: {
                type: "object",
                properties: {
                    collateralToken: {
                        type: "string",
                        description: "The token symbol used as collateral",
                    },
                    debtToken: {
                        type: "string",
                        description: "The token symbol borrowed",
                    },
                    repayAmount: {
                        type: "string",
                        description: "The amount of debt to repay (optional if closeAll is true)",
                    },
                    closeAll: {
                        type: "boolean",
                        description: "Whether to close the entire position",
                    },
                },
                required: ["collateralToken", "debtToken"],
            },
        },
    })
    async closeMarginPosition(
        @WalletClient() walletClient: any,
        params: {
            collateralToken: string;
            debtToken: string;
            repayAmount?: string;
            closeAll?: boolean;
        },
    ) {
        const collateralToken = this.findTokenBySymbol(params.collateralToken);
        if (!collateralToken) {
            throw new Error(`Token ${params.collateralToken} not found`);
        }

        const debtToken = this.findTokenBySymbol(params.debtToken);
        if (!debtToken) {
            throw new Error(`Token ${params.debtToken} not found`);
        }

        // Validate parameters
        const validatedParams: CloseMarginPositionParams = {
            collateralToken,
            debtToken,
            repayAmount: params.repayAmount,
            closeAll: params.closeAll ?? true,
        };
        CloseMarginPositionParamsSchema.parse(validatedParams);

        // Convert amount to base units if provided
        let repayAmountInBaseUnits = "0";
        if (params.repayAmount && !params.closeAll) {
            repayAmountInBaseUnits = ethers.parseUnits(params.repayAmount, debtToken.decimals).toString();
        }

        // Get signer
        const signer = walletClient.getSigner();
        const composer = new ethers.Contract(this.composerAddress, COMPOSER_ABI, signer);

        // Execute transaction
        const tx = await composer.closeMarginPosition(
            collateralToken.address,
            debtToken.address,
            repayAmountInBaseUnits,
            params.closeAll ?? true,
        );

        // Wait for transaction to be mined
        const receipt = await tx.wait();

        return {
            transactionHash: receipt.hash,
            collateralToken: collateralToken.symbol,
            debtToken: debtToken.symbol,
            repayAmount: params.repayAmount,
            closeAll: params.closeAll ?? true,
            chainId: this.chainId,
        };
    }

    /**
     * Swap collateral
     */
    @Tool({
        name: "swap_collateral",
        description: "Swap one collateral token for another",
        parameters: {
            schema: {
                type: "object",
                properties: {
                    fromToken: {
                        type: "string",
                        description: "The token symbol to swap from",
                    },
                    toToken: {
                        type: "string",
                        description: "The token symbol to swap to",
                    },
                    amount: {
                        type: "string",
                        description: "The amount to swap",
                    },
                },
                required: ["fromToken", "toToken", "amount"],
            },
        },
    })
    async swapCollateral(
        @WalletClient() walletClient: any,
        params: {
            fromToken: string;
            toToken: string;
            amount: string;
        },
    ) {
        const fromToken = this.findTokenBySymbol(params.fromToken);
        if (!fromToken) {
            throw new Error(`Token ${params.fromToken} not found`);
        }

        const toToken = this.findTokenBySymbol(params.toToken);
        if (!toToken) {
            throw new Error(`Token ${params.toToken} not found`);
        }

        // Validate parameters
        const validatedParams: SwapCollateralParams = {
            fromToken,
            toToken,
            amount: params.amount,
        };
        SwapCollateralParamsSchema.parse(validatedParams);

        // Convert amount to base units
        const amountInBaseUnits = ethers.parseUnits(params.amount, fromToken.decimals);

        // Get signer
        const signer = walletClient.getSigner();
        const composer = new ethers.Contract(this.composerAddress, COMPOSER_ABI, signer);

        // Execute transaction
        const tx = await composer.swapCollateral(fromToken.address, toToken.address, amountInBaseUnits);

        // Wait for transaction to be mined
        const receipt = await tx.wait();

        return {
            transactionHash: receipt.hash,
            fromToken: fromToken.symbol,
            toToken: toToken.symbol,
            amount: params.amount,
            chainId: this.chainId,
        };
    }

    /**
     * Swap debt
     */
    @Tool({
        name: "swap_debt",
        description: "Swap one debt token for another",
        parameters: {
            schema: {
                type: "object",
                properties: {
                    fromToken: {
                        type: "string",
                        description: "The token symbol to swap from",
                    },
                    toToken: {
                        type: "string",
                        description: "The token symbol to swap to",
                    },
                    amount: {
                        type: "string",
                        description: "The amount to swap",
                    },
                },
                required: ["fromToken", "toToken", "amount"],
            },
        },
    })
    async swapDebt(
        @WalletClient() walletClient: any,
        params: {
            fromToken: string;
            toToken: string;
            amount: string;
        },
    ) {
        const fromToken = this.findTokenBySymbol(params.fromToken);
        if (!fromToken) {
            throw new Error(`Token ${params.fromToken} not found`);
        }

        const toToken = this.findTokenBySymbol(params.toToken);
        if (!toToken) {
            throw new Error(`Token ${params.toToken} not found`);
        }

        // Validate parameters
        const validatedParams: SwapDebtParams = {
            fromToken,
            toToken,
            amount: params.amount,
        };
        SwapDebtParamsSchema.parse(validatedParams);

        // Convert amount to base units
        const amountInBaseUnits = ethers.parseUnits(params.amount, fromToken.decimals);

        // Get signer
        const signer = walletClient.getSigner();
        const composer = new ethers.Contract(this.composerAddress, COMPOSER_ABI, signer);

        // Execute transaction
        const tx = await composer.swapDebt(fromToken.address, toToken.address, amountInBaseUnits);

        // Wait for transaction to be mined
        const receipt = await tx.wait();

        return {
            transactionHash: receipt.hash,
            fromToken: fromToken.symbol,
            toToken: toToken.symbol,
            amount: params.amount,
            chainId: this.chainId,
        };
    }

    /**
     * Get supported tokens for the current chain
     */
    @Tool({
        name: "get_supported_tokens",
        description: "Get the list of supported tokens for the current chain",
        parameters: {
            schema: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    })
    async getSupportedTokens(@WalletClient() walletClient: any, params: {}) {
        return {
            tokens: this.tokens.map((token) => ({
                symbol: token.symbol,
                name: token.name,
                decimals: token.decimals,
            })),
            chainId: this.chainId,
        };
    }

    /**
     * Get the current chain information
     */
    @Tool({
        name: "get_chain_info",
        description: "Get information about the current chain",
        parameters: {
            schema: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    })
    async getChainInfo(@WalletClient() walletClient: any, params: {}) {
        return {
            chainId: this.chainId,
            composerAddress: this.composerAddress,
        };
    }

    // Helper method to find a token by symbol
    private findTokenBySymbol(symbol: string): Token | undefined {
        return this.tokens.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
    }
}
