const { types } = require('hardhat/config')
const { getConfiguration } = require('../lib/configuration-manager')
const R = require('ramda')
const TASK_CONSTANTS = require('../constants')

const TASK_NAME = 'router:burn'
const TASK_DESC = 'Redeem pTokens.'

const getAssetFromPToken = (pTokenAddress, config, hre) => {
  const findPToken = R.find(R.propEq(pTokenAddress, TASK_CONSTANTS.KEY_ADDRESS))
  const pTokens = R.path([hre.network.name, TASK_CONSTANTS.KEY_PTOKEN_LIST], config.get())
  const ptoken = findPToken(pTokens)
  return [
    ptoken[TASK_CONSTANTS.KEY_PTOKEN_UNDERLYING_ASSET_ADDRESS],
    ptoken[TASK_CONSTANTS.KEY_PTOKEN_UNDERLYING_ASSET_NETWORKID],
  ]
}

const burn = async (taskArgs, hre) => {
  const config = await getConfiguration()
  const signer = await hre.ethers.getSigner()

  const [underlyingAssetAddress] = getAssetFromPToken(taskArgs.pTokenAddress, config, hre)

  const ERC20 = await hre.ethers.getContractFactory('ERC20')
  const asset = await ERC20.attach(underlyingAssetAddress)
  const underlyingAssetSymbol = await asset.symbol()

  const pTokenFactory = await hre.ethers.getContractFactory('PToken')
  const ptoken = await pTokenFactory.attach(taskArgs.pTokenAddress)
  const ptokenSymbol = await ptoken.symbol()

  console.info(
    `${taskArgs.amount} ptokens ${taskArgs.pTokenAddress} will be burned in order to reedem ${taskArgs.amount} ${underlyingAssetSymbol} (address: ${underlyingAssetAddress})`
  )
  console.info(`Account requesting the reedem: ${signer.address}`)
  const parsedAmount = hre.ethers.utils.parseUnits(taskArgs.amount, 18)
  await asset.approve(signer.address, parsedAmount)
  console.info(`Redeeming ${taskArgs.amount} ${ptokenSymbol} to address ${signer.address}`)
  const tx = await ptoken.burn(parsedAmount, {
    gasPrice: taskArgs[TASK_CONSTANTS.PARAM_NAME_GASPRICE],
    gasLimit: taskArgs[TASK_CONSTANTS.PARAM_NAME_GAS],
  })

  const receipt = await tx.wait(1)

  console.info(`Tx mined @ ${receipt.transactionHash}`)
}

task(TASK_NAME, TASK_DESC)
  .addPositionalParam(
    TASK_CONSTANTS.PARAM_NAME_PTOKEN_ADDRESS,
    TASK_CONSTANTS.PARAM_DESC_PTOKEN_ADDRESS,
    undefined,
    types.string
  )
  .addPositionalParam('amount', 'Amount of underlying asset to be used', undefined, types.string)
  .setAction(burn)

module.exports = {
  TASK_NAME,
}
