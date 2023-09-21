const { PNETWORK_NETWORK_IDS } = require('../constants')

module.exports = class Challenge {
  constructor({ actor, challenger, networkId = PNETWORK_NETWORK_IDS.hardhat, nonce, timestamp }) {
    this.nonce = nonce
    this.actor = actor
    this.challenger = challenger
    this.timestamp = timestamp
    this.networkId = networkId
  }

  static fromReceipt(_receipt) {
    const event = _receipt.events.find(({ event }) => event === 'ChallengePending')
    const { challenge } = event.decode(event.data, event.topics)
    return new Challenge({
      ...challenge,
    })
  }

  serialize() {
    return [this.nonce, this.actor, this.challenger, this.timestamp, this.networkId]
  }

  get() {
    return this.serialize()
  }

  get id() {
    const abiCoder = new ethers.utils.AbiCoder()
    return ethers.utils.sha256(
      abiCoder.encode(
        ['uint256', 'address', 'address', 'uint64', 'bytes4'],
        [this.nonce, this.actor, this.challenger, this.timestamp, this.networkId]
      )
    )
  }
}
