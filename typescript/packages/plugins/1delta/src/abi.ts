// ABI for the 1delta Composer contract
export const COMPOSER_ABI = [
    // View functions
    {
        inputs: [
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "getCollateralBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "getDebtBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
        ],
        name: "getHealthFactor",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    // Transaction functions
    {
        inputs: [
            {
                internalType: "address",
                name: "collateralToken",
                type: "address",
            },
            {
                internalType: "address",
                name: "debtToken",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "collateralAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "leverage",
                type: "uint256",
            },
        ],
        name: "openMarginPosition",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "collateralToken",
                type: "address",
            },
            {
                internalType: "address",
                name: "debtToken",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "repayAmount",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "closeAll",
                type: "bool",
            },
        ],
        name: "closeMarginPosition",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "fromToken",
                type: "address",
            },
            {
                internalType: "address",
                name: "toToken",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "swapCollateral",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "fromToken",
                type: "address",
            },
            {
                internalType: "address",
                name: "toToken",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "swapDebt",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
