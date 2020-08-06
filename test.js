const tlds = require('.');
const test = require('ava');

test('main', t => {
  t.true(Array.isArray(tlds));
  tlds.forEach(tld => {
    t.is(typeof tld, 'string');
  });
});
