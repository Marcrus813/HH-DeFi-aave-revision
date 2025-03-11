const { ethers } = require("hardhat");
const { parseAbi } = require("../utils/abiParser");
const { paramConfig } = require("../configs/params-config");
const ABI_HOME = "../abis/";
const SUPPLY_AMOUNT = ethers.parseEther("10");

let localFlag = false;
const network = process.env.NETWORK || "hardhat";
if (network === "hardhat" || network === "localhost") {
    localFlag = true;
}

async function swapWeth() {
    const availableAccounts = await ethers.getSigners();
    const [deployer] = availableAccounts;
    const wethAddress = localFlag
        ? paramConfig.wEthParam.mainnet.wEthAddress
        : paramConfig.wEthParam.sepolia.wEthAddress; // When we run local hardhat, we are forking
    const wethAbi = await parseAbi(ABI_HOME + "WETH.json");
    const weth = new ethers.Contract(wethAddress, wethAbi, deployer);
    const depositTxn = await weth.deposit({ value: SUPPLY_AMOUNT });
    await depositTxn.wait(1);
    const wethBalance = await weth.balanceOf(deployer.address);
    console.log(`WETH balance: ${ethers.formatEther(wethBalance)}`);
}

module.exports = { swapWeth, SUPPLY_AMOUNT };
