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
                    - Another way to resolve this: `yarn add --dev @aave/core-v3`, and copy out interfaces inside
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
                                - There are other ways to call contract: `contract.callStatic`, `contract["functionName"]()`
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
    - Actual interactions

        - **NOTE**

            - Proxy
                - [Guide](https://medium.com/@social_42205/proxy-contracts-in-solidity-f6f5ffe999bd)
                    - Definition
                        > The proxy contract acts as an intermediary that delegates calls to an implementation contract where the actual logic resides.
                        > This way the proxy contract stays immutable, but you can deploy a new contract behind the proxy contract — simply change the target address inside the proxy contract.
                        > _Key Feature_: Preserves the state, allowing for upgrades without data loss.
                    - Need to identify a proxy contract, in this case, it does not contain the function we are looking for, hence probably a proxy contract, more examples to be found
                    - Interaction
                        - Ethers.js -> Use proxy's address(since this is the point of proxies, upgrading the logic contract will not affect this address) -> Use the logic contract's ABI

        - Supply(`deposit` is deprecated)

            - `Pool` has an action:

                ```solidity
                SupplyLogic.executeSupply(
                    _reserves,
                    _reservesList,
                    _usersConfig[onBehalfOf],
                    DataTypes.ExecuteSupplyParams({
                        asset: asset,
                        amount: amount,
                        onBehalfOf: onBehalfOf,
                        referralCode: referralCode
                    })
                );

                function executeSupply(
                    mapping(address => DataTypes.ReserveData) storage reservesData,
                    mapping(uint256 => address) storage reservesList,
                    DataTypes.UserConfigurationMap storage userConfig,
                    DataTypes.ExecuteSupplyParams memory params
                ) external {
                    DataTypes.ReserveData storage reserve = reservesData[params.asset];
                    DataTypes.ReserveCache memory reserveCache = reserve.cache();

                    reserve.updateState(reserveCache);

                    ValidationLogic.validateSupply(reserveCache, reserve, params.amount);

                    reserve.updateInterestRates(reserveCache, params.asset, params.amount, 0);

                    IERC20(params.asset).safeTransferFrom(msg.sender, reserveCache.aTokenAddress, params.amount); // Using ERC-20 transfer from

                    bool isFirstSupply = IAToken(reserveCache.aTokenAddress).mint(
                    msg.sender,
                    params.onBehalfOf,
                    params.amount,
                    reserveCache.nextLiquidityIndex
                    );

                    if (isFirstSupply) {
                    if (
                        ValidationLogic.validateAutomaticUseAsCollateral(
                        reservesData,
                        reservesList,
                        userConfig,
                        reserveCache.reserveConfiguration,
                        reserveCache.aTokenAddress
                        )
                    ) {
                        userConfig.setUsingAsCollateral(reserve.id, true);
                        emit ReserveUsedAsCollateralEnabled(params.asset, params.onBehalfOf);
                    }
                    }

                    emit Supply(params.asset, msg.sender, params.onBehalfOf, params.amount, params.referralCode);
                }
                ```

                So we need to approve in allowance first

                - Referral code?
                    - Referral supply is currently inactive, you can pass 0 as referralCode. This program may be activated in the future through an Aave governance proposal.

        - Borrow

            - Basic info: our debt, how much we can borrow
                - `pool: getUserAccountData`
                    - Total collateral, total debt, available borrow, current liquidation threshold, ltv(loan to value)?, health factor
                    - [Liquidations](https://aave.com/docs/concepts/liquidations)
                    - The value is not ETH or wei, it is "The total collateral of the user in the base currency used by the price feed" according to doc, which is USD
                        - Currently working with DAI, we can just use the amount in ETH, since 1 DAI = 1 USD, but for learning purpose I am doing transformation

        - Repay
            - Need to allow pool contract to spend our DAI balance so it could take back
            - Even with repaying all, we still have DAI left
                - After borrowing, we accrued interest, to repay this part we need to use uniswap then repay, also can be done through code
### Visualization
- aToken
    - Supply -> Get back `aToken` / `interest bearing token`, these keep track of how much collateral we supplied to aave, to withdraw back, need to burn `aToken`s
### Practice
- [SpeedRunETH](https://speedrunethereum.com)