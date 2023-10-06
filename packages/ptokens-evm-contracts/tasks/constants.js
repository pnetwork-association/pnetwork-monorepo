module.exports = {
  KEY_NETWORK_ID: 'networkId',
  KEY_UNDERLYING_ASSET_LIST: 'underlyingAssets',
  KEY_PTOKEN_LIST: 'pTokens',
  KEY_ASSET_NAME: 'name',
  KEY_ASSET_SYMBOL: 'symbol',
  KEY_ASSET_DECIMALS: 'decimals',
  KEY_ASSET_TOTAL_SUPPLY: 'totalSupply',
  KEY_ADDRESS: 'address',
  KEY_PTOKEN_UNDERLYING_ASSET_ADDRESS: 'underlyingAssetAddress',
  KEY_PTOKEN_UNDERLYING_ASSET_NETWORKID: 'underlyingAssetNetworkId',
  KEY_PNETWORKHUB: 'hub',
  KEY_PFACTORY: 'pFactory',
  KEY_EPOCHS_MANAGER: 'epochsManager',
  KEY_GOVERNANCE_MESSAGE_EMITTER: 'governanceMessageEmitter',
  KEY_GOVERNANCE_MESSAGE_VERIFIER: 'governanceMessageVerifier',
  KEY_PREGISTRY: 'pRegistry',
  KEY_SLASHER: 'slasher',
  KEY_CHALLENGE_PERIOD: 'challegePeriod',

  // Contract names
  CONTRACT_NAME_PFACTORY: 'PFactory',
  CONTRACT_NAME_PNETWORKHUB: 'PNetworkHub',
  CONTRACT_NAME_EPOCHS_MANAGER: 'EpochsManager',
  CONTRACT_NAME_REGISTRY: 'PRegistry',
  CONTRACT_NAME_SLASHER: 'Slasher',
  CONTRACT_NAME_GOVERNANCE_MESSAGE_EMITTER: 'GovernanceMessageEmitter',
  CONTRACT_NAME_GOVERNANCE_MESSAGE_VERIFIER: 'GovernanceMessageVerifier',

  // Params names and descriptions
  PARAM_NAME_DEST_CHAIN: 'destinationChainName',
  PARAM_DESC_DEST_CHAIN: 'Destination chain name (ex. mainnet, mumbai ...)',
  PARAM_NAME_DEST_ADDRESS: 'destinationAddress',
  PARAM_DESC_DEST_ADDRESS: 'Where the pToken is destined to',
  PARAM_NAME_PTOKEN_ADDRESS: 'pTokenAddress',
  PARAM_DESC_PTOKEN_ADDRESS: 'Address of the pTokens to be redeemed',
  PARAM_NAME_BASE_CHALLENGE_PERIOD: 'baseChallengePeriod',
  PARAM_DESC_BASE_CHALLENGE_PERIOD: 'Base challenge period duration for pNetwork Hub',
  PARAM_NAME_EPOCHS_MANAGER: 'epochsManager',
  PARAM_DESC_EPOCHS_MANAGER: 'Epochs Manager contract address',
  PARAM_NAME_FEES_MANAGER: 'feesManager',
  PARAM_DESC_FEES_MANAGER: 'Fees Manager contract address',
  PARAM_NAME_TELEPATHY_ROUTER: 'telepathyRouter',
  PARAM_DESC_TELEPATHY_ROUTER: 'Telepathy Router contract address',
  PARAM_NAME_GOVERNANCE_MESSAGE_EMITTER: 'governanceMessageEmitter',
  PARAM_DESC_GOVERNANCE_MESSAGE_EMITTER: 'Governance Message Emitter contract address',
  PARAM_NAME_GOVERNANCE_MESSAGE_VERIFIER: 'governanceMessageVerifier',
  PARAM_DESC_GOVERNANCE_MESSAGE_VERIFIER: 'Governance Message Verifier contract address',
  PARAM_NAME_PREGISTRY: 'pRegistry',
  PARAM_DESC_PREGISTRY: 'PRegistry contract address',
  PARAM_NAME_SLASHER: 'slasher',
  PARAM_DESC_SLASHER: 'Slasher contract address',
  PARAM_NAME_LOCKED_AMOUNT_CHALLENGE_PERIOD: 'lockedAmountChallengePeriod',
  PARAM_DESC_LOCKED_AMOUNT_CHALLENGE_PERIOD: 'Relayer locked amount during challenge period',
  PARAM_NAME_K_CHALLENGE_PERIOD: 'kChallengePeriod',
  PARAM_DESC_K_CHALLENGE_PERIOD: 'Challenge Period constant K',
  PARAM_NAME_MAX_OPERATIONS_IN_QUEUE: 'maxOperationsInQueue',
  PARAM_DESC_MAX_OPERATIONS_IN_QUEUE: 'Max operations in queue',
  PARAM_NAME_INTERIM_CHAIN_NETWORK_ID: 'interimChainNetworkId',
  PARAM_DESC_INTERIM_CHAIN_NETWORK_ID: 'Interim Chain network ID',
  PARAM_NAME_LOCKED_AMOUNT_OPEN_CHALLENGE: 'lockedAmountOpenChallege',
  PARAM_DESC_LOCKED_AMOUNT_OPEN_CHALLENGE: 'Challenger locked amount for opening a challenge',
  PARAM_NAME_MAX_CHALLENGE_DURATIONO: 'maxChallengeDuration',
  PARAM_DESC_MAX_CHALLENGE_DURATION: 'Challenge maximum duration',
  PARAM_NAME_DANDELION_VOTING_ADDRESS: 'dandelionVotingAddress',
  PARAM_DESC_DANDELION_VOTING_ADDRESS: 'Dandelion Voting contract address',
  PARAM_NAME_REGISTRATION_MANAGER_ADDRESS: 'registrationManagerAddress',
  PARAM_DESC_REGISTRATION_MANAGER_ADDRESS: 'Registration Manager contract address',
  PARAM_NAME_AMOUNT_TO_SLASH: 'amountToSlash',
  PARAM_DESC_AMOUNT_TO_SLASH: 'Staking sentinel amount to slash',
  PARAM_NAME_LENDING_MANAGER: 'lendingManagerAddress',
  PARAM_DESC_LENDING_MANAGER: 'Lending Manager contract address',
  PARAM_NAME_GAS: 'gas',
  PARAM_DESC_GAS: 'Optional gas limit setting',
  PARAM_NAME_GASPRICE: 'gasPrice',
  PARAM_DESC_GASPRICE: 'Optional gas price setting',
  PARAM_NAME_UNDERLYING_ASSET_ADDRESS: 'underlyingAssetAddress',
  PARAM_DESC_UNDERLYING_ASSET_ADDRESS: 'Underlying asset address we want to wrap',
  PARAM_NAME_UNDERLYING_ASSET_CHAIN_NAME: 'assetChainName',
  PARAM_DESC_UNDERLYING_ASSET_CHAIN_NAME:
    'Underlying Asset chain name (defaults to the selected network)',
  PARAM_NAME_U_ASSET_ADDRESS: 'underlyingAssetTokenAddress',
  PARAM_DESC_U_ASSET_ADDRESS: 'The underlying asset address of the pToken we want to move',
  PARAM_NAME_ASSET_ADDRESS: 'assetTokenAddress',
  PARAM_DESC_ASSET_ADDRESS:
    'It may coincide with the underlying asset when pegging in and with the pToken asset when pegging out',
  PARAM_NAME_AMOUNT: 'amount',
  PARAM_DESC_AMOUNT: 'Amount of underlying asset to be used',
  PARAM_NAME_TX_HASH: 'txHash',
  PARAM_DESC_TX_HASH: 'Transaction Hash',
  PARAM_NAME_EXPECTED_SOURCE_CHAIN_ID: 'expectedSourceChainId',
  PARAM_DESC_EXPECTED_SOURCE_CHAIN_ID:
    'Expected source chain ID for Governance Message Verifier Telepathy messages',
  OPT_NAME_APPROVE: 'approve',
  OPT_DESC_APPROVE: 'Approve the amount before transfering...',
}
