const { STATE_KEY_EVENTS } = require('../state/constants')
const { logger } = require('../get-logger')
const constants = require('ptokens-constants')
const schemas = require('ptokens-schemas')
const {
  getEthersProvider,
  getInterfaceFromEvent,
  getFilter,
  processEventLog,
} = require('./evm-utils')

const listenFromFilter = (
  _providerUrl,
  _chainId,
  _filter,
  _interface,
  _callback
) =>
  logger.info(
    `Listening for event from ${_filter.address} with topics [${_filter.topics}]`
  ) ||
  getEthersProvider(_providerUrl).then(_provider =>
    _provider.on(_filter, processEventLog(_chainId, _interface, _callback))
  )

const listenForEvmEvent = (
  _providerUrl,
  _chainId,
  _eventName,
  _contractAddress,
  _callback
) =>
  Promise.all([
    getFilter(_eventName, _contractAddress),
    getInterfaceFromEvent(_eventName),
  ]).then(
    ([_filter, _interface]) =>
      logger.info(`Listening to ${_eventName} @ ${_contractAddress}`) ||
      listenFromFilter(_providerUrl, _chainId, _filter, _interface, _callback)
  )

const startEvmListenerFromEventObject = (
  _providerUrl,
  _chainId,
  _event,
  _callback
) =>
  Promise.all(
    _event[schemas.constants.SCHEMA_TOKEN_CONTRACTS_KEY].map(_tokenContract =>
      listenForEvmEvent(
        _providerUrl,
        _chainId,
        _event.name,
        _tokenContract,
        _callback
      )
    )
  )

// this function will return a never-resolving Promise
// which will permit the EVM provider to listen indefinitely
const keepListening = () => new Promise(_ => {})

const listenForEvmEvents = (_state, _callback) =>
  Promise.all(
    _state[STATE_KEY_EVENTS].map(_event =>
      startEvmListenerFromEventObject(
        _state[constants.state.STATE_KEY_PROVIDER_URL],
        _state[constants.state.STATE_KEY_CHAIN_ID],
        _event,
        _callback
      )
    )
  ).then(keepListening)

module.exports = {
  listenForEvmEvents,
}
