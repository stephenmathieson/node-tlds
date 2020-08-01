const {decode: decodePunycode} = require('punycode/');
const writeJsonFile = require('write-json-file');
const got = require('got');
const isPunycode = require('is-punycode');

const update = async () => {
	const {body} = await got('http://data.iana.org/TLD/tlds-alpha-by-domain.txt');

	const data = body
		.split('\n')
		.slice(1, -1)
		.map(item => isPunycode(item) ? decodePunycode(item.slice(4)) : item)
		.map(item => item.toLowerCase());

	await writeJsonFile('index.json', data, {indent: undefined});
	console.log(`Saved ${data.length} TLDs!`);
};

module.exports = update;

if (require.main === module) {
	update();
}
