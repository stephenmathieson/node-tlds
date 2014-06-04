
var request = require('superagent');
var fs = require('fs');

var url = process.argv[2] || 'http://data.iana.org/TLD/tlds-alpha-by-domain.txt';

request.get(url).end(function (err, res) {
  if (err) throw err;

  var tlds = [];

  res.text.split('\n').forEach(function (line) {
    line = line.trim().toLowerCase();
    if ('#' === line[0]) return;
    if (line.length > 0) tlds.push(line);
  });

  tlds = tlds.sort();

  var data = '\nmodule.exports = ' + JSON.stringify(tlds, null, 2) + ';\n';
  fs.writeFile(__dirname + '/index.js', data, function (err) {
    if (err) throw err;
    console.log('saved %d TLDs', tlds.length);
  });
});
