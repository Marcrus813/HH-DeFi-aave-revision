const path = require("path");

async function parseAbi(abiDir) {
    const absolutePath = path.resolve(__dirname, abiDir);
    const { abi } = require(absolutePath);
    return abi;
}

module.exports = { parseAbi };
