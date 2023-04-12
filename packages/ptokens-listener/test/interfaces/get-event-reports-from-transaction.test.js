describe('Tests for the getEventReportsFromTransaction interface', () => {
  describe('getEventReportsFromTransaction', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.resetModules()
    })

    test.each([['0x005fe7f9'], ['0x00e4b170'], ['0x00f1918e'], ['0xf9b459a1']])(
      'Should get event reports from EVM events for chain id %p',
      async _chainId => {
        const evmListener = require('../../lib/evm/listener-evm')

        const listenForEvmEventsSpy = jest
          .spyOn(evmListener, 'getEvmEventReportsFromTransaction')
          .mockResolvedValue()

        const getEventReportsFromTransactionInterface = require('../../lib/interfaces/get-event-reports-from-transaction')

        await getEventReportsFromTransactionInterface.getEventReportsFromTransaction(
          'provider-url',
          _chainId,
          'tx-hash',
          'event'
        )

        expect(listenForEvmEventsSpy).toHaveBeenCalledTimes(1)
        expect(listenForEvmEventsSpy).toHaveBeenNthCalledWith(
          1,
          'provider-url',
          _chainId,
          'tx-hash',
          'event'
        )
      }
    )

    test.each([['0x03c38e67']])(
      'Should reject for the not-supported Algorand chain ID %p',
      async _chainId => {
        const {
          getEventReportsFromTransaction,
        } = require('../../lib/interfaces/get-event-reports-from-transaction')
        expect(() =>
          getEventReportsFromTransaction(
            'provider-url',
            _chainId,
            'tx-hash',
            'event'
          )
        ).rejects.toThrow('To be implemented!')
      }
    )

    test.each([['0x02e7261c']])(
      'Should reject for the not-supported EOSIO chain ID %p',
      async _chainId => {
        const {
          getEventReportsFromTransaction,
        } = require('../../lib/interfaces/get-event-reports-from-transaction')
        expect(() =>
          getEventReportsFromTransaction(
            'provider-url',
            _chainId,
            'tx-hash',
            'event'
          )
        ).rejects.toThrow('To be implemented!')
      }
    )

    test.each([['0x01ec97de']])(
      'Should reject for the not-supported UTXO chain ID %p',
      async _chainId => {
        const {
          getEventReportsFromTransaction,
        } = require('../../lib/interfaces/get-event-reports-from-transaction')
        expect(() =>
          getEventReportsFromTransaction(
            'provider-url',
            _chainId,
            'tx-hash',
            'event'
          )
        ).rejects.toThrow('To be implemented!')
      }
    )

    test.each([['0x12345678']])(
      'Should reject when using an unsupported chain ID',
      async _chainId => {
        const {
          getEventReportsFromTransaction,
        } = require('../../lib/interfaces/get-event-reports-from-transaction')
        expect(() =>
          getEventReportsFromTransaction(
            'provider-url',
            _chainId,
            'tx-hash',
            'event'
          )
        ).rejects.toThrow('Unknown chain ID 0x12345678')
      }
    )
  })
})
