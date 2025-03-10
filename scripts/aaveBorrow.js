const { getWeth } = require("./getWeth");
const { paramConfig } = require("../configs/params-config");
const { parseAbi } = require("../utils/abiParser");
const { ethers } = require("hardhat");
const ABI_HOME = "../abis/";

async function aaveBorrow() {
    await getWeth();
    const availableAccounts = await ethers.getSigners();
    const [deployer] = availableAccounts;
    const poolAddressesProvider = await getContract(
        ABI_HOME + "PoolAddressesProvider.json",
        paramConfig.aave.mainnet.lendingPoolProviderAddress,
        deployer,
    );
    const poolAddress = await poolAddressesProvider.getPool();
    const pool = await getContract(
        ABI_HOME + "Pool.json",
        poolAddress,
        deployer,
    );
}

async function getContract(abiDir, address, account) {
    const abi = await parseAbi(abiDir);
    const contract = new ethers.Contract(address, abi, account);
    return contract;
}

async function main() {
    await aaveBorrow();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

module.exports = { aaveBorrow };
