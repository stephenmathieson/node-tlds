const got = require('got');
const _ = require('lodash');
const fs = require('fs-extra');
const isPunycode = require('is-punycode');
const { decode: decodePunycode } = require('punycode');

(async () => {
  const res = await got('http://data.iana.org/TLD/tlds-alpha-by-domain.txt').text()
  const data = _
    .chain(res)
    .split("\n")
    .tail()
    .map(value => isPunycode(value) ? decodePunycode(value) : value)
    .map(_.toLower)
    .value()
  await fs.writeJSON('index.json', data, { spaces: 2 })
  console.log(`Saved ${data.length} TLDs!`)
})();