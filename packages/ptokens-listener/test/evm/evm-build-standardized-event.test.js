const { logs } = require('../mock/evm-logs')
const { getInterfaceFromEvent } = require('../../lib/evm/listener-evm')
const schemas = require('ptokens-schemas')

describe('Event building for EVM', () => {
  describe('buildStandardizedEventFromEvmEvent', () => {
    beforeAll(() => {
      jest
        .useFakeTimers({ legacyFakeTimers: false })
        .setSystemTime(new Date('2023-03-14 16:00:00'))
    })

    it('Should build a standardized event object for a Redeem event', async () => {
      const {
        buildStandardizedEvmEventObjectFromLog,
      } = require('../../lib/evm/evm-build-standardized-event')
      const chainId = '0x005fe7f9'
      const eventName =
        'Redeem(address indexed redeemer, uint256 value, string underlyingAssetRecipient, bytes userData, bytes4 originChainId, bytes4 destinationChainId)'
      const eventLog = logs[2]
      const methodInterface = await getInterfaceFromEvent(eventName)
      const result = await buildStandardizedEvmEventObjectFromLog(
        chainId,
        methodInterface,
        eventLog
      )

      expect(result).toStrictEqual({
        [schemas.constants.SCHEMA_AMOUNT_KEY]: '2065832100000000000',
        [schemas.constants.SCHEMA_DESTINATION_ADDRESS_KEY]:
          '35eXzETyUxiQPXwU2udtVFQFrFjgRhhvPj',
        [schemas.constants.SCHEMA_DESTINATION_CHAIN_ID_KEY]: '0x01ec97de',
        [schemas.constants.SCHEMA_EVENT_NAME_KEY]:
          schemas.db.enums.eventNames.REDEEM,
        [schemas.constants.SCHEMA_FINAL_TX_HASH_KEY]: null,
        [schemas.constants.SCHEMA_FINAL_TX_TS_KEY]: null,
        [schemas.constants.SCHEMA_ORIGINATING_ADDRESS_KEY]: null,
        [schemas.constants.SCHEMA_ORIGINATING_CHAIN_ID_KEY]: '0x005fe7f9',
        [schemas.constants.SCHEMA_ORIGINATING_TX_HASH_KEY]:
          '0x9488dee8cb5c6b2f6299e45e48bba580f46dbd496cfaa70a182060fd5dc81cb4',
        [schemas.constants.SCHEMA_PROPOSAL_TX_HASH_KEY]: null,
        [schemas.constants.SCHEMA_PROPOSAL_TS_KEY]: null,
        [schemas.constants.SCHEMA_STATUS_KEY]:
          schemas.db.enums.txStatus.DETECTED,
        [schemas.constants.SCHEMA_TOKEN_ADDRESS_KEY]: null,
        [schemas.constants.SCHEMA_USER_DATA_KEY]: null,
        [schemas.constants.SCHEMA_WITNESSED_TS_KEY]: '2023-03-14T16:00:00.000Z',
        _id: '0x005fe7f9_0x9488dee8cb5c6b2f6299e45e48bba580f46dbd496cfaa70a182060fd5dc81cb4',
      })
    })

    it('Should build a standardized event object for a PegIn event', async () => {
      const {
        buildStandardizedEvmEventObjectFromLog,
      } = require('../../lib/evm/evm-build-standardized-event')
      const chainId = '0x005fe7f9'
      const eventName =
        'PegIn(address _tokenAddress, address _tokenSender, uint256 _tokenAmount, string _destinationAddress, bytes _userData, bytes4 _originChainId, bytes4 _destinationChainId)'
      const eventLog = logs[1]
      const methodInterface = await getInterfaceFromEvent(eventName)
      const result = await buildStandardizedEvmEventObjectFromLog(
        chainId,
        methodInterface,
        eventLog
      )
      expect(result).toStrictEqual({
        [schemas.constants.SCHEMA_AMOUNT_KEY]: '1001000000',
        [schemas.constants.SCHEMA_DESTINATION_ADDRESS_KEY]: '770102986',
        [schemas.constants.SCHEMA_DESTINATION_CHAIN_ID_KEY]: '0x03c38e67',
        [schemas.constants.SCHEMA_EVENT_NAME_KEY]:
          schemas.db.enums.eventNames.PEGIN,
        [schemas.constants.SCHEMA_FINAL_TX_HASH_KEY]: null,
        [schemas.constants.SCHEMA_FINAL_TX_TS_KEY]: null,
        [schemas.constants.SCHEMA_ORIGINATING_ADDRESS_KEY]: null,
        [schemas.constants.SCHEMA_ORIGINATING_CHAIN_ID_KEY]: '0x005fe7f9',
        [schemas.constants.SCHEMA_ORIGINATING_TX_HASH_KEY]:
          '0x0f53438f23bd61bcee616d4f4d0f70a80dcd1d10dc8b0796774cb4afa6340305',
        [schemas.constants.SCHEMA_PROPOSAL_TX_HASH_KEY]: null,
        [schemas.constants.SCHEMA_PROPOSAL_TS_KEY]: null,
        [schemas.constants.SCHEMA_STATUS_KEY]:
          schemas.db.enums.txStatus.DETECTED,
        [schemas.constants.SCHEMA_TOKEN_ADDRESS_KEY]:
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        [schemas.constants.SCHEMA_USER_DATA_KEY]: null,
        [schemas.constants.SCHEMA_WITNESSED_TS_KEY]: '2023-03-14T16:00:00.000Z',
        _id: '0x005fe7f9_0x0f53438f23bd61bcee616d4f4d0f70a80dcd1d10dc8b0796774cb4afa6340305',
      })
    })
  })
})
