module.exports = {
  'chain-name': 'telos',
  'chain-type': 'eos',
  'chain-id': '0x0',
  events: [
    {
      name: 'redeem',
      'account-names': ['btc.ptokens', 'ltc.ptokens'],
    },
    {
      name: 'pegin',
      'account-names': ['xbsc.ptokens'],
    },
  ],
  db: {
    url: '127.0.0.1',
  },
  'provider-url': 'provider-url',
}
