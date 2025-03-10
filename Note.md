# DeFi

## Related test net wallet priv key

- 520b37686d7e0f7f19223c805f96ce201b86192e91e9de57d567345e0b9efe0c

## Aave

- Liquidity
    - Supply, borrow, swap, stake
- Concepts
    - Health factor
        - How is it calculated?
- Process
    - Deposit collateral
    - Borrow asset
    - Repay
- Uniswap
    - Swap tokens we have for tokens we need
- wETH
    - When using aave, it requires ERC-20 token, while ETH is native blockchain token, we need to wrap it in order to interact with it

### Interaction with code

- Getting the contract
    - With ethers, we need abi, since we did not deploy wETH contract -> An interface contract will be sufficient
        - How about we just use src on ether scan and compile to get the ABI? Better yet how about we just copy the ABI from etherscan?
            - ~~Just copy the src of the contract and run `yarn hardhat compile`, pass in the contract file name we gave it then we are good~~
                - Some files may include imports, to successfully compile we also need the imported file, I think we should just copy the ABI from scanner
                    - **NOTE**
                        - Difference from web ethers: In web i used `fetch` which is a network based function, in Node environment, just use:
                            ```javascript
                            async function parseAbi(abiDir) {
                                const absolutePath = path.resolve(
                                    __dirname,
                                    abiDir,
                                );
                                const { abi } = require(absolutePath);
                                return abi;
                            }
                            ```
                        - `getAddress`
                            - There's a function `getAddress`, but it overlaps with `ethers: contract.getAddress`
- [Forking](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks)
    - `npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/<key>`
        - With forking, we can use mainnet token address, this is another way to do tests besides mocking on localhost, forking does not copy the entire chain, when we need to interact with a specific address / contract, it makes an API call to get the info
        - Pros / cons
            - Quick, easy, simulating the mainnet
            - Need API, some contracts are complicated to work with
- Interacting with aave
    - ABI, address
        - Lending pool
            - Aave contract for us to get target address
