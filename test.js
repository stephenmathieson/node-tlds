const assert = require('assert');
const tlds = require('.');

assert(tlds);
assert(tlds.length);
assert('[object Array]' == {}.toString.call(tlds));

for (var i = 0, len = tlds.length; i < len; i++) {
  assert(tlds[i]);
}
