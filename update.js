const { decode: decodePunycode } = require("punycode/");
const got = require("got");
const isPunycode = require("is-punycode");
const fs = require("fs");

const update = async () => {
  const { body } = await got(
    "http://data.iana.org/TLD/tlds-alpha-by-domain.txt"
  );

  const data = body
    .split("\n")
    .slice(1, -1)
    .map((item) => (isPunycode(item) ? decodePunycode(item.slice(4)) : item))
    .map((item) => item.toLowerCase())
    .sort();

  fs.writeFileSync("index.json", JSON.stringify(data, null, 2));
  console.log(`Saved ${data.length} TLDs!`);
};

update();
