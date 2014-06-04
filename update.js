
var punycode = require('punycode');
var request = require('superagent');
var fs = require('fs');

var url = process.argv[2] || 'http://data.iana.org/TLD/tlds-alpha-by-domain.txt';

request.get(url).end(function (err, res) {
  if (err) throw err;

  var str = '\nmodule.exports = [';
  var count = 0;

  res.text.split('\n').forEach(function (line) {
    line = line.trim().toLowerCase();
    if (0 === line.length) return;
    if ('#' === line[0]) return; // comment

    // unicode TLDs (http://stackoverflow.com/a/9724529/376773)
    if ('xn--' === line.substring(0, 4)) {
      var decoded = punycode.decode(line.substring(4));
      str += '\n  "' + decoded + '", // ' + line;
    } else {
      str += '\n  "' + line + '",';
    }
    count++;
  });

  // remove trailing `,` char
  str = str.substring(0, str.length - 1);

  str += '\n];\n';

  fs.writeFile(__dirname + '/index.js', str, function (err) {
    if (err) throw err;
    console.log('saved %d TLDs', count);
  });
});
