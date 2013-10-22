
var request = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

var url = process.argv[2]
    || 'http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains';


request.get(url).end(function (err, res) {
  if (err) throw err;

  var $ = cheerio.load(res.text);
  var links = $('table.wikitable.sortable td:first-child a[title]');
  var tlds = [];

  links.each(function () {
    var title = this.attr('title');
    if (/\.([a-z]+)/i.exec(title)) tlds.push(RegExp.$1);
  });

  tlds = tlds.sort();

  var data = '\nmodule.exports = ' + JSON.stringify(tlds, null, 2) + ';\n';
  fs.writeFile(__dirname + '/index.js', data, function (err) {
    if (err) throw err;
    console.log('saved %d TLDs', tlds.length);
  });
});
