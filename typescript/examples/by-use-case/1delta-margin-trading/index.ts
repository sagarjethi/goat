/**
 * 1delta Margin Trading Example
 * 
 * This example demonstrates how to use the 1delta plugin with the GOAT SDK
 * to interact with 1delta's margin trading protocol across multiple EVM chains.
 * It provides both a CLI interface and an AI-powered assistant for interacting
 * with the protocol.
 * 
 * Architecture:
 * - GOAT SDK Core: Provides the framework for wallet and plugin interactions
 * - 1delta Plugin: Implements tools for interacting with the 1delta protocol
 * - Wallet Client: Handles blockchain interactions using viem
 * - AI Integration: Provides natural language interface using Vercel AI SDK
 * 
 * Supported chains:
 * - Arbitrum (default)
 * - Ethereum
 * - Optimism
 * - Base
 * - Polygon
 * - BNB Chain
 */

import * as readline from "node:readline";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, mainnet, optimism, base, polygon, bsc } from "viem/chains";
import { z } from "zod";

import { OneDeltaTools } from "@goat-sdk/plugin-1delta";
import { viem } from "@goat-sdk/wallet-viem";
import { COMPOSER_ADDRESSES, TOKENS_BY_CHAIN } from "@goat-sdk/plugin-1delta";

// Load environment variables from .env file
require("dotenv").config();

/**
 * Chain Selection
 * 
 * The application supports multiple EVM chains. The chain can be specified
 * as a command-line argument, or it defaults to Arbitrum.
 * 
 * Example: pnpm start optimism
 */
const chainArg = process.argv[2]?.toLowerCase() || "arbitrum";

// Map chain name to chain object and chain ID
const chainMap: Record<string, { chain: any; chainId: number }> = {
  arbitrum: { chain: arbitrum, chainId: 42161 },
  ethereum: { chain: mainnet, chainId: 1 },
  optimism: { chain: optimism, chainId: 10 },
  base: { chain: base, chainId: 8453 },
  polygon: { chain: polygon, chainId: 137 },
  bnb: { chain: bsc, chainId: 56 },
};

// Get the chain configuration
const chainConfig = chainMap[chainArg as keyof typeof chainMap];
if (!chainConfig) {
  console.error(`Unsupported chain: ${chainArg}`);
  console.error("Supported chains: arbitrum, ethereum, optimism, base, polygon, bnb");
  process.exit(1);
}

/**
 * RPC URL Configuration
 * 
 * Each chain requires an RPC URL to connect to the blockchain.
 * These URLs are stored in environment variables with the format:
 * <CHAIN_NAME>_RPC_URL (e.g., ARBITRUM_RPC_URL)
 */
const getRpcUrl = (chainName: string): string => {
  const envVar = `${chainName.toUpperCase()}_RPC_URL`;
  const url = process.env[envVar];
  if (!url) {
    console.error(`Missing environment variable: ${envVar}`);
    process.exit(1);
  }
  return url;
};

/**
 * Wallet Client Setup
 * 
 * Create a wallet client for the selected chain using viem.
 * The wallet client is used to interact with the blockchain.
 */
const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
const viemWalletClient = createWalletClient({
  account: account,
  transport: http(getRpcUrl(chainArg)),
  chain: chainConfig.chain,
});

// Create the EVM wallet client using GOAT SDK's viem adapter
const walletClient = viem(viemWalletClient);

/**
 * 1delta Tools Setup
 * 
 * Initialize the 1delta tools with the composer address and token list
 * for the selected chain. If the chain is not supported, fall back to
 * Arbitrum's configuration.
 */
const composerAddress = COMPOSER_ADDRESSES[chainConfig.chainId] || COMPOSER_ADDRESSES[42161]; // Default to Arbitrum
const tokens = TOKENS_BY_CHAIN[chainConfig.chainId] || TOKENS_BY_CHAIN[42161]; // Default to Arbitrum
const oneDeltaTools = new OneDeltaTools(composerAddress, tokens);

/**
 * AI Tools Definition
 * 
 * Define the tools that the AI assistant can use to interact with the
 * 1delta protocol. Each tool has a name, description, parameters schema,
 * and an execute function.
 * 
 * The parameters are defined using Zod schemas, which provide type safety
 * and validation for the tool inputs.
 */
const aiTools = [
  {
    name: "get_collateral_balance",
    description: "Get the collateral balance of a token for a user",
    parameters: z.object({
      token: z.string().describe("The token symbol to check the collateral balance for")
    }),
    execute: async (params: { token: string }) => {
      try {
        return await oneDeltaTools.getCollateralBalance(walletClient, params);
      } catch (error) {
        console.error("Error in get_collateral_balance:", error);
        return { error: "Failed to get collateral balance", details: String(error) };
      }
    }
  },
  {
    name: "get_debt_balance",
    description: "Get the debt balance of a token for a user",
    parameters: z.object({
      token: z.string().describe("The token symbol to check the debt balance for")
    }),
    execute: async (params: { token: string }) => {
      try {
        return await oneDeltaTools.getDebtBalance(walletClient, params);
      } catch (error) {
        console.error("Error in get_debt_balance:", error);
        return { error: "Failed to get debt balance", details: String(error) };
      }
    }
  },
  {
    name: "get_health_factor",
    description: "Get the health factor of a user",
    parameters: z.object({}),
    execute: async () => {
      try {
        return await oneDeltaTools.getHealthFactor(walletClient, {});
      } catch (error) {
        console.error("Error in get_health_factor:", error);
        return { error: "Failed to get health factor", details: String(error) };
      }
    }
  },
  {
    name: "get_supported_tokens",
    description: "Get the list of supported tokens",
    parameters: z.object({}),
    execute: async () => {
      try {
        return await oneDeltaTools.getSupportedTokens(walletClient, {});
      } catch (error) {
        console.error("Error in get_supported_tokens:", error);
        return { error: "Failed to get supported tokens", details: String(error) };
      }
    }
  },
  {
    name: "get_chain_info",
    description: "Get information about the current chain",
    parameters: z.object({}),
    execute: async () => {
      try {
        return await oneDeltaTools.getChainInfo(walletClient, {});
      } catch (error) {
        console.error("Error in get_chain_info:", error);
        return { error: "Failed to get chain info", details: String(error) };
      }
    }
  }
];

/**
 * CLI Mode
 * 
 * This function implements a command-line interface for interacting with
 * the 1delta protocol. It provides commands for checking balances, health
 * factor, and supported tokens.
 * 
 * Available commands:
 * - get-tokens: Get the list of supported tokens
 * - get-chain: Get information about the current chain
 * - get-collateral <token>: Get the collateral balance for a token
 * - get-debt <token>: Get the debt balance for a token
 * - get-health: Get the health factor
 * - ai: Switch to AI assistant mode
 * - exit: Exit the program
 */
async function runCliMode() {
  console.log(`1delta Margin Trading Example (${chainArg.toUpperCase()})`);
  console.log("-----------------------------");
  console.log("Available commands:");
  console.log("1. get-tokens - Get supported tokens");
  console.log("2. get-chain - Get chain information");
  console.log("3. get-collateral <token> - Get collateral balance for a token");
  console.log("4. get-debt <token> - Get debt balance for a token");
  console.log("5. get-health - Get health factor");
  console.log("6. ai - Switch to AI assistant mode");
  console.log("7. exit - Exit the program");
  console.log("-----------------------------");

  // Create readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Command processing loop
  while (true) {
    const input = await new Promise<string>((resolve) => {
      rl.question('Enter command: ', resolve);
    });

    const args = input.split(' ');
    const command = args[0].toLowerCase();

    // Handle exit command
    if (command === "exit") {
      rl.close();
      break;
    }

    // Handle switching to AI mode
    if (command === "ai") {
      rl.close();
      await runAiMode();
      break;
    }

    // Process commands
    try {
      switch (command) {
        case "get-tokens":
          const tokens = await oneDeltaTools.getSupportedTokens(walletClient, {});
          console.log("Supported tokens:", tokens);
          break;
        
        case "get-chain":
          const chainInfo = await oneDeltaTools.getChainInfo(walletClient, {});
          console.log("Chain info:", chainInfo);
          break;
        
        case "get-collateral":
          if (!args[1]) {
            console.error("Token symbol is required");
            break;
          }
          const collateralBalance = await oneDeltaTools.getCollateralBalance(walletClient, { token: args[1] });
          console.log("Collateral balance:", collateralBalance);
          break;
        
        case "get-debt":
          if (!args[1]) {
            console.error("Token symbol is required");
            break;
          }
          const debtBalance = await oneDeltaTools.getDebtBalance(walletClient, { token: args[1] });
          console.log("Debt balance:", debtBalance);
          break;
        
        case "get-health":
          const healthFactor = await oneDeltaTools.getHealthFactor(walletClient, {});
          console.log("Health factor:", healthFactor);
          break;
        
        default:
          console.log("Unknown command. Type 'exit' to quit.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
    console.log("-----------------------------");
  }
}

/**
 * AI Assistant Mode
 * 
 * This function implements an AI-powered assistant for interacting with
 * the 1delta protocol. It uses the Vercel AI SDK to process natural language
 * queries and execute the appropriate tools.
 * 
 * The AI can answer questions about:
 * - Collateral and debt balances
 * - Health factor
 * - Supported tokens
 * - Chain information
 */
async function runAiMode() {
  console.log(`1delta Margin Trading AI Assistant (${chainArg.toUpperCase()})`);
  console.log("-----------------------------");
  console.log("You can ask the AI about:");
  console.log("- Your collateral and debt balances");
  console.log("- Your health factor");
  console.log("- Supported tokens");
  console.log("- Chain information");
  console.log("Type 'cli' to switch back to command mode");
  console.log("Type 'exit' to quit");
  console.log("-----------------------------");

  // Create readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // AI interaction loop
  while (true) {
    const prompt = await new Promise<string>((resolve) => {
      rl.question('Ask the AI: ', resolve);
    });

    // Handle exit command
    if (prompt.toLowerCase() === "exit") {
      rl.close();
      break;
    }

    // Handle switching to CLI mode
    if (prompt.toLowerCase() === "cli") {
      rl.close();
      await runCliMode();
      break;
    }

    console.log("\nProcessing your request...");
    
    try {
      // Generate text using the AI model
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
        tools: aiTools,
        maxSteps: 5, // Maximum number of tool invocations per request
        onStepFinish: (event: any) => {
          // Log tool usage for transparency
          if (event.type === 'tool') {
            console.log(`Using tool: ${event.tool.name}`);
            console.log(`Result: ${JSON.stringify(event.toolResults, null, 2)}`);
          }
        },
      });

      // Display the AI response
      console.log("\n-----------------------------");
      console.log("AI RESPONSE:");
      console.log("-----------------------------");
      console.log(result.text);
    } catch (error) {
      console.error("Error:", error);
    }
    
    console.log("-----------------------------");
  }
}

/**
 * Application Entry Point
 * 
 * This is the main entry point for the application. It asks the user
 * which mode they want to use (CLI or AI assistant) and then starts
 * the appropriate mode.
 */
(async () => {
  console.log(`Using chain: ${chainArg.toUpperCase()}`);
  
  // Ask the user which mode they want to use
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const mode = await new Promise<string>((resolve) => {
    rl.question('Choose mode (1 for CLI, 2 for AI assistant): ', resolve);
  });
  
  rl.close();

  // Start the selected mode
  if (mode === "2") {
    await runAiMode();
  } else {
    await runCliMode();
  }
})();