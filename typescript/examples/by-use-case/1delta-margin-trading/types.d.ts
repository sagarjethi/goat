declare module 'ai' {
  export function generateText(options: {
    model: any;
    prompt?: string;
    system?: string;
    messages?: any[];
    tools?: any[];
    maxSteps?: number;
    onStepFinish?: (event: any) => void;
  }): Promise<{ text: string }>;
}

declare module '@goat-sdk/plugin-1delta' {
  export class OneDeltaTools {
    constructor(composerAddress: string, tokens: any);
    getCollateralBalance(walletClient: any, params: { token: string }): Promise<any>;
    getDebtBalance(walletClient: any, params: { token: string }): Promise<any>;
    getHealthFactor(walletClient: any, params: any): Promise<any>;
    getSupportedTokens(walletClient: any, params: any): Promise<any>;
    getChainInfo(walletClient: any, params: any): Promise<any>;
  }
  export const COMPOSER_ADDRESSES: Record<number, string>;
  export const TOKENS_BY_CHAIN: Record<number, any>;
}

declare module '@goat-sdk/wallet-viem' {
  export function viem(walletClient: any): any;
}

// Define ToolSet type to fix the linter error
declare module 'ai' {
  export interface ToolSet {
    [key: string]: any;
  }
} 