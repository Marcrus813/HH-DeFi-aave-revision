const { ethers } = require("hardhat");
const { parseAbi } = require("../utils/abiParser");

async function getContractFromLocalAbi(address, abiDir, account) {
    const abi = await parseAbi(abiDir);
    const contract = new ethers.Contract(address, abi, account);
    return contract;
}

module.exports = { getContractFromLocalAbi };
