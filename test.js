const assert = require("assert");
const tlds = require(".");

assert(Array.isArray(tlds));
assert(tlds.length > 10);

for (const tld of tlds) {
  assert(tld);
  assert(typeof tld === "string");
}

assert(tlds.includes("com"));
assert(tlds.includes("net"));
