const paramConfig = {
    wEthParam: {
        mainnet: {
            wEthAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        },
        sepolia: {
            wEthAddress: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
        },
    },
    aave: {
        mainnet: {
            lendingPoolProviderAddress:
                "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
            daiEthPriceFeedAddress:
                "0x773616E4d11A78F511299002da57A0a94577F1f4",
            ethUsdPriceFeedAddress:
                "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
            daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        },
    },
};

module.exports = { paramConfig };
